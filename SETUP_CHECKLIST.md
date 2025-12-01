# ✅ Asset Generation - Setup Checklist

## Pre-Flight Checks

- [ ] You have a computer (Windows, macOS, or Linux)
- [ ] You have internet connection
- [ ] You have ~500 MB free disk space

## Installation

### For Windows Users
- [ ] Read: [QUICKSTART.md](QUICKSTART.md)
- [ ] Locate: `setup-assets.bat` in this folder
- [ ] Action: Double-click `setup-assets.bat`
- [ ] Wait: 30-60 seconds for setup to complete
- [ ] Verify: Check that command window doesn't show errors

### For macOS/Linux Users
- [ ] Read: [QUICKSTART.md](QUICKSTART.md)
- [ ] Open: Terminal in this folder
- [ ] Run: `chmod +x setup-assets.sh`
- [ ] Run: `./setup-assets.sh`
- [ ] Wait: 30-60 seconds for setup to complete

### For Manual Installation (All Platforms)
- [ ] Verify: `node --version` returns v16 or higher
- [ ] Verify: `npm --version` returns v7 or higher
- [ ] Run: `npm install` in this folder
- [ ] Wait: Dependencies download and install
- [ ] Run: `npm run generate-assets`
- [ ] Wait: Assets generate (~10-15 seconds)

## Post-Generation Verification

- [ ] Navigate to `./assets/` folder
- [ ] Verify these files exist:
  - [ ] `store-icon-128x128.png` (50-100 KB)
  - [ ] `screenshot-1280x800.png` (150-250 KB)
  - [ ] `screenshot-640x400.png` (80-120 KB)
  - [ ] `small-promo-tile-440x280.png` (100-150 KB)
  - [ ] `marquee-promo-tile-1400x560.png` (200-300 KB)

- [ ] Open each PNG file to verify:
  - [ ] Image displays correctly
  - [ ] Logo is visible
  - [ ] Text is readable
  - [ ] Colors look good

## Optional: Customize

- [ ] Open: `generate-assets.js` in text editor
- [ ] Find: CSS variables or HTML content you want to change
- [ ] Edit: Colors, text, or dimensions as desired
- [ ] Save: File
- [ ] Run: `npm run generate-assets` to regenerate
- [ ] Verify: Changes appear in `./assets/` folder

## Optional: Watch Mode

- [ ] Run: `npm run generate-assets:watch`
- [ ] Edit: `generate-assets.js`
- [ ] Save: File
- [ ] Watch: Assets auto-regenerate
- [ ] Stop: Press `Ctrl+C` to stop watching

## Ready to Deploy

- [ ] Navigate to [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole)
- [ ] Edit your extension listing
- [ ] Upload files:
  - [ ] Store icon → `store-icon-128x128.png`
  - [ ] Screenshots → `screenshot-1280x800.png` and `screenshot-640x400.png`
  - [ ] Promotional tiles → `small-promo-tile-440x280.png` and `marquee-promo-tile-1400x560.png`
- [ ] Review listing
- [ ] Submit for publication

## Troubleshooting Checklist

### Setup Fails - "Node.js not found"
- [ ] Go to https://nodejs.org
- [ ] Download LTS version
- [ ] Install Node.js
- [ ] Restart terminal/command prompt
- [ ] Retry setup

### Setup Fails - "npm not found"
- [ ] Reinstall Node.js (npm comes with it)
- [ ] Restart terminal/command prompt
- [ ] Retry setup

### Setup Fails - "Permission denied"
- [ ] Windows: Right-click `setup-assets.bat` → "Run as administrator"
- [ ] macOS/Linux: Run `chmod +x setup-assets.sh` first
- [ ] Retry setup

### Setup Fails - "Cannot download Playwright"
- [ ] Check internet connection
- [ ] Try: `npx playwright install` manually
- [ ] Retry: `npm run generate-assets`

### Screenshots Blank/Error
- [ ] Check: [QUICKSTART.md - Troubleshooting](QUICKSTART.md)
- [ ] Edit: `generate-assets.js` with `headless: false`
- [ ] See: Browser window during generation
- [ ] Report: Error message

### Still Having Issues?
- [ ] Check: [ASSET_GENERATION.md](ASSET_GENERATION.md)
- [ ] Check: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
- [ ] Check: [QUICKSTART.md](QUICKSTART.md)
- [ ] Review: Error messages in terminal

## Knowledge Base

- [ ] Read: [QUICKSTART.md](QUICKSTART.md) for basic usage
- [ ] Read: [ASSET_GENERATION.md](ASSET_GENERATION.md) for full reference
- [ ] Read: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for customization
- [ ] Check: [VISUAL_GUIDE.md](VISUAL_GUIDE.md) for diagrams
- [ ] Review: [INDEX.md](INDEX.md) for complete navigation

## Maintenance

- [ ] Every time you make changes:
  - [ ] Run: `npm run generate-assets`
  - [ ] Test: Check generated images
  
- [ ] Before publishing:
  - [ ] Verify: All 5 files exist
  - [ ] Check: File dimensions are correct
  - [ ] Review: Image quality
  - [ ] Confirm: Ready for Chrome Web Store

- [ ] Version control:
  - [ ] Run: `git add generate-assets.js package.json setup-assets.*`
  - [ ] Run: `git add assets/`
  - [ ] Commit: `git commit -m "Update promotional assets"`
  - [ ] Push: `git push`

## Success Indicators ✅

If you see these, everything is working:

- [x] 5 PNG files in `./assets/` folder
- [x] File sizes match expected ranges (~100-300 KB each)
- [x] Images display without errors
- [x] Logo and text are visible
- [x] Colors are vibrant and professional
- [x] Dimensions match specifications

## You're Done! 🎉

When complete:
1. ✅ Assets are generated
2. ✅ Files are verified
3. ✅ Ready to upload to Chrome Web Store
4. ✅ Documentation is available for reference

**Next Step:** Upload your assets to the [Chrome Web Store](https://chrome.google.com/webstore/devconsole)!

---

## Quick Reference

### What to do if...

**"I want to generate assets once"**
→ `npm run generate-assets`

**"I want auto-regeneration while developing"**
→ `npm run generate-assets:watch`

**"I want to change colors"**
→ Edit `generate-assets.js` CSS variables, then regenerate

**"I want to change text"**
→ Edit `generate-assets.js` HTML content, then regenerate

**"I want to change size"**
→ Edit `generate-assets.js` dimensions in ASSETS object, then regenerate

**"I want to add a new asset type"**
→ See [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) Task 4

**"Something doesn't work"**
→ Check [QUICKSTART.md - Troubleshooting](QUICKSTART.md)

**"I need help"**
→ Check [INDEX.md](INDEX.md) for documentation map

---

## Estimated Time

- Setup: 5-10 minutes (first time)
- Generate: 2-3 minutes (with setup)
- Verification: 2-3 minutes
- **Total First Time: ~10-15 minutes**

- Regenerate: 1-2 minutes (after setup done)
- **Total Subsequent Times: ~2-3 minutes**

---

**Ready to start? Pick one:**
1. Windows: Double-click `setup-assets.bat`
2. macOS/Linux: `chmod +x setup-assets.sh && ./setup-assets.sh`
3. Manual: `npm install && npm run generate-assets`

**Good luck! 🚀**
