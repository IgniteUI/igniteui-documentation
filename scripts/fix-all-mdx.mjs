/**
 * fix-all-mdx.mjs
 * 
 * Comprehensive MDX fixer that processes all failing files.
 * Applies targeted fixes, then writes the result.
 * 
 * 1. Remove orphaned HTML table fragments (broken <table>/<tbody>/<tr> blocks)
 * 2. Strip inline <a name=""> anchors from markdown table cells
 * 3. Replace <li> used as bullet markers in markdown table cells
 * 4. Escape <div>, <T>, <script> in markdown table cells/paragraphs
 * 5. Strip the duplicate body H1 (Starlight renders frontmatter `title` as the H1)
 * 6. Backslash-escape remaining unescaped `{` / `}` outside code fences
 * 7. Fix comma in tag names, quotes in attributes
 * 8. Fix orphaned </p>, </script>, </div> tags
 */
import fs from 'node:fs';
import path from 'node:path';
import { compile } from '@mdx-js/mdx';
import remarkFrontmatter from 'remark-frontmatter';

const MDX_OPTS = { jsx: true, remarkPlugins: [remarkFrontmatter] };

const topicsArg = process.argv.find(a => a.startsWith('--topics='));
const topicsDir = topicsArg
  ? path.resolve(topicsArg.slice('--topics='.length))
  : path.resolve('docs/jquery/src/content/en/topics');
const apply = process.argv.includes('--apply');

function walkMdx(d) {
  const results = [];
  for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
    const full = path.join(d, entry.name);
    if (entry.isDirectory()) results.push(...walkMdx(full));
    else if (entry.name.endsWith('.mdx')) results.push(full);
  }
  return results;
}

/**
 * Remove broken HTML table blocks.
 * A "broken" table block is one where <table> has mismatched internal structure.
 * Strategy: Remove entire <table>...</table> blocks that are broken,
 * keeping only the text content.
 */
function removeBrokenTableBlocks(content) {
  const lines = content.split('\n');
  const result = [];
  let i = 0;
  let inCode = false;

  while (i < lines.length) {
    const trimmed = lines[i].trimStart();
    
    if (trimmed.startsWith('```')) {
      inCode = !inCode;
      result.push(lines[i]);
      i++;
      continue;
    }
    
    if (inCode) {
      result.push(lines[i]);
      i++;
      continue;
    }

    // Detect HTML table start
    if (/^<table\b/i.test(trimmed)) {
      // Collect the table block
      const tableStart = i;
      const tableLines = [];
      let depth = 0;
      let j = i;
      while (j < lines.length) {
        tableLines.push(lines[j]);
        const opens = (lines[j].match(/<table\b/gi) || []).length;
        const closes = (lines[j].match(/<\/table>/gi) || []).length;
        depth += opens - closes;
        j++;
        if (depth <= 0) break;
      }

      // Check if this table is structurally sound
      const block = tableLines.join('\n');
      const isValid = isTableValid(block);
      
      if (isValid) {
        // Keep valid tables as-is
        for (const l of tableLines) result.push(l);
      } else {
        // Extract meaningful content from broken table
        const extracted = extractTableContent(tableLines);
        if (extracted.length > 0) {
          result.push(''); // blank line before
          for (const l of extracted) result.push(l);
          result.push(''); // blank line after
        }
      }
      i = j;
      continue;
    }

    result.push(lines[i]);
    i++;
  }

  return result.join('\n');
}

function isTableValid(block) {
  // Quick check: count opening/closing tags
  const trOpen = (block.match(/<tr\b/gi) || []).length;
  const trClose = (block.match(/<\/tr>/gi) || []).length;
  const tdOpen = (block.match(/<td\b/gi) || []).length;
  const tdClose = (block.match(/<\/td>/gi) || []).length;
  const thOpen = (block.match(/<th\b/gi) || []).length;
  const thClose = (block.match(/<\/th>/gi) || []).length;
  const tbodyOpen = (block.match(/<tbody\b/gi) || []).length;
  const tbodyClose = (block.match(/<\/tbody>/gi) || []).length;
  const theadOpen = (block.match(/<thead\b/gi) || []).length;
  const theadClose = (block.match(/<\/thead>/gi) || []).length;
  
  // Check basic matching
  if (trOpen !== trClose) return false;
  if (tdOpen !== tdClose) return false;
  if (thOpen !== thClose) return false;
  if (tbodyOpen !== tbodyClose) return false;
  if (theadOpen !== theadClose) return false;
  
  // Check no tr directly after tbody/thead/tfoot without content
  if (/<(?:tbody|thead|tfoot)\b[^>]*>\s*<\/tr>/i.test(block)) return false;
  
  return true;
}

