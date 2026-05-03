/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const DOCS_DIRS = [
  path.join(ROOT_DIR, 'docs'),
  path.join(ROOT_DIR, 'docs', 'roadmaps'),
  path.join(ROOT_DIR, 'docs', 'archive'),
  path.join(ROOT_DIR, 'docs', 'archive', 'roadmaps'),
  path.join(ROOT_DIR, 'docs', 'archive', 'roadmaps', 'core'),
  path.join(ROOT_DIR, 'docs', 'archive', 'roadmaps', 'enterprise'),
];

const ROOT_FILES = [
  path.join(ROOT_DIR, 'AGENTS.md'),
  path.join(ROOT_DIR, 'README.md'),
  path.join(ROOT_DIR, 'CLAUDE.md')
];

const LEGACY_FILES = [
  'week-1.md',
  'week-2.md',
  'week-3.md',
  'week-4.md',
  'week-5.md',
  'week-6.md',
  'week-7.md'
];

const FORBIDDEN_PATTERNS = [
  "You are ",
  "## TASK",
  "## OUTPUT",
  "Return ONLY",
  "No explanations"
];

const ENTERPRISE_TERMS = ['workspace', 'team', 'multi-user', 'collaboration'];
const CORE_PRINCIPLE_TERMS = ['single primary action', 'decision', 'clarity', 'focus'];
const INVALID_PATHS = ['docs/user-tests/', 'docs/archive/roadmaps/week-'];

let errorCount = 0;
let warningCount = 0;
const warnings = [];

function logError(file, message) {
  const rel = path.relative(ROOT_DIR, file);
  console.error(`❌ ${rel} → ${message}`);
  errorCount++;
}

function logWarning(file, message) {
  const rel = path.relative(ROOT_DIR, file);
  const fileName = path.basename(file);
  const isLegacy = LEGACY_FILES.includes(fileName);

  warnings.push(`${isLegacy ? '⚠️ (legacy)' : '⚠️'}  ${rel} → ${message}`);
  warningCount++;
}

function includesWholeWord(content, word) {
  const regex = new RegExp(`\\b${word}\\b`, 'i');
  return regex.test(content);
}

function getAllMarkdownFiles(dir) {
  let results = [];

  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath));
    } else if (file.endsWith('.md')) {
      results.push(fullPath);
    }

  });

  return results;
}

function scanFiles() {
  const files = [...ROOT_FILES];

  DOCS_DIRS.forEach(dir => {
    files.push(...getAllMarkdownFiles(dir));
  });

  return [...new Set(files)].filter(f => fs.existsSync(f) && fs.statSync(f).isFile());
}

// --- Strategic validators ---

function validateContextSeparation(filePath, content) {
  if (!filePath.includes(path.join('archive', 'roadmaps', 'core'))) return;

  ENTERPRISE_TERMS.forEach(term => {
    if (includesWholeWord(content, term)) {
      logWarning(filePath, `Core roadmap referencing enterprise concept: "${term}"`);
    }
  });
}

function validateEnterpriseContext(filePath, content) {
  if (!filePath.includes(path.join('archive', 'roadmaps', 'enterprise'))) return;

  const hasEnterpriseTerm = ENTERPRISE_TERMS.some(term =>
    includesWholeWord(content, term)
  );

  if (!hasEnterpriseTerm) {
    logWarning(filePath, `Enterprise roadmap missing enterprise terminology (${ENTERPRISE_TERMS.join(', ')})`);
  }
}

function validateStrategyAlignment(filePath, content) {
  if (!filePath.includes(path.join('archive', 'roadmaps'))) return;

  const strategyFile = path.join(ROOT_DIR, 'docs', 'strategy', 'enterprise-plan.md');
  if (!fs.existsSync(strategyFile)) return;

  const strategy = fs.readFileSync(strategyFile, 'utf8');

  const modules = [...new Set(
    [...strategy.matchAll(/MODULE\s+\d+/gi)].map(m => m[0].toUpperCase())
  )];

  if (modules.length === 0) return;

  const isAligned = modules.some(mod => content.toUpperCase().includes(mod));

  if (!isAligned) {
    logWarning(filePath, `Roadmap not aligned with enterprise modules (${modules.join(', ')})`);
  }
}

