/**
 * llms.ts
 *
 * All logic for generating llms.txt content:
 *   – LlmsMeta / LlmsSet types
 *   – Frontmatter extraction via gray-matter
 *   – Sidebar slug collection
 *   – Label disambiguation for AI readability
 *   – buildLlmsTxt() – the single function integration.ts calls
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/** LLM-facing metadata for a documentation page, derived from frontmatter. */
export interface LlmsMeta {
    /** Description shown in llms.txt. Precedence: llms.description > llmsdescription > description */
    description?: string;
    /** Keyword tags. Precedence: llms.keywords > llmskeywords */
    keywords?: string[];
}

/** A named documentation subset that generates its own combined .txt file under /_llms-txt/. */
export interface LlmsSet {
    /** Display label — also used to derive the URL slug (e.g. "React Grids" → /_llms-txt/react-grids.txt). */
    label: string;
    /** Glob patterns matching page slugs to include. */
    paths: string[];
    /** Short description shown next to the link in llms.txt. */
    description?: string;
}

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

export interface SidebarItem {
    label?: string;
    slug?: string;
    items?: SidebarItem[];
}

interface FrontmatterData {
    title?: string;
    description?: string;
    llmsdescription?: string;
    llmskeywords?: string | string[];
    llms?: {
        description?: string;
        keywords?: string[];
    };
}

// ---------------------------------------------------------------------------
// Frontmatter extraction
// ---------------------------------------------------------------------------

export function extractLlmsMeta(raw: string): LlmsMeta {
    let data: FrontmatterData;
    try {
        data = matter(raw).data as FrontmatterData;
    } catch {
        return {};
    }
    const description: string | undefined =
        data.llms?.description ??
        (typeof data.llmsdescription === 'string' ? data.llmsdescription : undefined) ??
        (typeof data.description === 'string' ? data.description : undefined);
    const rawKw = data.llms?.keywords ?? data.llmskeywords;
    const keywords: string[] | undefined = Array.isArray(rawKw)
        ? rawKw
        : typeof rawKw === 'string' ? [rawKw] : undefined;
    return {
        ...(description !== undefined ? { description } : {}),
        ...(keywords?.length ? { keywords } : {}),
    };
}

// ---------------------------------------------------------------------------
// Sidebar slug collection
// ---------------------------------------------------------------------------

export function collectSlugs(items: SidebarItem[]): string[] {
    return items.flatMap(item => [
        ...(typeof item.slug === 'string' ? [item.slug] : []),
        ...(Array.isArray(item.items) ? collectSlugs(item.items) : []),
    ]);
}

// ---------------------------------------------------------------------------
// Build a slug → LlmsMeta map by reading source files
// ---------------------------------------------------------------------------

export function buildLlmsMetaMap(docsDir: string, items: SidebarItem[]): Map<string, LlmsMeta> {
    const map = new Map<string, LlmsMeta>();
    for (const slug of collectSlugs(items)) {
        for (const ext of ['.mdx', '.md']) {
            try {
                const raw = fs.readFileSync(path.join(docsDir, slug + ext), 'utf-8');
                const meta = extractLlmsMeta(raw);
                if (meta.description || meta.keywords?.length) map.set(slug, meta);
                break;
            } catch { /* try next ext */ }
        }
    }
    return map;
}

// ---------------------------------------------------------------------------
// Label generation
// ---------------------------------------------------------------------------

/** Derives a URL-safe slug from a label (matches github-slugger for plain ASCII). */
export function toUrlSlug(label: string): string {
    return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/, '');
}

// ---------------------------------------------------------------------------
// Broad sections — platform-defined navigation buckets
// ---------------------------------------------------------------------------

/**
 * Top-level navigation buckets for Ignite UI documentation.
 * These labels are treated as organisational groupings, never as label prefixes.
 */
export const IGDOCS_BROAD_SECTIONS = [
    'AI-Assisted Development',
    'General',
    'Interactivity',
    'Grids & Lists',
    'Dashboards',
    'Charts',
    'Maps',
    'Layouts',
    'Menus',
    'Frameworks',
    'Gauges',
    'Data Entry & Display',
    'Interactions',
    'Notifications',
    'Scheduling',
    'Styling & Themes',
    'Deprecated Components',
] as const;

/** Platforms that use the Ignite UI doc broad sections. */
const IGDOCS_PLATFORMS = new Set<string>(['angular', 'react', 'blazor', 'web-components']);

/**
 * Returns the set of broad-section labels for the given platform.
 * Returns an empty set for platforms with no defined broad sections (appbuilder, slingshot).
 */
export function getBroadSectionsForPlatform(platform: string | null): ReadonlySet<string> {
    if (platform !== null && IGDOCS_PLATFORMS.has(platform)) {
        return new Set(IGDOCS_BROAD_SECTIONS);
    }
    return new Set();
}

/** Returns `true` when the label is a broad navigation bucket, not a meaningful label prefix. */
function isBroadSection(label: string, broadSections: ReadonlySet<string>): boolean {
    return broadSections.has(label);
}

// ---------------------------------------------------------------------------

