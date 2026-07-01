import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';

const ROOT = process.cwd();
const CONTENT_ROOTS = [
    'docs/angular/src/content/en',
    'docs/angular/src/content/jp',
    'docs/xplat/src/content/en',
    'docs/xplat/src/content/jp'
];

const execFileAsync = promisify(execFile);
const FRONTMATTER = /^---[ \t]*\r?\n([\s\S]*?)^---[ \t]*(?:\r?\n|$)/gm;
const MOJIBAKE = /(?:\u00e2\u20ac|\u00c2|\u00c3|\ufffd)/;
const MARKETING = /\b(?:try it(?: now)?|try it for free|check out (?:our )?examples and demos)\b/i;
const GENERIC_OPENING = /^(?:the following|this (?:example|topic|section)|in this example|below\b|here,)/i;
const JAPANESE_TEXT = /[\u3040-\u30ff\u3400-\u9fff]/;

async function findTopicFiles() {
    const { stdout } = await execFileAsync('git', [
        'ls-files', '--cached', '--others', '--exclude-standard', '--', ...CONTENT_ROOTS
    ], { cwd: ROOT, maxBuffer: 10 * 1024 * 1024 });

    return stdout.split(/\r?\n/)
        .filter((file) => /\.mdx?$/.test(file))
        .map((file) => path.join(ROOT, file));
}

function findMetadataBlocks(source) {
    const withoutBom = source.replace(/^\uFEFF/, '');
    if (withoutBom.startsWith('---')) {
        FRONTMATTER.lastIndex = 0;
        const first = FRONTMATTER.exec(withoutBom);
        return first ? [first] : [];
    }

    if (!withoutBom.startsWith('<ComponentBlock')) return [];
    const firstImport = withoutBom.search(/^import\s/m);
    const metadataRegion = firstImport === -1 ? withoutBom : withoutBom.slice(0, firstImport);
    FRONTMATTER.lastIndex = 0;
    return [...metadataRegion.matchAll(FRONTMATTER)];
}

function decodeDescription(value) {
    const trimmed = value.trim();
    if (trimmed.startsWith('"')) {
        try {
            return JSON.parse(trimmed);
        } catch {
            return null;
        }
    }
    if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
        return trimmed.slice(1, -1).replace(/''/g, "'");
    }
    return trimmed.replace(/\s+#.*$/, '').trim();
}

function inspectDescription(description, locale) {
    const issues = [];
    const minimumLength = locale === 'jp' ? 20 : 40;

    if (description.length < minimumLength) issues.push(`is too short (${description.length} characters; minimum ${minimumLength})`);
    if (description.length > 300) issues.push(`is too long (${description.length} characters; maximum 300)`);
    if (MOJIBAKE.test(description)) issues.push('contains mojibake or a replacement character');
    if (MARKETING.test(description)) issues.push('contains marketing call-to-action boilerplate');
    if (/\bS(?:Start|Handle)\b/.test(description)) issues.push('contains a stray leading "S"');
    if (GENERIC_OPENING.test(description)) issues.push('starts with generic page-oriented wording');
    if (/<[^>]+>|\[[^\]]+\]\([^)]+\)/.test(description)) issues.push('contains HTML or a Markdown link');
    if (/(?:,\.|;\.|:\.|\.\.\.)|:\s*$/.test(description)) issues.push('contains suspicious punctuation');
    if (locale === 'jp' && !JAPANESE_TEXT.test(description)) issues.push('does not contain Japanese text');

    return issues;
}

function inspectFrontmatter(file, source, body, blockStart, locale, report) {
    const lines = body.split(/\r?\n/);
    const llmsIndexes = lines.flatMap((line, index) => /^llms:\s*(?:#.*)?$/.test(line) ? [index] : []);
    const baseLine = source.slice(0, blockStart).split(/\r?\n/).length;

    if (llmsIndexes.length === 0) {
        report(file, baseLine, 'missing llms.description');
        return;
    }
    if (llmsIndexes.length > 1) {
        report(file, baseLine + llmsIndexes[1] + 1, 'contains more than one llms block');
        return;
    }

    const llmsIndex = llmsIndexes[0];
    let descriptionLine = -1;
    for (let index = llmsIndex + 1; index < lines.length; index += 1) {
        if (/^\S/.test(lines[index])) break;
        if (/^[ \t]+description:/.test(lines[index])) {
            descriptionLine = index;
            break;
        }
    }

    if (descriptionLine === -1) {
        report(file, baseLine + llmsIndex + 1, 'missing llms.description');
        return;
    }

    const rawValue = lines[descriptionLine].replace(/^[ \t]+description:\s*/, '');
    if (!rawValue || /^[>|]/.test(rawValue)) {
        report(file, baseLine + descriptionLine + 1, 'llms.description must be a nonempty single-line scalar');
        return;
    }

    const description = decodeDescription(rawValue);
    if (description === null) {
        report(file, baseLine + descriptionLine + 1, 'llms.description has invalid quoting');
        return;
    }
    if (!description.trim()) {
        report(file, baseLine + descriptionLine + 1, 'llms.description is empty');
        return;
    }

    for (const issue of inspectDescription(description, locale)) {
        report(file, baseLine + descriptionLine + 1, `llms.description ${issue}`);
    }
}

const problems = [];
let fileCount = 0;
let frontmatterCount = 0;

const files = await findTopicFiles();
for (const file of files) {
    const normalizedFile = file.replaceAll('\\', '/');
    const locale = normalizedFile.includes('/content/jp/') ? 'jp' : 'en';
    fileCount += 1;
    const source = await readFile(file, 'utf8');
    const matches = findMetadataBlocks(source);
    const relativeFile = path.relative(ROOT, file).replaceAll('\\', '/');

    if (matches.length === 0) {
        problems.push({ file: relativeFile, line: 1, message: 'missing YAML frontmatter and llms.description' });
        continue;
    }

    frontmatterCount += matches.length;
    for (const match of matches) {
        inspectFrontmatter(relativeFile, source, match[1], match.index, locale, (problemFile, line, message) => {
            problems.push({ file: problemFile, line, message });
        });
    }
}

if (problems.length > 0) {
    console.error(`LLM metadata validation failed with ${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`);
    for (const problem of problems) console.error(`${problem.file}:${problem.line} - ${problem.message}`);
    process.exitCode = 1;
} else {
    console.log(`LLM metadata validation passed: ${frontmatterCount} frontmatter blocks in ${fileCount} English and Japanese topic files.`);
}
