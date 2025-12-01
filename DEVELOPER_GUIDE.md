#!/usr/bin/env node

/**
 * DEVELOPER GUIDE - Asset Generation Script
 * ==========================================
 * 
 * This guide explains how the generate-assets.js script works
 * and how to customize it.
 * 
 * FILE LOCATION: generate-assets.js
 * RUN COMMAND: node generate-assets.js
 */

/**
 * =============================================================
 * SCRIPT OVERVIEW
 * =============================================================
 * 
 * The script generates 5 promotional graphics for the Chrome Web Store
 * using Playwright (headless browser automation) and Node.js.
 * 
 * Flow:
 * 1. Launch Chromium browser via Playwright
 * 2. For each asset:
 *    a. Generate HTML content (with embedded CSS)
 *    b. Load HTML into new page
 *    c. Take screenshot at specified dimensions
 *    d. Save PNG to ./assets/ directory
 * 3. Close browser and report results
 * 
 * Time: ~10-30 seconds depending on hardware
 * Output: 5 PNG files in ./assets/ directory
 */

/**
 * =============================================================
 * KEY COMPONENTS
 * =============================================================
 */

// 1. CONFIGURATION
// ================
const OUTPUT_DIR = "./assets";           // Where to save files
const STORAGE_QUOTA = 50 * 1024 * 1024;  // IndexedDB size estimate

const ASSETS = {
  storeIcon: {
    width: 128,                          // CSS pixels (not device pixels)
    height: 128,
    filename: "store-icon-128x128.png",
    description: "Chrome Web Store icon",
  },
  // ... more assets
};

/**
 * 2. HTML GENERATORS
 * ==================
 * Each function returns HTML string with embedded CSS.
 * 
 * Convention:
 * - Self-contained HTML (no external dependencies)
 * - Inline CSS with no external stylesheets
 * - Responsive inline SVG/Unicode icons
 * - Preset width/height in HTML
 */

// Example: Creating the store icon
function createStoreIconHTML() {
  // Returns <html> with embedded <style> and <script>
  // No external resources needed
  // Dimensions: 128x128 (hardcoded)
  // Contains: Logo, text, gradients, animations
}

/**
 * 3. SCREENSHOT FUNCTION
 * ======================
 * Creates a new Playwright page, loads HTML, takes screenshot
 * 
 * Parameters:
 *  - browser: Playwright Browser instance
 *  - name: Key in ASSETS object (e.g., "storeIcon")
 *  - width: Viewport width in pixels
 *  - height: Viewport height in pixels
 *  - htmlGenerator: Function that returns HTML string
 */

async function generateAsset(browser, name, width, height, htmlGenerator) {
  // 1. Create new browser page
  const page = await browser.newPage();
  
  // 2. Set viewport size (affects CSS pixel dimensions)
  await page.setViewportSize({ width, height });
  
  // 3. Generate and load HTML
  const html = htmlGenerator(width, height);
  await page.setContent(html);
  
  // 4. Wait for animations to complete
  await page.waitForTimeout(500);
  
  // 5. Take screenshot and save
  await page.screenshot({ path: outputPath, fullPage: false });
  
  // 6. Clean up
  await page.close();
}

/**
 * =============================================================
 * CUSTOMIZATION GUIDE
 * =============================================================
 */

/**
 * TASK 1: Change Asset Dimensions
 * --------------------------------
 */

// Before:
// storeIcon: { width: 128, height: 128, ... }

// After:
// storeIcon: { width: 256, height: 256, ... }  // 2x larger

// Note: Update both ASSETS object AND the setViewportSize() call

/**
 * TASK 2: Change Asset Colors
 * ----------------------------
 */

// In HTML generator, modify CSS variables:

// Before:
const css = `
  --accent: #58c4ff;      /* Cyan */
  --success: #6bffb5;     /* Green */
  --danger: #ff7b7b;      /* Red */
`;

// After:
const css_new = `
  --accent: #0969da;      /* Blue */
  --success: #1a7f37;     /* Dark green */
  --danger: #cf222e;      /* Dark red */
`;

/**
 * TASK 3: Change Asset Text
 * --------------------------
 */

// In HTML generator, modify content:

// Before:
// <div class="title">Request Time-Lapse</div>

// After:
// <div class="title">API Request Recorder</div>

/**
 * TASK 4: Add New Asset Type
 * ---------------------------
 */

// 1. Add to ASSETS object:
const ASSETS_new = {
  // ... existing assets
  customBanner: {
    width: 600,
    height: 300,
    filename: "custom-banner-600x300.png",
    description: "Custom promotional banner",
  },
};

// 2. Create generator function:
function createCustomBannerHTML(width, height) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            width: ${width}px;
            height: ${height}px;
            /* Your CSS here */
          }
        </style>
      </head>
      <body>
        <!-- Your HTML here -->
      </body>
    </html>
  `;
}

// 3. Call in main function:
async function generateAssets() {
  // ... existing calls
  
  await generateAsset(
    browser,
    "customBanner",
    600,
    300,
    createCustomBannerHTML
  );
}

/**
 * TASK 5: Use External Fonts
 * ---------------------------
 */

// Add Google Fonts link in HTML:

function createAssetWithFont() {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Poppins', sans-serif; }
        </style>
      </head>
      <body>
        <h1>Using Google Fonts</h1>
      </body>
    </html>
  `;
}

// Note: Fonts will be downloaded during rendering (slower first time)

/**
 * TASK 6: Add Animations
 * ----------------------
 */

// Use CSS animations (will be frozen in screenshot):