function extractTableContent(tableLines) {
  // Extract text content from broken HTML table, converting to simple list format
  const result = [];
  let inCode = false;
  
  for (const line of tableLines) {
    const trimmed = line.trim();
    
    // Skip pure structural tags
    if (/^<\/?(?:table|thead|tbody|tfoot|tr)\b[^>]*>\s*$/i.test(trimmed)) continue;
    if (/^<\/?(?:table|thead|tbody|tfoot|tr)\b/i.test(trimmed) && 
        !/<(?:td|th)\b/i.test(trimmed)) continue;
    
    // Extract content from td/th cells
    let text = trimmed;
    text = text.replace(/<\/?(?:table|thead|tbody|tfoot|tr|td|th)\b[^>]*>/gi, '');
    text = text.trim();
    
    if (text) {
      result.push(text);
    }
  }
  
  return result;
}

/**
 * Fix <li> used as bullet-point markers in markdown table cells.
 * Also strip orphaned <ul>/<ol>/<li>/<\/li> tags.
 * Only operates outside code blocks.
 */
function fixLiInTableCells(content) {
  const lines = content.split('\n');
  const result = [];
  let inCode = false;
  
  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      inCode = !inCode;
      result.push(line);
      continue;
    }
    if (inCode) {
      result.push(line);
      continue;
    }
    
    let fixed = line;
    // Replace </li><li> patterns
    fixed = fixed.replace(/<\/li>\s*<li>/gi, '\n- ');
    // Replace <li>
    fixed = fixed.replace(/<li>\s*/gi, '- ');
    // Remove </li>
    fixed = fixed.replace(/\s*<\/li>/gi, '');
    // Remove <ul> and </ul>
    fixed = fixed.replace(/<\/?ul\b[^>]*>/gi, '');
    // Remove <ol> and </ol>
    fixed = fixed.replace(/<\/?ol\b[^>]*>/gi, '');
    
    result.push(fixed);
  }
  
  return result.join('\n');
}

/**
 * Escape HTML tags that appear in markdown table cells or paragraphs
 * and get misinterpreted by MDX parser.
 */
