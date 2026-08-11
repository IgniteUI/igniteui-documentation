"""Finds headings that sit inside a platform block they should not be inside.

A heading inside a <PlatformBlock> is often deliberate: a section that only applies to one platform
is written that way, heading and all. The accidental case is a block that was left open, which
swallows the headings after it — so those readers never see the heading, and anything working in
spans, like the Japanese mirror, deletes whole sections when it replaces the block.

The two are told apart by what the heading's own section holds. If the section carries content for
platforms the enclosing block excludes, then the heading belongs to all of them and is trapped:

    <PlatformBlock for="WebComponents">
    ```ts
    ...
    ```
    ## Dependencies          <-- every platform has content under this
    </PlatformBlock>
    <PlatformBlock for="Angular"> ...

Bare fences are not evidence either way: the generator tells those apart by their content, so a
section of them inside a platform block is filtered anyway. What is reported is a section holding
blocks for platforms the enclosing block shuts out, which nothing can reconcile.

    python3 audit-trapped-headings.py [path ...]
"""

import glob
import re
import sys

from platform_blocks import blocks_of

PATHS = sys.argv[1:] or ['src/content/*/components/**/*.mdx']

BLOCK = re.compile(r'<PlatformBlock\s+for="([^"]+)">|</PlatformBlock>')
HEADING = re.compile(r'^#{1,6} .+$', re.M)
FENCE = re.compile(r'^```(\w+)', re.M)


def enclosing_blocks(text):
    """For each heading, the platform sets of the blocks it sits inside."""
    open_stack = []
    events = []
    for m in BLOCK.finditer(text):
        events.append((m.start(), m.group(1)))
    inside = {}
    for h in HEADING.finditer(text):
        stack = []
        for at, platforms in events:
            if at > h.start():
                break
            if platforms is None:
                if stack:
                    stack.pop()
            else:
                stack.append({p.strip() for p in platforms.split(',')})
        if stack:
            inside[h.start()] = (h.group(0), stack[-1])
    return inside


def section_platforms(text, start, end):
    """Which platforms have content under this heading, and whether any of it is unfiltered."""
    section = text[start:end]
    platforms = set()
    found = blocks_of(section)
    for b in found:
        if FENCE.search(section[b['body_start']:b['body_end']]):
            platforms |= set(b['platforms'])
    covered = [(b['start'], b['end']) for b in found]
    bare = any(not any(s <= m.start() < e for s, e in covered)
               for m in FENCE.finditer(section)
               if m.group(1) != 'json-snippet')
    return platforms, bare


files = []
for pattern in PATHS:
    files.extend(sorted(glob.glob(pattern, recursive=True)))

found = 0
for path in files:
    text = open(path, encoding='utf-8').read()
    if '<PlatformBlock' not in text:
        continue
    heads = [m.start() for m in HEADING.finditer(text)]
    trapped = enclosing_blocks(text)
    for i, start in enumerate(heads):
        if start not in trapped:
            continue
        heading, allowed = trapped[start]
        end = heads[i + 1] if i + 1 < len(heads) else len(text)
        platforms, bare = section_platforms(text, start, end)
        # Content for a platform the enclosing block shuts out, or content nothing filters at all.
        outside = platforms - allowed
        if not outside:
            continue
        found += 1
        where = path.split('/content/')[-1]
        print(f'{where}\n    {heading.strip()}')
        print(f'      enclosed by: {", ".join(sorted(allowed))}')
        if outside:
            print(f'      section also serves: {", ".join(sorted(outside))}')
        if bare:
            print(f'      (it also has fences nothing filters)')

print(f'\n{found} heading(s) trapped in a block their section outgrows, across {len(files)} file(s)')
