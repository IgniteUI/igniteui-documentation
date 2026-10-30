/**
 * A minimal stand-in for the `LoaderContext` Astro hands a content loader.
 *
 * Only the parts the glob loader and the overlay wrapper actually touch are
 * implemented: an in-memory store, a watcher whose handlers can be fired by
 * hand, a logger that records what it was told, a passthrough `parseData` and
 * an `entryTypes` map with a tiny frontmatter parser.
 */

import crypto from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/** One stored content entry, as far as these tests are concerned. */
export interface FakeEntry {
    id: string;
    data?: { title?: string };
    filePath?: string;
    [key: string]: unknown;
}

/** A log line the loader emitted, as `[level, message]`. */
export type LogLine = [level: string, message: string];

export interface FakeContext {
    /** The object to pass to `loader.load(...)`. */
    ctx: Record<string, unknown>;
    /** The entries the loaders wrote, keyed by id. */
    entries: Map<string, FakeEntry>;
    /** Everything the loaders logged, in order. */
    logs: LogLine[];
    /** Fires every handler registered for `event`, awaiting each one. */
    trigger: (event: string, filePath: string) => Promise<void>;
    /** Handlers registered on the watcher, keyed by event name. */
    handlers: Map<string, Array<(filePath: string) => unknown>>;
    /** Title of the entry stored under `id`, or `undefined`. */
    title: (id: string) => string | undefined;
    /** `filePath` of the entry stored under `id` — relative to `config.root`. */
    filePathOf: (id: string) => string | undefined;
}

/** Parses `---`-delimited frontmatter with one `key: value` pair per line. */
function parseFrontmatter(contents: string): { data: Record<string, string>; body: string } {
    const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(contents);
    const data: Record<string, string> = {};
    for (const line of (match?.[1] ?? '').split('\n')) {
        const separator = line.indexOf(':');
        if (separator > 0) data[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
    }
    return { data, body: match?.[2] ?? contents };
}

/**
 * Builds a fake loader context rooted at `projectRoot`.
 *
 * @param projectRoot - Directory the entries' `filePath`s are made relative to.
 * @param options.watcher - Pass `false` to build a context without a watcher,
 *   the way a production build calls the loader.
 */
export function createFakeContext(
    projectRoot: string,
    { watcher: withWatcher = true }: { watcher?: boolean } = {},
): FakeContext {
    const entries = new Map<string, FakeEntry>();
    const logs: LogLine[] = [];
    const handlers = new Map<string, Array<(filePath: string) => unknown>>();

    const store = {
        keys: () => entries.keys(),
        entries: () => entries.entries(),
        values: () => entries.values(),
        has: (id: string) => entries.has(id),
        get: (id: string) => entries.get(id),
        set: (entry: FakeEntry) => {
            entries.set(entry.id, entry);
            return true;
        },
        delete: (id: string) => entries.delete(id),
        addModuleImport() { /* not used by these tests */ },
        addAssetImports() { /* not used by these tests */ },
    };

    const watcher: Record<string, unknown> = {
        add() { /* the real watcher would start watching a path */ },
        on(event: string, handler: (filePath: string) => unknown) {
            const list = handlers.get(event) ?? [];
            list.push(handler);
            handlers.set(event, list);
            return watcher;
        },
    };

    const trigger = async (event: string, filePath: string): Promise<void> => {
        for (const handler of handlers.get(event) ?? []) await handler(filePath);
    };

    const logger = {
        info: (message: string) => void logs.push(['info', message]),
        warn: (message: string) => void logs.push(['warn', message]),
        error: (message: string) => void logs.push(['error', message]),
        debug: () => { /* too noisy to record */ },
    };

    const entryType = {
        getEntryInfo: async ({ contents }: { contents: string }) => parseFrontmatter(contents),
    };

    const ctx: Record<string, unknown> = {
        config: {
            root: pathToFileURL(projectRoot + path.sep),
            srcDir: pathToFileURL(path.join(projectRoot, 'src') + path.sep),
            prerenderConflictBehavior: 'warn',
        },
        collection: 'docs',
        logger,
        watcher: withWatcher ? watcher : undefined,
        store,
        parseData: async ({ data }: { data: unknown }) => data,
        generateDigest: (value: string) => crypto.createHash('md5').update(value).digest('hex'),
        entryTypes: new Map([['.md', entryType], ['.mdx', entryType]]),
    };

    return {
        ctx,
        entries,
        logs,
        trigger,
        handlers,
        title: (id: string) => entries.get(id)?.data?.title,
        filePathOf: (id: string) => entries.get(id)?.filePath,
    };
}