const GENERIC_WORDS = new Set([
    'Overview', 'Introduction', 'Getting Started', 'Quick Start',
    'Examples', 'Reference', 'Guide', 'Tutorial', 'Configuration', 'Usage',
    'Theming', 'Sorting', 'Editing', 'Filtering', 'Grouping', 'Paging',
    'Selection', 'Summaries', 'Toolbar', 'Export', 'Virtualization',
    'Accessibility', 'Localization', 'Styling',
]);

function isGeneric(label: string): boolean {
    return GENERIC_WORDS.has(label) || [...GENERIC_WORDS].some(w => label.startsWith(w + ' '));
}

/** Strips a leading `"<prefix> "` from label if present, avoiding "Editing Editing Overview". */
function stripLeadingDuplicate(label: string, prefix: string): string {
    const candidate = `${prefix} `;
    return label.startsWith(candidate) ? label.slice(candidate.length) : label;
}

/**
 * Build an AI-readable label for a leaf page.
 *
 * Broad-section ancestors (navigation buckets like "Grids & Lists", "Charts")
 * are stripped from the ancestor path first — they carry no prefix value.
 * The remaining (component/subsection) ancestors determine context:
 *
 *   filtered 0 — no meaningful ancestors: label as-is.
 *     e.g. "Getting Started" under "General" → "Getting Started"
 *
 *   filtered 1 — one component ancestor:
 *     - generic label  → `component label`   e.g. "Grid Overview"
 *     - specific label → `label`             e.g. "List"
 *
 *   filtered 2+ — component + subsection ancestors:
 *     - generic label  → `component subsection label`  e.g. "Grid Editing Overview"
 *     - specific label → `component label`             e.g. "Grid Cell Editing"
 *     (stripLeadingDuplicate avoids "Grid Editing Editing Overview")
 */
function buildLabel(label: string, ancestorPath: string[], broadSections: ReadonlySet<string> = new Set()): string {
    // Strip navigation buckets — they are not useful label prefixes.
    const filtered = ancestorPath.filter(a => !isBroadSection(a, broadSections));

    if (filtered.length === 0) return label;

    if (filtered.length === 1) {
        const parent = filtered[0];
        return isGeneric(label) ? `${parent} ${label}` : label;
    }

    const component  = filtered[filtered.length - 2];
    const subsection = filtered[filtered.length - 1];

    if (isGeneric(label)) {
        const deduped = stripLeadingDuplicate(label, subsection);
        return `${component} ${subsection} ${deduped}`;
    }

    return `${component} ${label}`;
}

// ---------------------------------------------------------------------------
// Sidebar walk + llms.txt line generation
// ---------------------------------------------------------------------------

function walkLlmsItems(
    items: SidebarItem[],
    base: string,
    lines: string[],
    meta: Record<string, LlmsMeta>,
    seen: Set<string>,
    ancestorPath: string[] = [],
    depth = 0,
    broadSections: ReadonlySet<string> = new Set(),
): void {
    const groups: SidebarItem[] = [];

    for (const item of items) {
        if (item.slug !== undefined) {
            const slug = item.slug === '' ? 'index' : item.slug;
            if (seen.has(slug)) continue;
            seen.add(slug);

            const label = buildLabel(item.label ?? slug, ancestorPath, broadSections);
            const m = meta[slug];
            let line = `- [${label}](${base}/${slug}.md)`;
            if (m?.description) line += `: ${m.description}`;
            lines.push(line);
            if (m?.keywords?.length) lines.push(`  Tags: ${m.keywords.join(', ')}`);
            continue;
        }
        if (Array.isArray(item.items) && item.items.length > 0) groups.push(item);
    }

    for (const group of groups) {
        if (depth < 3) {
            const headingLevel = depth === 0 ? 2 : depth + 2;
            lines.push('', `${'#'.repeat(headingLevel)} ${group.label}`, '');
        }
        walkLlmsItems(
            group.items!,
            base,
            lines,
            meta,
            seen,
            [...ancestorPath, group.label ?? ''],
            depth + 1,
            broadSections,
        );
    }
}

// ---------------------------------------------------------------------------
// Public builder
// ---------------------------------------------------------------------------

export function buildLlmsTxt(
    base: string,
    siteTitle: string,
    siteDescription: string,
    sidebarItems: SidebarItem[],
    metaMap: Map<string, LlmsMeta>,
    llmsSets: LlmsSet[] = [],
    broadSections: ReadonlySet<string> = new Set(),
): string {
    const lines: string[] = [
        `# ${siteTitle}`,
        '',
        `> ${siteDescription}`,
        '',
        '## Documentation sets',
        '',
        `- [Abridged documentation](${base}/llms-small.txt): a compact version of the documentation, with non-essential content removed`,
        `- [Combined docs](${base}/llms-full.txt): Single-file Markdown export of all docs.`,
        ``
    ];

    for (const set of llmsSets) {
        const slug = toUrlSlug(set.label);
        const link = `- [${set.label}](${base}/_llms-txt/${slug}.txt)`;
        lines.push(set.description ? `${link}: ${set.description}` : link);
    }

    walkLlmsItems(sidebarItems, base, lines, Object.fromEntries(metaMap), new Set(), [], 0, broadSections);
    return lines.join('\n');
}
