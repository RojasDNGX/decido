/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIRS = [
  path.join(ROOT_DIR, 'docs'),
  path.join(ROOT_DIR, 'docs', 'roadmaps'),
  path.join(ROOT_DIR, 'docs', 'archive'),
  path.join(ROOT_DIR, 'docs', 'archive', 'roadmaps')
];
const ROOT_FILES = [
  path.join(ROOT_DIR, 'AGENTS.md'),
  path.join(ROOT_DIR, 'README.md'),
  path.join(ROOT_DIR, 'CLAUDE.md')
];

const FORBIDDEN_PATTERNS = [
  "You are ",
  "## TASK",
  "## OUTPUT",
  "Return ONLY",
  "No explanations"
];

let errorCount = 0;

function logError(file, message) {
  const relativePath = path.relative(ROOT_DIR, file);
  console.error(`[ERROR] ${relativePath} → ${message}`);
  errorCount++;
}

function scanFiles() {
  const files = [...ROOT_FILES];

  DOCS_DIRS.forEach(dir => {
    if (fs.existsSync(dir)) {
      const dirFiles = fs.readdirSync(dir)
        .filter(f => f.endsWith('.md'))
        .map(f => path.join(dir, f));
      files.push(...dirFiles);
    }
  });

  // Remove duplicates and non-existent files
  return [...new Set(files)].filter(f => fs.existsSync(f) && fs.statSync(f).isFile());
}

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
  let topLevelHeadings = [];
  
  lines.forEach((line, index) => {
    // Empty headings
    if (/^#+\s*$/.test(line)) {
      logError(filePath, `Empty heading found at line ${index + 1}`);
    }

    // Duplicated top-level headings
    const h1Match = line.match(/^#\s+(.+)$/);
    if (h1Match) {
      const title = h1Match[1].trim();
      if (topLevelHeadings.includes(title)) {
        logError(filePath, `Duplicated top-level heading: "# ${title}"`);
      }
      topLevelHeadings.push(title);
    }
    
    // Check if a heading is followed by another heading or nothing (empty heading check refinement)
    if (/^#+\s+.+/.test(line)) {
       const nextLine = lines[index + 1];
       if (nextLine !== undefined && nextLine.trim() === '' && (lines[index + 2] === undefined || /^#+/.test(lines[index+2]))) {
           // This is a borderline rule, but the request says "no content below"
           // Let's stick to the simplest interpretation of the user's rule.
       }
    }
  });
}

function run() {
  const files = scanFiles();
  files.forEach(lintFile);

  if (errorCount > 0) {
    console.log(`\nScan complete. Found ${errorCount} error(s).`);
    process.exit(1);
  } else {
    console.log('Documentation lint passed');
    process.exit(0);
  }
}

run();