function escapeProblematicHtmlInProse(content) {
  const lines = content.split('\n');
  const result = [];
  let inCode = false;
  let inHtmlBlock = false;

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trimStart();

    if (trimmed.startsWith('```')) {
      inCode = !inCode;
      result.push(line);
      continue;
    }
    if (inCode) {
      result.push(line);
      continue;
    }

    // Track HTML block elements (only proper block-level starts)
    if (/^<(?:table|div|p|details|summary|pre)\b/i.test(trimmed)) {
      inHtmlBlock = true;
    }
    // <script> starting a line: check if it's a real script block (has </script>)
    // or just an orphaned/example tag
    if (/^<script\b/i.test(trimmed)) {
      // Look ahead for </script> in the next few lines
      let hasClose = false;
      for (let j = idx; j < Math.min(idx + 50, lines.length); j++) {
        if (/<\/script>/i.test(lines[j])) { hasClose = true; break; }
        if (j > idx && /^[#|]/.test(lines[j].trimStart())) break; // hit markdown, stop
      }
      if (hasClose) {
        inHtmlBlock = true;
      } else {
        // Orphaned <script> - escape it
        result.push(line.replace(/<script\b[^>]*>/gi, (m) => m.replace(/</g, '&lt;')));
        continue;
      }
    }
    if (/^<\/(?:table|div|p|script|style|details|summary|pre)>/i.test(trimmed)) {
      result.push(line);
      inHtmlBlock = false;
      continue;
    }
    if (inHtmlBlock) {
      result.push(line);
      continue;
    }

    // In markdown table rows, escape problematic inline HTML
    if (trimmed.startsWith('|')) {
      let fixed = line;
      // Escape <div> in table cells - but NOT when it's a real HTML block
      fixed = fixed.replace(/<div\b[^>]*>/gi, (m) => m.replace(/</g, '&lt;'));
      fixed = fixed.replace(/<\/div>/gi, '&lt;/div&gt;');
      // Escape <script> in table cells
      fixed = fixed.replace(/<script\b[^>]*>/gi, (m) => m.replace(/</g, '&lt;'));
      fixed = fixed.replace(/<\/script>/gi, '&lt;/script&gt;');
      // Escape <T> (generic type parameter appearing as tag)
      fixed = fixed.replace(/<T>/gi, '&lt;T&gt;');
      // Escape <ul> and </ul> in table cells (when inline, not block)
      fixed = fixed.replace(/<ul\b[^>]*>/gi, (m) => m.replace(/</g, '&lt;'));
      fixed = fixed.replace(/<\/ul>/gi, '&lt;/ul&gt;');
      // Escape pseudo-generic types: List<object>, <PrimaryKey, Value>, etc.
      fixed = fixed.replace(/(?<=\w)<(object|string|int|bool|T|K|V)\b/gi, '&lt;$1');
      fixed = fixed.replace(/<(\w+),\s*(\w+)\s*>/g, '&lt;$1, $2&gt;');
      result.push(fixed);
      continue;
    }

    // In regular prose, escape problematic tags that appear mid-paragraph
    if (!trimmed.startsWith('<')) {
      let fixed = line;
      // Escape <div> in prose
      if (/<div\b/i.test(fixed)) {
        fixed = fixed.replace(/<div\b[^>]*>/gi, (m) => m.replace(/</g, '&lt;'));
        fixed = fixed.replace(/<\/div>/gi, '&lt;/div&gt;');
      }
      // Escape <script> in prose
      if (/<script\b/i.test(fixed)) {
        fixed = fixed.replace(/<script\b[^>]*>/gi, (m) => m.replace(/</g, '&lt;'));
        fixed = fixed.replace(/<\/script>/gi, '&lt;/script&gt;');
      }
      // Escape <tr>, <td> in prose paragraphs (not in HTML blocks)
      if (/<tr\b/i.test(fixed)) {
        fixed = fixed.replace(/<tr\b[^>]*>/gi, (m) => m.replace(/</g, '&lt;'));
        fixed = fixed.replace(/<\/tr>/gi, '&lt;/tr&gt;');
      }
      if (/<td\b/i.test(fixed)) {
        fixed = fixed.replace(/<td\b[^>]*>/gi, (m) => m.replace(/</g, '&lt;'));
        fixed = fixed.replace(/<\/td>/gi, '&lt;/td&gt;');
      }
      result.push(fixed);
      continue;
    }

    result.push(line);
  }

  return result.join('\n');
}

/**
 * Strip <a name='...'></a> anchors.
 */
function stripInlineAnchors(content) {
  return content.replace(/<a\s+name\s*=\s*['"][^'"]*['"]\s*>\s*<\/a>/gi, '');
}

/**
 * Fix specific known syntax issues.
 */
function fixMiscSyntax(content) {
  const lines = content.split('\n');
  const result = [];
  let inCode = false;
  
  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      inCode = !inCode;
      result.push(line);
      continue;
    }
    if (inCode) {
      result.push(line);
      continue;
    }
    
    let fixed = line;
    // Fix <tag,attr> - comma in tag name (e.g. <td,nowrap>)
    fixed = fixed.replace(/<(\w+),(\w+)/g, '<$1 $2');
    // Fix </a></a> double close anchors
    fixed = fixed.replace(/<\/a>\s*<\/a>/g, '</a>');
    // Escape pseudo-generic types like <PrimaryKey, Value>, < Dictionary of values >
    // These have commas or leading spaces inside angle brackets (not real HTML)
    fixed = fixed.replace(/<\s+(\w)/g, '&lt; $1');  // < space word
    fixed = fixed.replace(/<(\w+),\s*/g, '&lt;$1, ');  // <Word, (after fixMiscSyntax already ran, this catches remaining)
    // Remove <tbody> and </tbody> - they're optional in HTML and cause mismatches in MDX
    fixed = fixed.replace(/<\/?tbody\b[^>]*>/gi, '');
    
    result.push(fixed);
  }
  
  return result.join('\n');
}

/**
 * Wrap indented <script>...</script> blocks (not in code fences) in code fences.
 * These are template examples that contain HTML like <tr>/<td> that break MDX.
 */