function validateCorePrinciples(filePath, content) {
  const isRoadmap =
    filePath.includes(path.join('archive', 'roadmaps')) ||
    filePath.endsWith('roadmap-current.md') ||
    filePath.endsWith('roadmap-history.md');

  if (!isRoadmap) return;

  const hasPrinciple = CORE_PRINCIPLE_TERMS.some(term =>
    content.toLowerCase().includes(term)
  );

  if (!hasPrinciple) {
    logWarning(filePath, `Roadmap missing core principle reference (${CORE_PRINCIPLE_TERMS.join(', ')})`);
  }
}

function validateInvalidPaths(filePath, content) {
  INVALID_PATHS.forEach(pattern => {
    if (content.includes(pattern)) {
      logWarning(filePath, `Reference to outdated path: "${pattern}"`);
    }
  });
}

// --- Core linter ---

function lintFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);

  // RULE GROUP 4 — BASIC QUALITY
  if (!content.trim()) {
    logError(filePath, 'File is empty or contains only whitespace');
    return;
  }

  const codeBlocks = (content.match(/```/g) || []).length;
  if (codeBlocks % 2 !== 0) {
    logError(filePath, 'Broken markdown patterns: unmatched code blocks (```)');
  }

  // RULE GROUP 1 — FORBIDDEN CONTENT
  FORBIDDEN_PATTERNS.forEach(pattern => {
    if (content.includes(pattern)) {
      logError(filePath, `Found forbidden pattern: "${pattern}"`);
    }
  });

  // RULE GROUP 2 — REQUIRED STRUCTURE
  if (fileName === 'AGENTS.md') {
    if (!content.includes('RUN MODES')) logError(filePath, 'Missing required section: "RUN MODES"');
    if (!content.includes('FINAL RULE')) logError(filePath, 'Missing required section: "FINAL RULE"');
  }

  if (fileName === 'roadmap-current.md') {
    if (!content.includes('Status: [ ]') && !content.includes('Status: [x]')) {
      logError(filePath, 'Missing required status indicator: "Status: [ ]" or "Status: [x]"');
    }
  }

  // RULE GROUP 3 — STRUCTURE CONSISTENCY
  const lines = content.split('\n');
  const topLevelHeadings = [];

  lines.forEach((line, index) => {
    if (/^#+\s*$/.test(line)) {
      logError(filePath, `Empty heading found at line ${index + 1}`);
    }

    const h1Match = line.match(/^#\s+(.+)$/);
    if (h1Match) {
      const title = h1Match[1].trim();

      if (topLevelHeadings.includes(title)) {
        logError(filePath, `Duplicated top - level heading: "# ${title}"`);
      }

      topLevelHeadings.push(title);
    }

  });

  // RULE GROUP 5 — STRATEGIC VALIDATIONS
  validateContextSeparation(filePath, content);
  validateEnterpriseContext(filePath, content);
  validateStrategyAlignment(filePath, content);
  validateCorePrinciples(filePath, content);
  validateInvalidPaths(filePath, content);
}

function run() {
  const files = scanFiles();
  files.forEach(lintFile);

  if (warnings.length > 0) {
    console.log('\nWarnings:');
    warnings.forEach(w => console.log(`  ${w}`));
  }

  console.log('\nDocs Lint Results:');
  console.log(`  ❌ Errors:   ${errorCount}`);
  console.log(`  ⚠️  Warnings: ${warningCount}`);

  if (errorCount > 0) {
    process.exit(1);
  } else {
    if (warningCount === 0) console.log('\n✅ Documentation lint passed');
    process.exit(0);
  }
}

run();
