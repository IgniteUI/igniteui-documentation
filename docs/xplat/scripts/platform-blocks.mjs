/**
 * Depth-aware reading of <PlatformBlock> spans.
 *
 * These nest — a Web Components block inside an Angular one is common in the grid topics — so
 * pairing an opener with the first closer after it takes the *inner* block's closer. Everything
 * downstream is then working with a body that stops halfway and a tail that looks like it belongs to
 * no block at all. That mistake silently deleted three sections from a Japanese topic before this
 * existed, so anything that needs a block's extent uses this rather than a regex of its own.
 */

const OPEN = /<PlatformBlock\s+for="([^"]+)">/g;
const CLOSE = /<\/PlatformBlock>/g;

/**
 * Every block in the text, innermost first, each with:
 *   start, end        the whole element, opening tag through closing tag
 *   bodyStart, bodyEnd  what is between the tags
 *   platforms         the for= list, split and trimmed
 *   depth             1 for a top level block
 *   children          how many blocks it directly contains
 */
export function blocksOf(text) {
    const events = [];
    for (const m of text.matchAll(OPEN)) {
        events.push({ at: m.index, after: m.index + m[0].length, kind: 'open', list: m[1] });
    }
    for (const m of text.matchAll(CLOSE)) {
        events.push({ at: m.index, after: m.index + m[0].length, kind: 'close' });
    }
    events.sort((a, b) => a.at - b.at);

    const stack = [], blocks = [];
    for (const e of events) {
        if (e.kind === 'open') {
            stack.push({ start: e.at, bodyStart: e.after, list: e.list, children: 0 });
            continue;
        }
        const frame = stack.pop();
        if (!frame) continue;                       // a stray closer; the page is unbalanced
        blocks.push({
            start: frame.start, end: e.after,
            bodyStart: frame.bodyStart, bodyEnd: e.at,
            platforms: frame.list.split(',').map(s => s.trim()),
            depth: stack.length + 1,
            children: frame.children,
        });
        if (stack.length) stack[stack.length - 1].children++;
    }
    return blocks.sort((a, b) => a.start - b.start);
}

/** The blocks that contain no other block, which is where a topic's content actually lives. */
export function leafBlocksOf(text) {
    return blocksOf(text).filter(b => b.children === 0);
}

/** Whether the text's blocks are balanced, which every reader here assumes. */
export function isBalanced(text) {
    const opens = (text.match(/<PlatformBlock\s+for="[^"]+">/g) || []).length;
    const closes = (text.match(/<\/PlatformBlock>/g) || []).length;
    return opens === closes;
}
