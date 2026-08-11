"""Depth-aware reading of <PlatformBlock> spans.

These nest, so pairing an opener with the first closer after it takes the inner block's closer — the
body then stops halfway and the tail looks like it belongs to no block at all.
"""
import re

_OPEN = re.compile(r'<PlatformBlock\s+for="([^"]+)">')
_CLOSE = re.compile(r'</PlatformBlock>')


def blocks_of(text):
    """(start, end, body_start, body_end, platforms, children) for every block, in order."""
    events = sorted([(m.start(), m.end(), 'open', m.group(1)) for m in _OPEN.finditer(text)] +
                    [(m.start(), m.end(), 'close', None) for m in _CLOSE.finditer(text)])
    stack, out = [], []
    for start, end, kind, platforms in events:
        if kind == 'open':
            stack.append([start, end, platforms, 0])
            continue
        if not stack:
            continue                                  # a stray closer; the page is unbalanced
        opened = stack.pop()
        out.append({'start': opened[0], 'end': end, 'body_start': opened[1], 'body_end': start,
                    'platforms': [p.strip() for p in opened[2].split(',')],
                    'children': opened[3]})
        if stack:
            stack[-1][3] += 1
    return sorted(out, key=lambda b: b['start'])


def leaf_blocks_of(text):
    """The blocks holding no other block, which is where a topic's content lives."""
    return [b for b in blocks_of(text) if b['children'] == 0]
