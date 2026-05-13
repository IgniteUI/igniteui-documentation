/**
 * Remark plugin: environment variable substitution.
 *
 * Replaces `{environment:key}` tokens in markdown text, link URLs, image URLs,
 * and inline HTML with values from the project's environment.json.
 *
 * Resolution order for environment.json:
 *   1. {DOCS_SOURCE_PATH}/en/environment.json
 *   2. {DOCS_SOURCE_PATH}/environment.json
 *   3. {DOCS_SOURCE_PATH}/../environment.json
 *   4. {DOCS_SOURCE_PATH}/../en/environment.json
 *   5. Fallback: read demosBaseUrl from docConfig.json
 *
 * DOCS_ENV (or NODE_ENV) selects the env block: development | staging | production.
 */

import { visit } from 'unist-util-visit';
import fs from 'node:fs';
import path from 'node:path';

const ENV_PATTERN = /\{environment:(\w+)\}/g;

const DOCCONFIG_PLATFORM_MAP: Record<string, string> = {
  angular: 'Angular',
  react: 'React',
  'web-components': 'WebComponents',
  blazor: 'Blazor',
};

// Lazy-loaded, cached per DOCS_SOURCE_PATH value.
let _env: Record<string, string> | null = null;
let _envSourcePath: string | null = null;

function loadEnv(): Record<string, string> {
  const currentPath = process.env.DOCS_SOURCE_PATH ?? null;
  if (_env !== null && currentPath === _envSourcePath) return _env;
  _envSourcePath = currentPath;
  _env = null;

  if (!currentPath) { _env = {}; return _env; }
  const sourceRoot = path.resolve(currentPath);
  const parent = path.dirname(sourceRoot);

  const candidates = [
    path.join(sourceRoot, 'en', 'environment.json'),
    path.join(sourceRoot, 'environment.json'),
    path.join(parent, 'environment.json'),
    path.join(parent, 'en', 'environment.json'),
  ];

  const envPath = candidates.find(c => fs.existsSync(c));

  if (!envPath) {
    try {
      const envKey = process.env.DOCS_ENV ?? process.env.NODE_ENV ?? 'production';
      const platform = DOCCONFIG_PLATFORM_MAP[process.env.DOCS_PLATFORM ?? ''] ?? '';
      if (platform) {
        const configPath = path.resolve(process.cwd(), 'docConfig.json');
        const docConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        const demosUrl: string =
          docConfig[platform]?.samplesBrowsers?.[envKey] ??
          docConfig[platform]?.samplesBrowsers?.['development'] ?? '';
        _env = { dvDemosBaseUrl: demosUrl, demosBaseUrl: demosUrl, infragisticsBaseUrl: 'https://www.infragistics.com' };
      } else {
        _env = {};
      }
    } catch {
      _env = {};
    }
    return _env;
  }

  try {
    const data = JSON.parse(fs.readFileSync(envPath, 'utf-8'));
    const envKey = process.env.DOCS_ENV ?? process.env.NODE_ENV ?? 'production';
    _env = data[envKey] ?? data.production ?? {};
  } catch {
    _env = {};
  }
  return _env!;
}

/** Replace all `{environment:key}` tokens in a string. Exported for use by other modules. */
export function replaceEnvVars(str: string): string {
  if (!str || typeof str !== 'string') return str;
  const env = loadEnv();
  return str.replace(ENV_PATTERN, (_match, key) => env[key] ?? `{environment:${key}}`);
}

/** Remark plugin that substitutes `{environment:key}` tokens in the markdown AST. */
export function remarkEnvVars() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, (node: any) => {
      if (node.type === 'text' && node.value) {
        node.value = replaceEnvVars(node.value);
      }
      if (node.type === 'link' && node.url) {
        node.url = replaceEnvVars(node.url);
      }
      if (node.type === 'image' && node.url) {
        node.url = replaceEnvVars(node.url);
      }
      if (node.type === 'html' && node.value) {
        node.value = replaceEnvVars(node.value);
      }
    });
  };
}
