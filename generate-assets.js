#!/usr/bin/env node

/**
 * Generate Graphic Assets for Request Time-Lapse Extension
 * 
 * This script generates:
 * - Store icon (128x128)
 * - Screenshots (1280x800 or 640x400)
 * - Small promo tile (440x280)
 * - Marquee promo tile (1400x560)
 */

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const OUTPUT_DIR = path.join(__dirname, "assets");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const ASSETS = {
  storeIcon: {
    width: 128,
    height: 128,
    filename: "store-icon-128x128.png",
    description: "Chrome Web Store icon",
  },
  screenshot1: {
    width: 1280,
    height: 800,
    filename: "screenshot-1280x800.png",
    description: "Full screenshot (1280x800)",
  },
  screenshot2: {
    width: 640,
    height: 400,
    filename: "screenshot-640x400.png",
    description: "Small screenshot (640x400)",
  },
  smallPromoTile: {
    width: 440,
    height: 280,
    filename: "small-promo-tile-440x280.png",
    description: "Small promo tile",
  },
  marqueePromoTile: {
    width: 1400,
    height: 560,
    filename: "marquee-promo-tile-1400x560.png",
    description: "Marquee promo tile",
  },
};

/**
 * Create HTML content for rendering
 */
function createStoreIconHTML() {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; background: #0c1117; }
          .container {
            width: 128px;
            height: 128px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', system-ui, sans-serif;
            background: linear-gradient(135deg, #0c1117 0%, #131b25 100%);
            position: relative;
            overflow: hidden;
          }
          .icon-bg {
            position: absolute;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 30% 30%, rgba(88, 196, 255, 0.2), transparent 50%);
          }
          .icon-content {
            position: relative;
            z-index: 1;
            text-align: center;
          }
          .icon-symbol {
            font-size: 48px;
            font-weight: 700;
            background: linear-gradient(135deg, #58c4ff, #6bffb5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
          }
          .icon-label {
            font-size: 9px;
            color: #8aa2c0;
            margin-top: 4px;
            font-weight: 600;
            letter-spacing: 0.5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon-bg"></div>
          <div class="icon-content">
            <div class="icon-symbol">⏱</div>
            <div class="icon-label">TIME-LAPSE</div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Create HTML for full screenshot
 */
function createScreenshotHTML(width = 1280, height = 800) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Request Time-Lapse</title>
        <style>
          :root {
            --bg: #0c1117;
            --panel: #131b25;
            --text: #e9f1ff;
            --muted: #8aa2c0;
            --accent: #58c4ff;
            --danger: #ff7b7b;
            --success: #6bffb5;
            --border: #1f2a38;
            --code-bg: #0b1620;
            --mono: "Cascadia Code", Menlo, Consolas, monospace;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            font-family: "Inter", "Segoe UI", system-ui, sans-serif;
            background: radial-gradient(circle at 20% 20%, rgba(88, 196, 255, 0.08), transparent 30%),
              radial-gradient(circle at 80% 0%, rgba(107, 255, 181, 0.1), transparent 25%),
              var(--bg);
            color: var(--text);
            width: ${width}px;
            height: ${height}px;
            overflow: hidden;
          }
          .app-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--border);
            background: linear-gradient(90deg, rgba(88, 196, 255, 0.08), rgba(107, 255, 181, 0.03) 70%);
          }
          .title {
            font-size: 16px;
            font-weight: 700;
          }
          .subtitle {
            font-size: 10px;
            color: var(--muted);
            margin-top: 2px;
          }
          .header-actions {
            display: flex;
            gap: 6px;
            align-items: center;
          }
          .pill {
            padding: 3px 8px;
            border-radius: 999px;
            font-size: 10px;
            border: 1px solid var(--border);
            background: rgba(107, 255, 181, 0.08);
            color: var(--success);
            border-color: rgba(107, 255, 181, 0.35);
          }
          .controls {
            display: flex;
            gap: 10px;
            padding: 8px 12px;
            border-bottom: 1px solid var(--border);
            background: rgba(19, 27, 37, 0.8);
            flex-wrap: wrap;
          }
          .controls label {
            display: flex;
            flex-direction: column;
            font-size: 9px;
            color: var(--muted);
            gap: 2px;
          }
          .controls input {
            background: var(--panel);
            border: 1px solid var(--border);
            color: var(--text);
            padding: 4px 6px;
            border-radius: 6px;
            font-size: 9px;
            width: 120px;
          }
          .layout {
            display: grid;
            grid-template-columns: 180px 240px 1fr;
            gap: 8px;
            height: ${height - 90}px;
            padding: 8px;
          }
          .column {
            background: rgba(19, 27, 37, 0.7);
            border: 1px solid var(--border);
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            min-height: 0;
          }
          .section-title {
            padding: 8px 10px;
            font-weight: 700;
            border-bottom: 1px solid var(--border);
            font-size: 11px;
          }
          .list {
            overflow-y: auto;
            flex: 1;
          }
          .list-item {
            padding: 8px 10px;
            border-bottom: 1px solid var(--border);
            cursor: pointer;
            font-size: 10px;
            transition: background 0.12s ease;
          }
          .list-item:hover {
            background: rgba(88, 196, 255, 0.08);
          }
          .list-item.active {
            border-left: 3px solid var(--accent);
            background: rgba(88, 196, 255, 0.12);
          }
          .endpoint-title {
            font-weight: 600;
            margin-bottom: 2px;
          }
          .small {
            color: var(--muted);
            font-size: 8px;
            margin: 2px 0;
          }
          .badge {
            display: inline-block;
            padding: 2px 4px;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.08);
            font-size: 8px;
            margin-right: 2px;
          }
          .details-view {
            padding: 8px;
            overflow-y: auto;
            flex: 1;
            font-size: 9px;
          }
          .label {
            font-weight: 600;
            margin-bottom: 4px;
          }
          .code-block {
            background: var(--code-bg);
            color: var(--text);
            padding: 6px;
            border-radius: 6px;
            border: 1px solid var(--border);
            white-space: pre-wrap;
            word-break: break-word;
            font-family: var(--mono);
            font-size: 8px;
            max-height: 120px;
            overflow: hidden;
          }
          .status-ok { color: var(--success); }
          .status-bad { color: var(--danger); }
          .timeline-meta {
            display: flex;
            gap: 4px;
            margin-top: 3px;
            flex-wrap: wrap;
          }
        </style>
      </head>
      <body>
        <header class="app-header">
          <div>
            <div class="title">Request Time-Lapse</div>
            <div class="subtitle">Track your API calls across reloads</div>
          </div>
          <div class="header-actions">
            <span class="pill">Recording</span>
          </div>
        </header>

        <section class="controls">
          <label>Environment <input type="text" placeholder="dev/prod" /></label>
          <label>Endpoint <input type="text" placeholder="search..." /></label>
          <label>Status <input type="text" placeholder="200,404" /></label>
          <label>Latency <input type="number" placeholder="5000" /></label>
        </section>

        <main class="layout">
          <section class="column">
            <div class="section-title">Endpoints</div>
            <div class="list">
              <div class="list-item active">
                <div class="endpoint-title">POST /api/users</div>
                <div class="small">calls: 12 · avg: 245ms</div>
              </div>
              <div class="list-item">
                <div class="endpoint-title">GET /api/profile</div>
                <div class="small">calls: 8 · avg: 156ms</div>
              </div>
              <div class="list-item">
                <div class="endpoint-title">POST /api/events</div>
                <div class="small">calls: 24 · avg: 523ms</div>
              </div>
            </div>
          </section>

          <section class="column">
            <div class="section-title">Timeline</div>
            <div class="list">
              <div class="list-item active">
                <div>11:45:30 PM · <span class="status-ok">200</span> · 245ms</div>
                <div class="small">prod · main</div>
                <div class="timeline-meta">
                  <span class="badge">POST</span>
                  <span class="badge">json</span>
                </div>
              </div>
              <div class="list-item">
                <div>11:45:25 PM · <span class="status-ok">200</span> · 198ms</div>
                <div class="small">prod · main</div>
              </div>
              <div class="list-item">
                <div>11:45:20 PM · <span class="status-bad">500</span> · 1250ms</div>
                <div class="small">staging · dev</div>
              </div>
            </div>
          </section>

          <section class="column">
            <div class="section-title">Details & Diff</div>
            <div class="details-view">
              <div class="label">Request</div>
              <pre class="code-block">POST /api/users
