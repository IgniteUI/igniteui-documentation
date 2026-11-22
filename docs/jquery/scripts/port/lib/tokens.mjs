/**
 * `%%Name%%` build-time tokens of the old help.
 *
 * The values are NOT in this repository: they are read from the old tool's token table (a JSON
 * object of name to value, where `<%= major %>` and `<%= minor %>` stand for the volume release),
 * passed on the command line. This file only says what kind each token is:
 * - text tokens become literal text;
 * - URL tokens become the doc set's environment keys (`{environment:key}`), which the site
 *   replaces at build time; in code, where the site does not replace them, the literal value is
 *   written instead;
 * - jQueryApiUrl and HelpRootUrl links are resolved by the API link and topic link steps; only a
 *   use those steps leave (for example the API root) falls back to an environment key.
 */
import fs from 'node:fs';

/** Token name → environment key, for the tokens that stand for a URL. */
export const URL_TOKENS = {
    SamplesUrl: 'demosBaseUrl',
    SamplesEmbedUrl: 'helpSamplesUrl',
    // The old tool defined NewSamplesUrl as SamplesUrl.
    NewSamplesUrl: 'demosBaseUrl',
    DesignerUrl: 'designerUrl',
    HelpRootUrl: 'helpRootUrl',
    jQueryApiUrl: 'jQueryApiUrl',
};

export const TOKEN_RE = /%%([A-Za-z0-9_]+)%%/g;

export function loadTokenTable(file, version) {
    const [major, minor] = String(version).split('.');
    if (!major || minor === undefined) throw new Error(`--version must be <major>.<minor>, got "${version}"`);
    const raw = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
    const values = {};
    for (const [name, value] of Object.entries(raw)) {
        if (typeof value !== 'string') continue;
        values[name] = value.replace(/<%=\s*major\s*%>/g, major).replace(/<%=\s*minor\s*%>/g, minor);
    }
    // Defined by the old tool itself rather than in the table.
    if (values.NewSamplesUrl === undefined && values.SamplesUrl !== undefined) values.NewSamplesUrl = values.SamplesUrl;
    return values;
}

/**
 * Creates the token replacer and its report.
 * @param {Record<string,string>} values token table
 */
export function createTokens(values) {
    const report = { replacedText: {}, replacedEnv: {}, replacedLiteralUrl: {}, noValue: [] };
    const bump = (bucket, name) => { bucket[name] = (bucket[name] ?? 0) + 1; };

    /** Replaces tokens in prose: text tokens literal, URL tokens as environment keys. */
    function inText(value, where) {
        return value.replace(TOKEN_RE, (match, name) => {
            if (URL_TOKENS[name]) {
                bump(report.replacedEnv, name);
                return `{environment:${URL_TOKENS[name]}}`;
            }
            if (values[name] !== undefined) {
                bump(report.replacedText, name);
                return values[name];
            }
            report.noValue.push({ token: name, where: where?.() ?? null });
            return match;
        });
    }

    /** Replaces tokens with literal values everywhere (code, titles, plain labels). */
    function literal(value, where) {
        return value.replace(TOKEN_RE, (match, name) => {
            if (values[name] !== undefined) {
                bump(URL_TOKENS[name] ? report.replacedLiteralUrl : report.replacedText, name);
                return values[name];
            }
            report.noValue.push({ token: name, where: where?.() ?? null });
            return match;
        });
    }

    /** Without reporting, for the topic map and navigation labels. */
    function quiet(value) {
        return value.replace(TOKEN_RE, (match, name) => values[name] ?? match);
    }

    return { inText, literal, quiet, report, values };
}
