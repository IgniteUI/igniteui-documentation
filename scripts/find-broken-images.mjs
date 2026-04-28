import fs from 'fs';
import path from 'path';

const topicsArg = process.argv.find(a => a.startsWith('--topics='));
const TOPICS_DIR = topicsArg
  ? topicsArg.slice('--topics='.length)
  : 'docs/jquery/src/content/en/topics';

function walkMdx(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkMdx(full));
    else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) results.push(full);
  }
  return results;
}

const files = walkMdx(TOPICS_DIR);
const broken = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const imgRegex = /!\[[^\]]*\]\(([^)]+\.(?:png|jpg|gif|svg|jpeg|webp))\)/gi;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    let imgPath = match[1].split('#')[0].split('?')[0];
    try { imgPath = decodeURIComponent(imgPath); } catch {}
    if (imgPath.startsWith('http')) continue;
    const resolved = path.resolve(path.dirname(file), imgPath);
    if (!fs.existsSync(resolved)) {
      broken.push({ file, img: imgPath, resolved });
    }
  }
}

console.log(`Broken image references: ${broken.length}`);
for (const b of broken) {
  console.log(`  ${path.relative(TOPICS_DIR, b.file)}`);
  console.log(`    -> ${b.img}`);
}
