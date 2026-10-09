import { promises as fs } from 'node:fs';
import { printViolations, scopeFiles, validateSettingsFrom } from '../cli-support.js';
import { discover } from '../discover.js';
import { hasErrors, validateTranslation, type Violation } from '../validate.js';
import type { ResolvedConfig } from '../types.js';

export async function cmdValidate(
  cfg: ResolvedConfig,
  locales: string[] | undefined,
  file: string | undefined,
  dir: string | undefined,
  json: boolean,
): Promise<number> {
  // Audit mode filters silently - an unknown --file path just yields nothing,
  // so scope.error is intentionally ignored here (unlike translate/judge).
  const files = scopeFiles(await discover(cfg, locales), file, dir).files;
  const validateSettings = validateSettingsFrom(cfg);

  const report: Array<{
    file: string;
    locale: string;
    violations: Violation[];
  }> = [];
  for (const f of files) {
    const source = await fs.readFile(f.sourceAbs, 'utf-8');
    for (const [code, t] of Object.entries(f.targets)) {
      if (t.state === 'missing') continue;
      const translated = await fs.readFile(t.targetAbs, 'utf-8');
      const violations = validateTranslation(source, translated, validateSettings);
      if (violations.length) report.push({ file: f.relPath, locale: code, violations });
    }
  }

  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else if (report.length === 0) {
    console.log('no violations found');
  } else {
    for (const r of report) printViolations(r.file, r.locale, r.violations, true);
    const errors = report.reduce(
      (n, r) => n + r.violations.filter((v) => v.severity === 'error').length,
      0,
    );
    const warns = report.reduce(
      (n, r) => n + r.violations.filter((v) => v.severity === 'warn').length,
      0,
    );
    console.log(
      `\n${errors} error(s), ${warns} warning(s) across ${report.length} file-locale pair(s)`,
    );
  }
  return report.some((r) => hasErrors(r.violations)) ? 2 : 0;
}