function wrapIndentedScriptBlocks(content) {
  const lines = content.split('\n');
  const result = [];
  let inCode = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trimStart().startsWith('```')) {
      inCode = !inCode;
      result.push(line);
      continue;
    }
    if (inCode) {
      result.push(line);
      continue;
    }
    
    // Detect indented <script ...> that is NOT in a code block
    if (/^\s{2,}<script\b/i.test(line)) {
      // Collect lines until </script>
      const block = [line];
      let j = i + 1;
      let foundClose = false;
      while (j < lines.length && j < i + 50) {
        block.push(lines[j]);
        if (/<\/script>/i.test(lines[j])) { foundClose = true; j++; break; }
        j++;
      }
      if (foundClose) {
        result.push('```html');
        for (const bl of block) result.push(bl);
        result.push('```');
        i = j - 1;
        continue;
      }
    }
    
    result.push(line);
  }
  
  return result.join('\n');
}

/**
 * Escape orphaned </script> tags outside code blocks and real script blocks.
 */
function escapeOrphanedClosingTags(content) {
  const lines = content.split('\n');
  const result = [];
  let inCode = false;
  let inScript = false;
  
  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      inCode = !inCode;
      result.push(line);
      continue;
    }
    if (inCode) { result.push(line); continue; }
    
    if (/^\s*<script\b/i.test(line)) { inScript = true; }
    if (inScript && /<\/script>/i.test(line)) { inScript = false; result.push(line); continue; }
    
    // Orphaned </script> not in a script block
    if (!inScript && /^\s*<\/script>/i.test(line)) {
      result.push(line.replace(/<\/script>/gi, '&lt;/script&gt;'));
      continue;
    }
    
    result.push(line);
  }
  
  return result.join('\n');
}

/**
 * Fix mismatched </a> inside <td> that was opened in a different <td>.
 * e.g. <td>2.0</a></td> where there is no opening <a> in that <td>.
 * Works both single-line and per-line within multi-line HTML tables.
 */
function fixMismatchedAnchorsInTd(content) {
  const lines = content.split('\n');
  const result = [];
  let inCode = false;
  
  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      inCode = !inCode;
      result.push(line);
      continue;
    }
    if (inCode) { result.push(line); continue; }
    
    let fixed = line;
    // Single-line: <td>...</a></td> where no <a> was opened
    fixed = fixed.replace(/<td\b[^>]*>((?:(?!<td|<a\b).)*?)<\/a>((?:(?!<td).)*?)<\/td>/gi, (match, before, after) => {
      return `<td>${before}${after}</td>`;
    });
    // Just orphaned </a> on a line that has <td> but no <a>
    if (/<td\b/i.test(fixed) && /<\/a>/i.test(fixed) && !/<a\b/i.test(fixed)) {
      fixed = fixed.replace(/<\/a>/gi, '');
    }
    // Orphaned </a> on any line that has no <a> opening
    if (/<\/a>/i.test(fixed) && !/<a\b/i.test(fixed)) {
      fixed = fixed.replace(/<\/a>/gi, '');
    }
    
    result.push(fixed);
  }
  
  return result.join('\n');
}

/**
 * Close unclosed <table> blocks. Detects when markdown content resumes after
 * an HTML table block (without </table>), and inserts </table>.
 * Also adds missing </tr> before <tr> or </table>.
 */
