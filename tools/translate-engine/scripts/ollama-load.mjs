#!/usr/bin/env node
// Report what an Ollama host is doing right now.
//
//   node scripts/ollama-load.mjs [--url http://host:11434] [--model translategemma:27b]
//
// Ollama exposes NO queue-depth or load endpoint: /api/ps reports only which
// models are resident, and /metrics does not exist (404). What every
// /api/generate response DOES carry is its own sub-timings, so anything the
// server spent NOT working on our request is time it spent waiting for the GPU:
//
//   queue = total_duration - (load_duration + prompt_eval_duration + eval_duration)
//
// Two caveats worth knowing before you trust the number:
//   - Measuring costs you the wait. The probe queues like any other request, so
//     a busy host makes this script slow. That IS the signal.
//   - It cannot tell WHOSE work is in front of it. A bulk translate run of your
//     own looks exactly like a colleague hammering the box.

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const url = argOf('--url', process.env.OLLAMA_URL ?? 'http://10.20.14.98:11434');
const model = argOf('--model', 'translategemma:27b');

const ns = (n) => (n ?? 0) / 1e9;
const fmt = (n) => `${n.toFixed(1)}s`;

async function main() {
  // 1. Reachability + resident models.
  let ps;
  try {
    const res = await fetch(`${url}/api/ps`, { signal: AbortSignal.timeout(10_000) });
    ps = await res.json();
  } catch (err) {
    console.error(`unreachable: ${url}`);
    console.error(`  ${err.message}`);
    console.error(
      '  If this is an internal 10.x address, check the VPN before assuming it is down.',
    );
    process.exit(1);
  }

  const resident = ps.models ?? [];
  console.log(`host: ${url}`);
  if (resident.length === 0) {
    console.log('resident: (none — first request will pay the model load cost)');
  } else {
    for (const m of resident) {
      const secs = Math.round((new Date(m.expires_at) - Date.now()) / 1000);
      console.log(
        `resident: ${m.name}  vram ${(m.size_vram / 1e9).toFixed(1)}GB  ctx ${m.context_length}  unloads in ${secs}s`,
      );
    }
  }

  // 2. Timing probe. num_predict is capped so generation is negligible and the
  //    total is dominated by whatever we had to wait behind.
  process.stdout.write(`probing with ${model} (queues behind active work)… `);
  const started = Date.now();
  let j;
  try {
    const res = await fetch(`${url}/api/generate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: 'Say OK.',
        stream: false,
        options: { num_predict: 4 },
      }),
      signal: AbortSignal.timeout(600_000),
    });
    j = await res.json();
  } catch (err) {
    console.log('');
    console.error(`probe failed after ${fmt((Date.now() - started) / 1000)}: ${err.message}`);
    process.exit(1);
  }
  console.log('done');

  const load = ns(j.load_duration);
  const prefill = ns(j.prompt_eval_duration);
  const evalT = ns(j.eval_duration);
  const total = ns(j.total_duration);
  const queue = Math.max(0, total - load - prefill - evalT);

  console.log(`  load ${fmt(load)} | prefill ${fmt(prefill)} | eval ${fmt(evalT)}`);
  console.log(`  total ${fmt(total)}  ->  queue ${fmt(queue)}`);

  if (j.eval_count && evalT > 0) {
    console.log(`  throughput ${(j.eval_count / evalT).toFixed(1)} tok/s (uncontended rate)`);
  }

  if (queue < 5) console.log('\nIDLE — nothing else is generating. Good time to start a bulk run.');
  else if (queue < 60)
    console.log('\nLIGHT LOAD — something is running; a bulk run will be slower than benchmark.');
  else
    console.log(
      '\nBUSY — the GPU is saturated. A bulk run will crawl; wait or expect multi-hour timings.',
    );
}

await main();
