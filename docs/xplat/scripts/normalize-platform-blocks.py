"""Splits platform blocks so that one never scopes both prose and snippets.

A block that wraps a heading, its prose and then the code for it is doing two jobs at once, and
every tool that works in spans then has to guess where one ends and the other begins. The Japanese
mirror deleted three sections that way, and a collapse that replaced "the blocks in this section"
dropped the scoping around them.

Splitting it costs nothing and settles the ambiguity, because visibility is preserved: the prose and
the snippets keep the same `for=` list, they simply stop sharing a block.

    <PlatformBlock for="Angular, React">        <PlatformBlock for="Angular, React">
    ## Processing Polygons                      ## Processing Polygons
    Some prose.                        =>       Some prose.
    ```ts                                       </PlatformBlock>
    ...                                         <PlatformBlock for="Angular, React">
    ```                                         ```ts
    </PlatformBlock>                            ...
                                                ```
                                                </PlatformBlock>

The generated output must not change: run generate.mjs before and after and compare.

    python3 normalize-platform-blocks.py [--write] [path ...]
"""

import glob
import re
import sys

WRITE = '--write' in sys.argv
PATTERNS = [a for a in sys.argv[1:] if not a.startswith('--')] or \
           ['src/content/*/components/**/*.mdx']

OPEN = re.compile(r'<PlatformBlock\s+for="([^"]+)">')
CLOSE = re.compile(r'</PlatformBlock>')
FENCE = re.compile(r'^```[^\n]*\n[\s\S]*?^```[ \t]*$', re.M)
HEADING = re.compile(r'^#{1,6} .+$', re.M)


def segments(body):
    """The block's contents as alternating prose and snippet runs, in order."""
    fences = [(m.start(), m.end()) for m in FENCE.finditer(body)]
    if not fences:
        return [('prose', body)]

    out, at = [], 0
    run_start = None
    for i, (start, end) in enumerate(fences):
        if run_start is None:
            if body[at:start].strip():
                out.append(('prose', body[at:start]))
            run_start = start
        # a run continues while only whitespace separates one fence from the next
        last = i + 1 == len(fences) or body[end:fences[i + 1][0]].strip()
        if last:
            out.append(('snippets', body[run_start:end]))
            at = end
            run_start = None
    if body[at:].strip():
        out.append(('prose', body[at:]))
    return out


def leaf_blocks(text):
    """
    Every block that holds no other block, with its platform list and body.

    Depth aware, because these do nest — a Web Components block inside an Angular one — and pairing
    an opener with the first closer after it takes the inner block's closer, which mangles the body
    and leaves the outer block's tail outside any block at all. A block with something nested in it
    is left alone: what it holds is another block, not loose prose.
    """
    events = sorted([(m.start(), m.end(), 'open', m.group(1)) for m in OPEN.finditer(text)] +
                    [(m.start(), m.end(), 'close', None) for m in CLOSE.finditer(text)])
    stack, leaves = [], []
    for start, end, kind, platforms in events:
        if kind == 'open':
            stack.append({'start': start, 'body_at': end, 'platforms': platforms, 'children': 0})
        elif stack:
            frame = stack.pop()
            if frame['children'] == 0:
                leaves.append((frame['start'], end, frame['platforms'],
                               text[frame['body_at']:start]))
            if stack:
                stack[-1]['children'] += 1
    return sorted(leaves)


def normalized(text):
    out, last, splits = '', 0, 0
    for start, end, platforms, body in leaf_blocks(text):
        parts = segments(body)
        # Only worth splitting when a heading shares the block with snippets: that is the shape that
        # makes a grouping ambiguous. Prose alone, or snippets alone, is already unambiguous.
        if len(parts) < 2 or not HEADING.search(body) or \
                not any(kind == 'snippets' for kind, _ in parts):
            continue
        # Everything that is not a snippet moves out of the snippet block, into a block of its own
        # with the same platform list, so visibility is untouched.
        rebuilt = '\n\n'.join(f'<PlatformBlock for="{platforms}">\n{part.strip()}\n</PlatformBlock>'
                              for _, part in parts if part.strip())
        out += text[last:start] + rebuilt
        last = end
        splits += 1
    out += text[last:]
    return out, splits


files = []
for pattern in PATTERNS:
    files.extend(sorted(glob.glob(pattern, recursive=True)))

touched, total = 0, 0
for path in files:
    text = open(path, encoding='utf-8').read()
    if '<PlatformBlock' not in text:
        continue
    result, splits = normalized(text)
    if splits == 0:
        continue
    # The same blocks, the same fences, the same headings — only the boundaries move.
    assert len(HEADING.findall(result)) == len(HEADING.findall(text)), path
    assert len(FENCE.findall(result)) == len(FENCE.findall(text)), path
    touched += 1
    total += splits
    print(f'{path.split("/content/")[-1]}: {splits} block(s) split')
    if WRITE:
        open(path, 'w', encoding='utf-8').write(result)

print(f'\n{total} block(s) in {touched} file(s){"" if WRITE else " — nothing written, pass --write"}')