function createAssetWithAnimation() {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(20px); }
          }
          
          .element {
            animation: float 3s ease-in-out infinite;
          }
        </style>
      </head>
      <body>
        <div class="element">Animated element</div>
      </body>
    </html>
  `;
}

// Note: Screenshot captures at animation frame (wait 500ms to reach middle)

/**
 * =============================================================
 * DEBUGGING
 * =============================================================
 */

/**
 * Debug Tip 1: Save intermediate screenshots
 * -------------------------------------------
 */

async function generateAssetWithDebug(browser, name, width, height, htmlGenerator) {
  const page = await browser.newPage();
  await page.setViewportSize({ width, height });
  
  const html = htmlGenerator(width, height);
  await page.setContent(html);
  
  // Save HTML for inspection
  fs.writeFileSync(`${name}.html`, html);
  console.log(`Saved HTML: ${name}.html`);
  
  // Take screenshot
  await page.screenshot({ path: `${OUTPUT_DIR}/${name}.png` });
}

/**
 * Debug Tip 2: Use headless: false to see browser
 * ------------------------------------------------
 */

// In main function:
const browser = await chromium.launch({ headless: false });
// Browser window will appear so you can see rendering in real-time

/**
 * Debug Tip 3: Check console output
 * ----------------------------------
 */

// Add to page setup:
page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

// Any console.log() in page JS will appear in terminal

/**
 * Debug Tip 4: Inspect page content
 * ----------------------------------
 */

// Get rendered HTML:
const content = await page.content();
console.log(content);

// Get text content:
const text = await page.innerText('body');
console.log(text);

/**
 * =============================================================
 * PERFORMANCE OPTIMIZATION
 * =============================================================
 */

/**
 * Make asset generation faster:
 * 1. Reduce number of assets
 * 2. Remove animations (less rendering)
 * 3. Disable images (use emoji instead)
 * 4. Inline all CSS (no external stylesheets)
 * 5. Run screenshots in parallel (use Promise.all)
 */

// Example: Parallel generation
async function generateAssetsParallel() {
  const browser = await chromium.launch();
  
  const promises = [
    generateAsset(browser, "storeIcon", 128, 128, createStoreIconHTML),
    generateAsset(browser, "screenshot1", 1280, 800, createScreenshotHTML),
    generateAsset(browser, "screenshot2", 640, 400, createScreenshotHTML),
  ];
  
  await Promise.all(promises);
  await browser.close();
}

/**
 * =============================================================
 * CHROME WEB STORE REQUIREMENTS
 * =============================================================
 */

/**
 * Asset Specifications:
 * 
 * ✓ Store Icon:
 *   - Size: 128×128 pixels
 *   - Format: PNG
 *   - No transparency required (but allowed)
 *   - Must be square
 * 
 * ✓ Screenshots:
 *   - Size: 1280×800 or 640×400 pixels
 *   - Format: PNG or JPEG
 *   - Min 1 required, max 5
 *   - Should show main UI
 * 
 * ✓ Promo Tiles:
 *   - Small: 440×280 pixels
 *   - Marquee: 1400×560 pixels
 *   - Format: PNG or JPEG
 *   - Optional but recommended
 * 
 * File Size Limits:
 * - Individual files: up to 20MB each
 * - Total per listing: up to 100MB
 * 
 * Generated assets: typically 100-300KB each (well under limit)
 */

/**
 * =============================================================
 * TROUBLESHOOTING
 * =============================================================
 */

/**
 * Problem: "Playwright not found"
 * Solution: npm install
 */

/**
 * Problem: "Chromium download failed"
 * Solution: npx playwright install
 *          or check internet connection
 */

/**
 * Problem: "Screenshot is blank"
 * Causes:
 *   - CSS syntax error (check browser console)
 *   - Font not loaded (use web-safe fonts)
 *   - Timeout too short (increase waitForTimeout)
 * 
 * Fix: Use debug mode with headless: false
 */

/**
 * Problem: "Colors look different"
 * Causes:
 *   - Color space differences (Chromium vs preview)
 *   - Anti-aliasing rendering differences
 * 
 * Fix: Use solid colors, test on target platform
 */

/**
 * =============================================================
 * INTEGRATION EXAMPLES
 * =============================================================
 */

/**
 * Example 1: Generate assets on git hook
 * ----------------------------------------
 */

// .husky/pre-commit:
// npm run generate-assets
// git add assets/

/**
 * Example 2: Generate in GitHub Actions
 * ----------------------------------------
 */

// .github/workflows/assets.yml:
// - name: Generate Assets
//   run: npm run generate-assets
// - name: Upload to artifacts
//   uses: actions/upload-artifact@v2
//   with:
//     path: assets/

/**
 * Example 3: Watch mode development
 * ----------------------------------
 */

// npm run generate-assets:watch
// Regenerates on every change to generate-assets.js

/**
 * =============================================================
 * RESOURCES
 * =============================================================
 */

/*
 * Playwright Documentation:
 * https://playwright.dev
 * 
 * Chrome Web Store Asset Requirements:
 * https://support.google.com/chrome/a/answer/9206108
 * 
 * CSS Animations:
 * https://developer.mozilla.org/en-US/docs/Web/CSS/animation
 * 
 * Google Fonts:
 * https://fonts.google.com
 * 
 * Emoji Reference:
 * https://unicode.org/emoji/charts/full-emoji-list.html
 */

/**
 * =============================================================
 * END OF DEVELOPER GUIDE
 * =============================================================
 * 
 * For questions or issues, check:
 * - ASSET_GENERATION.md (full documentation)
 * - QUICKSTART.md (quick reference)
 * - generate-assets.js (source code with comments)
 */