Headers: {
  "authorization": "Bearer ...",
  "content-type": "application/json"
}
Body: {"name":"John","email":"john@example.com"}</pre>

              <div class="label" style="margin-top: 8px;">Response</div>
              <pre class="code-block">Status: 200 OK
Latency: 245ms
Body: {
  "id": "123",
  "name": "John",
  "created_at": "2024-01-15T..."
}</pre>
            </div>
          </section>
        </main>
      </body>
    </html>
  `;
}

/**
 * Create HTML for promo tile
 */
function createPromoTileHTML(width = 440, height = 280, isMarquee = false) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            width: ${width}px;
            height: ${height}px;
            background: linear-gradient(135deg, #0c1117 0%, #131b25 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', system-ui, sans-serif;
            overflow: hidden;
            position: relative;
          }
          .bg-elements {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          .blob1 {
            position: absolute;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(88, 196, 255, 0.15) 0%, transparent 70%);
            border-radius: 50%;
            top: -100px;
            right: -100px;
            animation: float 6s ease-in-out infinite;
          }
          .blob2 {
            position: absolute;
            width: 250px;
            height: 250px;
            background: radial-gradient(circle, rgba(107, 255, 181, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            bottom: -50px;
            left: -50px;
            animation: float 8s ease-in-out infinite reverse;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(20px); }
          }
          .content {
            position: relative;
            z-index: 10;
            text-align: center;
            color: #e9f1ff;
          }
          .icon {
            font-size: ${isMarquee ? 80 : 64}px;
            margin-bottom: 16px;
            animation: pulse 3s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          h1 {
            font-size: ${isMarquee ? 44 : 32}px;
            font-weight: 700;
            margin: 0 0 12px 0;
            background: linear-gradient(135deg, #58c4ff, #6bffb5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .tagline {
            font-size: ${isMarquee ? 18 : 14}px;
            color: #8aa2c0;
            margin: 0;
            max-width: 90%;
          }
          .features {
            margin-top: 16px;
            font-size: ${isMarquee ? 14 : 12}px;
            color: #8aa2c0;
          }
          .feature {
            display: inline-block;
            margin: 0 12px;
          }
          .dot {
            color: #58c4ff;
            margin: 0 8px;
          }
        </style>
      </head>
      <body>
        <div class="bg-elements">
          <div class="blob1"></div>
          <div class="blob2"></div>
        </div>
        <div class="content">
          <div class="icon">⏱️</div>
          <h1>Request Time-Lapse</h1>
          <p class="tagline">Track API regressions across page reloads</p>
          ${
            isMarquee
              ? `
            <div class="features">
              <span class="feature">📊 Schema Diff</span>
              <span class="dot">•</span>
              <span class="feature">⚡ Performance Tracking</span>
              <span class="dot">•</span>
              <span class="feature">🔄 Replay History</span>
            </div>
          `
              : ""
          }
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate screenshot using Playwright
 */
async function generateAsset(browser, name, width, height, htmlGenerator) {
  try {
    console.log(`Generating ${name}...`);

    const page = await browser.newPage();
    await page.setViewportSize({ width, height });

    const html = htmlGenerator(width, height);
    await page.setContent(html);

    // Wait for any animations to complete
    await page.waitForTimeout(500);

    const outputPath = path.join(OUTPUT_DIR, ASSETS[name].filename);
    await page.screenshot({ path: outputPath, fullPage: false });

    console.log(`✅ ${ASSETS[name].description} saved to ${outputPath}`);
    console.log(`   File: ${ASSETS[name].filename}`);

    await page.close();
  } catch (error) {
    console.error(`❌ Error generating ${name}:`, error.message);
  }
}

/**
 * Main generation function
 */
async function generateAssets() {
  console.log("🎨 Request Time-Lapse - Asset Generator");
  console.log("==========================================\n");

  const browser = await chromium.launch();

  try {
    // Generate store icon
    await generateAsset(
      browser,
      "storeIcon",
      128,
      128,
      createStoreIconHTML
    );

    // Generate screenshots
    await generateAsset(
      browser,
      "screenshot1",
      1280,
      800,
      (w, h) => createScreenshotHTML(w, h)
    );

    await generateAsset(
      browser,
      "screenshot2",
      640,
      400,
      (w, h) => createScreenshotHTML(w, h)
    );

    // Generate promo tiles
    await generateAsset(
      browser,
      "smallPromoTile",
      440,
      280,
      (w, h) => createPromoTileHTML(w, h, false)
    );

    await generateAsset(
      browser,
      "marqueePromoTile",
      1400,
      560,
      (w, h) => createPromoTileHTML(w, h, true)
    );

    console.log("\n==========================================");
    console.log("✨ All assets generated successfully!");
    console.log(`📁 Output directory: ${OUTPUT_DIR}`);

    // List generated files
    const files = fs.readdirSync(OUTPUT_DIR);
    console.log("\n📦 Generated files:");
    files.forEach((file) => {
      const filePath = path.join(OUTPUT_DIR, file);
      const stat = fs.statSync(filePath);
      const sizeKB = (stat.size / 1024).toFixed(2);
      console.log(`   • ${file} (${sizeKB} KB)`);
    });
  } catch (error) {
    console.error("❌ Fatal error:", error);
  } finally {
    await browser.close();
  }
}

// Run the generator
generateAssets().catch(console.error);