function closeUnclosedTables(content) {
  const lines = content.split('\n');
  const result = [];
  let inCode = false;
  let inTable = false;
  let inTr = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimStart();
    
    if (trimmed.startsWith('```')) {
      inCode = !inCode;
      result.push(line);
      continue;
    }
    if (inCode) { result.push(line); continue; }
    
    if (/^<table\b/i.test(trimmed)) {
      inTable = true;
      inTr = false;
      result.push(line);
      continue;
    }
    
    if (/<\/table>/i.test(line)) {
      if (inTr) { result.push('</tr>'); inTr = false; }
      inTable = false;
      result.push(line);
      continue;
    }
    
    if (inTable) {
      // Track <tr> opens/closes
      if (/^\s*<tr\b/i.test(trimmed)) {
        if (inTr) result.push('</tr>');
        inTr = true;
        result.push(line);
        continue;
      }
      if (/^\s*<\/tr>/i.test(trimmed)) {
        if (!inTr) {
          // Orphaned </tr> - skip it
          continue;
        }
        inTr = false;
        result.push(line);
        continue;
      }
      
      // If we encounter markdown content (headers, paragraphs, images) while in table,
      // the table was never closed
      if (/^#{1,6}\s/.test(trimmed) || /^!\[/.test(trimmed) || /^\*\*/.test(trimmed) || 
          (/^\w/.test(trimmed) && !/</.test(trimmed) && trimmed.length > 10)) {
        if (inTr) { result.push('</tr>'); inTr = false; }
        result.push('</table>');
        result.push('');
        inTable = false;
      }
      
      result.push(line);
      continue;
    }
    
    result.push(line);
  }
  
  // If file ends while still in table
  if (inTable) {
    if (inTr) result.push('</tr>');
    result.push('</table>');
  }
  
  return result.join('\n');
}

/**
 * Escape unescaped { } in prose text.
 * Skips YAML frontmatter (where `{` is a literal char and gets resolved
 * dynamically by src/content-helper.ts), and converts bare `{environment:Foo}`
 * tokens in body to MDX-escaped `\{environment:Foo\}` so they survive MDX
 * parsing and remain dynamic via remark-docfx.
 */
function escapeBracesInProse(content) {
  // Split frontmatter from body so we never touch YAML braces.
  const fmMatch = content.match(/^(---\r?\n[\s\S]*?\r?\n---\r?\n?)/);
  const frontmatter = fmMatch ? fmMatch[1] : '';
  const body = fmMatch ? content.slice(frontmatter.length) : content;

  const lines = body.split('\n');
  let inCode = false;
  const result = [];

  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      inCode = !inCode;
      result.push(line);
      continue;
    }
    if (inCode) {
      result.push(line);
      continue;
    }
    // Skip markdown table header separators
    if (/^\s*\|[\s-|:]+\|\s*$/.test(line)) {
      result.push(line);
      continue;
    }

    // Escape ALL { and } outside code fences - even inside backtick code spans
    // MDX v3 parses braces in table cells even within inline code
    let out = '';
    let i = 0;
    while (i < line.length) {
      if (line[i] === '{') {
        // Check if already &#123;
        if (i >= 5 && line.slice(i - 5, i) === '&#123') {
          out += line[i];
          i++;
          continue;
        }
        // Already MDX-escaped as `\{`
        if (i >= 1 && line[i - 1] === '\\') {
          out += line[i];
          i++;
          continue;
        }
        // Bare `{environment:Foo}` — convert to MDX-escaped form so the
        // token survives the body-brace escape pass below and is still
        // recognised by the runtime resolver in remark-docfx.
        const envMatch = line.slice(i).match(/^\{environment:\w+\}/);
        if (envMatch) {
          out += '\\{' + envMatch[0].slice(1, -1) + '\\}';
          i += envMatch[0].length;
          continue;
        }
        out += '&#123;';
        i++;
        continue;
      }
      if (line[i] === '}') {
        // Check if part of HTML entity &#NNN;
        if (/&#\d+$/.test(line.slice(Math.max(0, i - 6), i))) {
          out += line[i];
          i++;
          continue;
        }
        // Already MDX-escaped as `\}`
        if (i >= 1 && line[i - 1] === '\\') {
          out += line[i];
          i++;
          continue;
        }
        out += '&#125;';
        i++;
        continue;
      }
      out += line[i];
      i++;
    }
    result.push(out);
  }
  return frontmatter + result.join('\n');
}

/**
 * Remove orphaned HTML table cell fragments (<td>, <th>, <tr>) 
 * that aren't inside a <table> block. These are leftover from
 * partial table conversion. Convert their content to plain text.
 */
