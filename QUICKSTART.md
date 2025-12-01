# Quick Start Guide - Generate Assets

## 🚀 Getting Started (2 minutes)

### Option 1: Windows Users

Double-click this file:
```
setup-assets.bat
```

### Option 2: macOS/Linux Users

Run this command:
```bash
chmod +x setup-assets.sh
./setup-assets.sh
```

### Option 3: Manual Setup

```bash
# Install dependencies
npm install

# Generate assets
npm run generate-assets
```

## ✅ What Gets Generated

After running the script, you'll find these files in the `assets/` folder:

```
📁 assets/
  ├── 📄 store-icon-128x128.png          (Chrome Web Store icon)
  ├── 📄 screenshot-1280x800.png         (Full promotional screenshot)
  ├── 📄 screenshot-640x400.png          (Small promotional screenshot)
  ├── 📄 small-promo-tile-440x280.png    (Small banner)
  └── 📄 marquee-promo-tile-1400x560.png (Large marquee banner)
```

**Total size:** ~500-800 KB

## 📋 Requirements

- **Node.js** 16 or higher
- **npm** (comes with Node.js)
- **Internet** (to download Playwright on first run)

### Install Node.js

- **Windows/macOS:** Download from https://nodejs.org
- **Linux:** `sudo apt install nodejs npm` (Ubuntu/Debian)

### Verify Installation

```bash
node --version    # Should show v16.0.0 or higher
npm --version     # Should show 7.0.0 or higher
```

## 🎨 Customizing Assets

Edit `generate-assets.js` to customize:

### Change Colors

Find and modify these values in the HTML generators:

```javascript
--bg: "#0c1117";           // Background color
--accent: "#58c4ff";       // Primary accent
--success: "#6bffb5";      // Success/positive color
--danger: "#ff7b7b";       // Error/danger color
```

### Change Text

Edit the HTML content in:
- `createStoreIconHTML()` - Store icon text
- `createScreenshotHTML()` - Screenshot labels
- `createPromoTileHTML()` - Promo tile copy

### Change Dimensions

Modify the `ASSETS` object:

```javascript
storeIcon: {
  width: 128,      // Change width
  height: 128,     // Change height
  filename: "store-icon-128x128.png",
}
```

## 🔄 Update Assets

To regenerate assets after making changes:

```bash
npm run generate-assets
```

### Watch Mode (Auto-regenerate)

```bash
npm run generate-assets:watch
```

This automatically regenerates assets whenever you save changes to `generate-assets.js`.

## 🐛 Troubleshooting

### "Command not found: node"

**Solution:** Install Node.js from https://nodejs.org

### "Playwright not found"

**Solution:** Run `npm install` first

### "Permission denied" (macOS/Linux)

**Solution:** Make script executable:
```bash
chmod +x setup-assets.sh
```

### "EACCES permission error"

**Solution:** Check write permissions on assets folder:
```bash
mkdir -p assets
chmod 755 assets
```

### Slow on first run

**Expected:** Playwright downloads a browser (~300MB) on first run. This is normal and only happens once.

## 📊 File Specifications

| Asset | Dimensions | Use Case | Format |
|-------|-----------|----------|--------|
| Store Icon | 128×128 | Chrome Web Store | PNG |
| Screenshot 1 | 1280×800 | Main listing | PNG |
| Screenshot 2 | 640×400 | Alternative listing | PNG |
| Promo Tile | 440×280 | Promotional card | PNG |
| Marquee | 1400×560 | Banner ads | PNG |

## 💾 Using Generated Assets

### Upload to Chrome Web Store

1. Go to [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole)
2. Edit your extension listing
3. Upload screenshots and promotional images from the `assets/` folder

### Share Promotional Materials

```
assets/
├── store-icon-128x128.png           # Social media profile pic
├── screenshot-1280x800.png          # Blog posts, documentation
├── small-promo-tile-440x280.png     # Email campaigns
└── marquee-promo-tile-1400x560.png  # Website hero section
```

## 🔧 Advanced Options

### Generate Only Specific Assets

Edit `generate-assets.js` and comment out unwanted `generateAsset()` calls:

```javascript
// Generate only store icon
await generateAsset(browser, "storeIcon", 128, 128, createStoreIconHTML);

// Comment these out:
// await generateAsset(browser, "screenshot1", 1280, 800, ...);
// await generateAsset(browser, "screenshot2", 640, 400, ...);
```

### Add Custom Fonts

In the HTML generators, add font imports:

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">

<style>
  body { font-family: 'Poppins', sans-serif; }
</style>
```

### Use External Images

```javascript
// In HTML generator
<img src="path/to/image.png" width="100" height="100" />
```

## 📚 Full Documentation

See [ASSET_GENERATION.md](ASSET_GENERATION.md) for detailed documentation.

## ❓ FAQ

**Q: Can I run this on CI/CD?**
A: Yes! Add to GitHub Actions:
```yaml
- run: npm install
- run: npm run generate-assets
```

**Q: How do I change the screenshot content?**
A: Edit the HTML in `createScreenshotHTML()` function.

**Q: Can I use different dimensions?**
A: Yes, modify the `ASSETS` object in `generate-assets.js`.

**Q: How do I add new asset types?**
A: Add to `ASSETS` object and create corresponding HTML generator.

**Q: Is there a limit to asset size?**
A: Chrome Web Store accepts up to 20MB per file. Generated assets are typically 100-200KB each.

## ✨ Tips

- 💡 First run takes longer (downloads Playwright browser)
- 📁 Always commit `generate-assets.js` to version control
- 🔄 Regenerate before each store release
- 📸 Screenshots should showcase key features
- 🎨 Keep branding consistent across all assets

## 🆘 Need Help?

1. Check [ASSET_GENERATION.md](ASSET_GENERATION.md)
2. Review error messages in console
3. Verify Node.js is installed: `node --version`
4. Check internet connection (for Playwright download)

---

**Happy generating! 🎉**
