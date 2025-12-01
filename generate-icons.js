#!/usr/bin/env node

/**
 * Generate extension icons using Playwright
 * Creates 16x16, 48x48, and 128x128 PNG icons
 */

const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const playwright = require('playwright');
  
  console.log('🎨 Generating extension icons...\n');

  const browser = await playwright.chromium.launch();

  // Icon sizes to generate
  const sizes = [16, 48, 128];
  
  // Create images directory if it doesn't exist
  const imagesDir = path.join(process.cwd(), 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log(`📁 Created directory: ${imagesDir}\n`);
  }

  for (const size of sizes) {
    const page = await browser.newPage();
    
    // Set viewport for size
    await page.setViewportSize({ width: size, height: size });

    // Create SVG for icon
    const svg = `
      <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background gradient -->
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="${size}" height="${size}" fill="url(#grad)" rx="${Math.ceil(size / 8)}"/>
        
        <!-- Clock icon -->
        <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.35}" fill="white" opacity="0.9"/>
        
        <!-- Hour hand -->
        <line x1="${size * 0.5}" y1="${size * 0.5}" 
              x2="${size * 0.5}" y2="${size * 0.25}" 
              stroke="white" stroke-width="${size * 0.06}" 
              stroke-linecap="round"/>
        
        <!-- Minute hand -->
        <line x1="${size * 0.5}" y1="${size * 0.5}" 
              x2="${size * 0.65}" y2="${size * 0.5}" 
              stroke="white" stroke-width="${size * 0.05}" 
              stroke-linecap="round"/>
        
        <!-- Center dot -->
        <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.06}" fill="white"/>
      </svg>
    `;

    // Create HTML page
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; background: transparent; }
          svg { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        ${svg}
      </body>
      </html>
    `;

    await page.setContent(html);

    // Take screenshot
    const fileName = `icon-${size}.png`;
    const filePath = path.join(imagesDir, fileName);
    
    await page.screenshot({ path: filePath });
    
    const stats = fs.statSync(filePath);
    console.log(`✅ Generated: ${fileName} (${(stats.size / 1024).toFixed(2)} KB)`);

    await page.close();
  }

  await browser.close();

  console.log('\n✨ All icons generated successfully!');
  console.log(`📍 Location: ${imagesDir}/`);
}

generateIcons().catch(error => {
  console.error('❌ Error generating icons:', error);
  process.exit(1);
});
