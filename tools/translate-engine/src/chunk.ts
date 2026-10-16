// Greedy index chunker: pack item indices into groups bounded by BOTH a max
// item count and a max total character length. Used by the JSON-batch LLM
// translator (prompt.ts) to batch many short strings into one request while
// keeping each request within a provider's context/size budget.
//
// It returns INDICES, not the strings, so the caller can map each translated
// result back to its original slot. Worked example (small limits for clarity):
//
//   chunkIndices(['Overview', 'Save', 'Cancel', 'Delete', 'Edit'],
//                { maxItems: 2, maxChars: 100 })
//     => [[0, 1], [2, 3], [4]]
//
//   The translator then sends group [0,1] as ONE request  {"0":"Overview","1":"Save"},
//   group [2,3] as another, and [4] as the last - 3 requests instead of 5.
//
// Why the two caps (real values: 20 items / 6000 chars, from prompt.ts
// BATCH_LIMITS): pack too MANY items into one JSON object and the model starts
// dropping or misassigning keys; pack too MANY chars and the request blows the
// context/output budget. "Greedy" = fill each group as full as possible before
// opening the next, i.e. the FEWEST requests that still respect both caps.

export interface ChunkLimits {
  maxItems: number;
  maxChars: number;
}

export function chunkIndices(texts: string[], limits: ChunkLimits): number[][] {
  const { maxItems, maxChars } = limits;
  const chunks: number[][] = [];
  let cur: number[] = [];
  let curChars = 0;
  for (let i = 0; i < texts.length; i++) {
    const len = texts[i].length;
    // Close the current group before adding item i when it's already full - by
    // count (>= maxItems) OR because adding this item would exceed maxChars. The
    // `cur.length > 0` guard guarantees forward progress even if a single string
    // is itself larger than maxChars: it still gets its own group of one rather
    // than looping forever on an always-empty group.
    if (cur.length > 0 && (cur.length >= maxItems || curChars + len > maxChars)) {
      chunks.push(cur);
      cur = [];
      curChars = 0;
    }
    cur.push(i);
    curChars += len;
  }
  if (cur.length) chunks.push(cur);
  return chunks;
}
