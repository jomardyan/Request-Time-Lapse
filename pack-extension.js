#!/usr/bin/env node

/**
 * Request Time-Lapse Extension Packer
 * 
 * Packages the extension and generated assets into a ZIP file
 * suitable for distribution or Chrome Web Store submission.
 * 
 * Usage:
 *   node pack-extension.js
 *   npm run pack
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Configuration
const CONFIG = {
  extensionName: 'request-time-lapse',
  version: '1.0.0',
  outputDir: './dist',
  zipName: 'request-time-lapse-extension.zip',
};

// Files and directories to include
const INCLUDE_PATTERNS = [
  'manifest.json',
  'background.js',
  'devtools.html',
  'devtools.js',
  'panel.html',
  'panel.js',
  'styles.css',
  'tutorial.html',
  'images/**/*',
  'assets/**/*',
  'README.md',
  'ENHANCEMENTS.md',
];

// Files and directories to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  'dist',
  '.git',
  '.gitignore',
  '.env',
  'package.json',
  'package-lock.json',
  'setup-assets.*',
  'generate-assets.js',
  'generate-icons.js',
  'pack-extension.js',
  'documentation/**',
];

/**
 * Get current date-time string for filename
 */
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}-${hours}${minutes}`;
}

/**
 * Normalize path to use forward slashes
 */
function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

/**
 * Check if a file path should be excluded
 */
function shouldExclude(filePath) {
  const normalized = normalizePath(filePath);
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\./g, '\\.') + '$');
      if (regex.test(normalized)) return true;
    } else {
      if (normalized.includes(pattern)) return true;
    }
  }
  return false;
}

/**
 * Get all files matching include patterns
 */
function getFilesToInclude(baseDir) {
  const files = [];

  function walkDir(dir, relative = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = relative ? path.join(relative, entry.name) : entry.name;
      const normalizedRelative = normalizePath(relativePath);

      // Skip if excluded
      if (shouldExclude(normalizedRelative)) continue;

      if (entry.isDirectory()) {
        // Check if directory matches any include pattern
        const matches = INCLUDE_PATTERNS.some(pattern => {
          const patternBase = pattern.split('**')[0] || pattern.split('/*')[0];
          return normalizedRelative.startsWith(patternBase.replace(/\/$/, ''));
        });

        if (matches || INCLUDE_PATTERNS.some(p => p.includes('**'))) {
          walkDir(fullPath, relativePath);
        }
      } else {
        // Check if file matches any include pattern
        const matches = INCLUDE_PATTERNS.some(pattern => {
          if (pattern.includes('**')) {
            const base = pattern.split('**')[0];
            return normalizedRelative.startsWith(base.replace(/\/$/, ''));
          }
          return normalizedRelative === pattern;
        });

        if (matches) {
          files.push({
            path: fullPath,
            name: normalizedRelative,
          });
        }
      }
    }
  }

  walkDir(baseDir);
  return files;
}

/**
 * Create ZIP archive
 */
async function createZip(files, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      const stats = fs.statSync(outputPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`✅ ZIP created: ${outputPath}`);
      console.log(`📦 File size: ${sizeKB} KB`);
      console.log(`📄 Files included: ${files.length}`);
      resolve();
    });

    archive.on('error', reject);
    output.on('error', reject);

    archive.pipe(output);

    // Add files to archive
    for (const file of files) {
      archive.file(file.path, { name: file.name });
    }

    archive.finalize();
  });
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🔧 Packing Request Time-Lapse Extension...\n');

    // Create output directory if it doesn't exist
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${CONFIG.outputDir}`);
    }

    // Get files to include
    const timestamp = getTimestamp();
    const files = getFilesToInclude(process.cwd());

    if (files.length === 0) {
      console.error('❌ No files found to pack!');
      process.exit(1);
    }

    console.log(`📋 Files to include: ${files.length}`);
    files.forEach(f => console.log(`   ✓ ${f.name}`));
    console.log();

    // Generate output filename
    const outputFileName = `${CONFIG.extensionName}-v${CONFIG.version}-${timestamp}.zip`;
    const outputPath = path.join(CONFIG.outputDir, outputFileName);

    // Create ZIP
    console.log(`📦 Creating ZIP archive...`);
    await createZip(files, outputPath);

    console.log(`\n✨ Success! Extension packaged and ready for distribution.`);
    console.log(`\n📍 Location: ${outputPath}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Upload to Chrome Web Store: https://chrome.google.com/webstore/developer/dashboard`);
    console.log(`   2. Or share the ZIP file for manual installation in development mode`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { createZip, getFilesToInclude };
