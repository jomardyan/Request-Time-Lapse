# Asset Generation Guide

## Overview

This directory includes a script to automatically generate all promotional graphics for the Chrome Web Store using Node.js and Playwright.

## Generated Assets

The script generates **5 assets**:

1. **Store Icon** (128x128 PNG)
   - Chrome Web Store listing icon
   - Transparent background friendly

2. **Full Screenshot** (1280x800 PNG)
   - Main promotional screenshot
   - Shows full UI with endpoints, timeline, and details

3. **Small Screenshot** (640x400 PNG)
   - Alternative size for store listing
   - Scaled version of full screenshot

4. **Small Promo Tile** (440x280 PNG)
   - Secondary promotional graphic
   - Simple branding with key message

5. **Marquee Promo Tile** (1400x560 PNG)
   - Large banner for store promotions
   - Features key selling points

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Assets

Run the asset generation script:

```bash
npm run generate-assets
```

### 3. Output

Generated files will be saved to `./assets/` directory:

```
assets/
├── store-icon-128x128.png
├── screenshot-1280x800.png
├── screenshot-640x400.png
├── small-promo-tile-440x280.png
└── marquee-promo-tile-1400x560.png
```

## Development Workflow

### Watch Mode

For iterative development, use watch mode:

```bash
npm run generate-assets:watch
```

This automatically regenerates assets when the script changes.

## Customization

### Editing Asset Content

Edit the HTML generator functions in `generate-assets.js`:

- `createStoreIconHTML()` - Customize store icon design
- `createScreenshotHTML()` - Modify UI screenshot layout
- `createPromoTileHTML()` - Update promo tile branding

### Colors & Styling

Update CSS variables in the HTML generators:

```javascript
:root {
  --bg: "#0c1117";           // Background
  --accent: "#58c4ff";       // Accent color
  --success: "#6bffb5";      // Success color
  --danger: "#ff7b7b";       // Error color
}
```

### Dimensions

Modify asset dimensions in the `ASSETS` object:

```javascript
const ASSETS = {
  storeIcon: {
    width: 128,
    height: 128,
    filename: "store-icon-128x128.png",
  },
  // ... more assets
};
```

## Script Features

✅ **Automated Generation** - Generate all assets with one command
✅ **High Quality** - Uses Playwright for pixel-perfect rendering
✅ **Responsive** - Generates multiple sizes for different use cases
✅ **Professional Design** - Gradient backgrounds, animations, modern UI
✅ **Extensible** - Easy to add new asset types

## Requirements

- Node.js 16+
- npm or yarn

## Chrome Web Store Specifications

These assets meet Chrome Web Store requirements:

| Asset | Size | Format | Requirements |
|-------|------|--------|--------------|
| Store Icon | 128x128 | PNG | Required |
| Screenshots | 1280x800 or 640x400 | PNG/JPEG | Min 1 required |
| Promo Tile | 440x280 | PNG/JPEG | Optional |
| Marquee | 1400x560 | PNG/JPEG | Optional |

## Troubleshooting

### Playwright Browser Download

On first run, Playwright downloads Chromium (~300MB):

```bash
# Download browsers manually
npx playwright install
```

### Permission Issues

If you get permission errors:

```bash
# On macOS/Linux
chmod +x generate-assets.js
```

### Output Directory

Ensure the `assets/` directory is writable:

```bash
mkdir -p assets
chmod 755 assets
```

## Advanced Usage

### Generate Single Asset

Modify the script temporarily:

```javascript
// Comment out other generateAsset() calls and run only:
await generateAsset(browser, "storeIcon", 128, 128, createStoreIconHTML);
```

### Custom Styling

Edit HTML in generator functions to customize:

- Colors and gradients
- Typography and fonts
- Layout and spacing
- Icons and imagery

### Integration with CI/CD

Add to GitHub Actions or other CI pipeline:

```yaml
- name: Generate Assets
  run: |
    npm install
    npm run generate-assets
```

## License

These assets are part of the Request Time-Lapse extension.