function removeOrphanedTableCells(content) {
  const lines = content.split('\n');
  const result = [];
  let inCode = false;
  let inTable = 0; // depth counter for <table> blocks
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trimStart();

    if (trimmed.startsWith('```')) {
      inCode = !inCode;
      result.push(lines[i]);
      i++;
      continue;
    }
    if (inCode) {
      result.push(lines[i]);
      i++;
      continue;
    }

    // Track table depth
    const tableOpens = (lines[i].match(/<table\b/gi) || []).length;
    const tableCloses = (lines[i].match(/<\/table>/gi) || []).length;
    
    if (tableOpens > 0 || inTable > 0) {
      inTable += tableOpens - tableCloses;
      result.push(lines[i]);
      i++;
      continue;
    }

    // Outside any table: look for orphaned <td>/<th>/<tr> blocks
    if (/^\s*<(?:td|th)\b/i.test(trimmed)) {
      // Collect the cell content until closing tag or next structural element
      const cellContent = [];
      let j = i;
      let depth = 0;
      while (j < lines.length) {
        const t = lines[j].trimStart();
        // Count td/th opens and closes
        const opens = (lines[j].match(/<(?:td|th)\b/gi) || []).length;
        const closes = (lines[j].match(/<\/(?:td|th)>/gi) || []).length;
        depth += opens - closes;
        
        // Extract text content (strip HTML tags)
        let text = lines[j];
        text = text.replace(/<\/?(?:td|th|tr|ul|ol|li|br)\b[^>]*\/?>/gi, ' ');
        text = text.trim();
        if (text && text !== '</li>') cellContent.push(text);
        
        j++;
        if (depth <= 0 && j > i) break;
        // Safety: if we hit a markdown heading, table, or code fence, stop
        if (j > i && /^(?:#|```|\||\s*$)/.test(lines[j]?.trimStart() || '')) {
          break;
        }
      }
      
      // Output the extracted content
      for (const c of cellContent) {
        result.push(c);
      }
      result.push('');
      i = j;
      continue;
    }

    // Remove orphaned <tr> and </tr> lines
    if (/^\s*<\/?tr\b[^>]*>\s*$/i.test(trimmed)) {
      i++;
      continue;
    }

    // Remove orphaned </tbody>, </thead>, </tfoot> lines
    if (/^\s*<\/(?:tbody|thead|tfoot)>\s*$/i.test(trimmed)) {
      i++;
      continue;
    }

    result.push(lines[i]);
    i++;
  }

  return result.join('\n');
}

// Main
async function main() {
  const files = walkMdx(topicsDir);
  let fixedCount = 0;
  let alreadyOk = 0;
  const stillFailing = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8');
    const src = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;
    const rel = path.relative(topicsDir, file);

    let content = src;

    // Test if it already compiles
    try {
      await compile(content, MDX_OPTS);
      alreadyOk++;
      continue;
    } catch {}

    // Apply fixes in order
    // Compare write-decision against `src` (original disk content).
    content = stripInlineAnchors(content);
    content = fixMiscSyntax(content);
    content = fixLiInTableCells(content);
    content = removeBrokenTableBlocks(content);
    content = removeOrphanedTableCells(content);
    content = wrapIndentedScriptBlocks(content);
    content = escapeOrphanedClosingTags(content);
    content = fixMismatchedAnchorsInTd(content);
    content = closeUnclosedTables(content);
    content = escapeProblematicHtmlInProse(content);
    content = escapeBracesInProse(content);

    // Safety net: strip any HTML comments that survived earlier steps.
    // MDX cannot parse <!-- --> (errors on the `!` character).
    content = content.replace(/<!--[\s\S]*?-->/g, '');

    // Test if it compiles now
    let compiles = false;
    try {
      await compile(content, MDX_OPTS);
      compiles = true;
    } catch (e) {
      const msg = (e.message || '').split('\n')[0];
      stillFailing.push({ file: rel, error: msg.slice(0, 150) });
    }

    if (content !== src) {
      fixedCount++;
      if (apply) {
        const bom = raw.charCodeAt(0) === 0xFEFF ? '\uFEFF' : '';
        fs.writeFileSync(file, bom + content, 'utf-8');
        console.log(`  ${compiles ? 'FIXED' : 'PARTIAL'}: ${rel}`);
      } else {
        console.log(`  ${compiles ? 'WOULD FIX' : 'PARTIAL'}: ${rel}`);
      }
    }
  }

  console.log(`\nAlready OK: ${alreadyOk}`);
  console.log(`${apply ? 'Fixed' : 'Would fix'}: ${fixedCount}`);
  if (stillFailing.length > 0) {
    console.log(`Still failing: ${stillFailing.length}\n`);
    for (const { file, error } of stillFailing) {
      console.log(`  ${file}`);
      console.log(`    ${error}`);
    }
  }
}

main();
