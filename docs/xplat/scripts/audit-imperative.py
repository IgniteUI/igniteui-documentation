"""Finds collapsed sections whose hand-written blocks were code but whose fence now emits markup.

Turning an imperative block into markup is not a style change: a value set declaratively can be
reapplied when the framework re-renders, so the imperative path may be the only one that holds. Any
section where the platforms taught it in code has to keep teaching it in code.

Compares each collapsed section against the same section before the collapse, and reports the ones
where the web platforms' blocks were assignments and the fence asks for markup.
"""

import re
import subprocess
import sys

from platform_blocks import leaf_blocks_of

BASE = 'bc240f0a6'
DOCS = 'docs/xplat/src/content/en/components'

MARKUP_LANGS = {'html', 'razor', 'xaml', 'tsx'}
CODE_LANGS = {'ts', 'csharp', 'cs', 'java', 'py'}
WEB = {'Angular', 'React', 'WebComponents'}


def original(path):
    try:
        return subprocess.run(['git', 'show', f'{BASE}:{DOCS}/{path}'],
                              capture_output=True, text=True, check=True).stdout
    except subprocess.CalledProcessError:
        return None


def sections(text):
    """Each heading, with the platform blocks under it."""
    out = {}
    marks = [(m.start(), m.group(0).strip()) for m in re.finditer(r'^#+ .*$', text, re.M)]
    for i, (start, heading) in enumerate(marks):
        end = marks[i + 1][0] if i + 1 < len(marks) else len(text)
        out[heading] = text[start:end]
    return out


def block_kinds(section):
    """What each platform's block in this section looks like: markup, code, or both."""
    kinds = {}
    for b in leaf_blocks_of(section):
        body = section[b['body_start']:b['body_end']]
        for f in re.finditer(r'```(\w+)\n([\s\S]*?)```', body):
            lang, body = f.group(1), f.group(2)
            if lang in MARKUP_LANGS and re.search(r'^\s*<', body, re.M):
                kind = 'markup'
            elif lang in CODE_LANGS or re.search(r'^\s*(var|const|let|this\.|public|await)\b',
                                                 body, re.M):
                kind = 'code'
            else:
                kind = 'markup'
            for platform in b['platforms']:
                kinds.setdefault(platform, set()).add(kind)
    # A section with no platform blocks may still have bare fences
    if not kinds:
        for f in re.finditer(r'```(\w+)\n([\s\S]*?)```', section):
            if f.group(1) in CODE_LANGS:
                kinds.setdefault('all', set()).add('code')
    return kinds


changed = subprocess.run(['git', 'diff', '--name-only', BASE, '--', DOCS],
                         capture_output=True, text=True).stdout.split()
suspects = []
for full in changed:
    path = full.split('/components/')[-1]
    before = original(path)
    if before is None:
        continue
    try:
        after = open(f'{DOCS}/{path}', encoding='utf-8').read()
    except FileNotFoundError:
        continue
    if '```json-snippet' not in after:
        continue

    for heading, section in sections(after).items():
        fences = list(re.finditer(r'```json-snippet *([^\n]*)\n', section))
        if not fences:
            continue
        was = block_kinds(sections(before).get(heading, ''))
        web_kinds = set()
        for platform, kinds in was.items():
            if platform in WEB or platform == 'all':
                web_kinds |= kinds
        if not web_kinds:
            continue
        # A section that also emits a code or handler fence has kept its imperative teaching; the
        # markup fence beside it is the element the code configures, which is what the pages did.
        channels = [dict(re.findall(r'(\w+)="([^"]*)"', f.group(1))).get('channel', 'markup')
                    for f in fences]
        if any(c not in ('markup',) for c in channels):
            continue
        for fence in fences:
            attrs = dict(re.findall(r'(\w+)="([^"]*)"', fence.group(1)))
            channel = attrs.get('channel', 'markup')
            # Any code at all in what it replaced, not only code alone: a section that showed a
            # bare element in markup and set the interesting property in code is exactly the case
            # that must not become markup, and requiring code-only missed all of those.
            if channel == 'markup' and 'code' in web_kinds:
                suspects.append((path, heading.strip('# '), sorted(was.items())))

if not suspects:
    print('nothing found: no section that taught code now emits markup')
for path, heading, was in suspects:
    print(f'{path}\n    {heading}')
    for platform, kinds in was:
        print(f'      {platform}: {", ".join(sorted(kinds))}')
