# Request Time-Lapse (DevTools Extension)

DevTools panel that records and replays network requests across page reloads so you can track regressions, schema drift, and latency changes over time.

## 🚀 Quick Start

### Installation
1. Open Chrome/Edge `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Open DevTools → you'll see a **Request Time-Lapse** tab.

### Usage
- Listens to `chrome.devtools.network.onRequestFinished` and stores request/response snapshots in IndexedDB.
- Groups calls by `METHOD + pathname`, tracking environment/branch tags from headers or query params (`x-env`, `x-environment`, `x-deployment`, `env`, `stage`, `x-branch`, `branch`).
- Timeline view shows status, latency, payload size, and mime type; selecting a call shows request/response plus a lightweight schema + JSON diff against the previous call for that endpoint.
- One-click **Export bundle** downloads the latest history for the selected endpoint as JSON (last 20 calls).

## 📊 Features

### Core Capabilities
✅ **Network Recording** - Capture all API requests with full request/response data
✅ **Request Grouping** - Organize by endpoint (method + path)
✅ **Schema Tracking** - Detect type changes in responses
✅ **Performance Monitoring** - Track latency trends across requests
✅ **JSON Diffing** - Compare response payloads between calls
✅ **Data Persistence** - Store data in IndexedDB across page reloads

### Advanced Features
✨ **Smart Filtering** - Filter by status codes, latency, response content
✨ **Multiple Export Formats** - JSON, CSV, HTML reports
✨ **Comparison Mode** - Side-by-side snapshot comparison
✨ **Theme Support** - Dark and light themes with persistence
✨ **Keyboard Shortcuts** - Power user workflows
✨ **Storage Monitoring** - Track IndexedDB usage with warnings
✨ **Error Handling** - Graceful error recovery with user feedback
✨ **Automatic Detection** - Identifies schema changes, latency spikes, server errors

## 🎮 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `Cmd+K` | Focus endpoint search |
| `Ctrl+E` / `Cmd+E` | Export as JSON |
| `Ctrl+T` / `Cmd+T` | Toggle theme |
| `Ctrl+Shift+C` / `Cmd+Shift+C` | Toggle compare mode |
| `↑` / `↓` | Navigate timeline |

## 📁 Project Structure

```
.
├── manifest.json              # Extension metadata
├── devtools.html/js           # DevTools panel setup
├── panel.html                 # Main UI
├── panel.js                   # Core logic (700+ lines)
├── styles.css                 # Theme & styling
├── generate-assets.js         # Asset generation script
├── package.json               # Node.js dependencies
├── README.md                  # This file
├── ENHANCEMENTS.md            # Feature documentation
├── ASSET_GENERATION.md        # Asset generator docs
├── QUICKSTART.md              # Quick start guide
└── assets/                    # Generated promotional assets
```

## ⚙️ Configuration

### Adjust Storage Limits
In `panel.js`, modify `MAX_BODY_LENGTH`:
```javascript
const MAX_BODY_LENGTH = 15000; // Truncate bodies larger than this
```

### Modify Environment Detection
In `panel.js`, update `detectEnvironment()` to recognize your custom headers:
```javascript
const candidates = [
  headers["x-custom-env"],  // Add your header name
  headers["x-environment"],
  // ... other sources
];
```

## 🎨 Generate Promotional Assets

This project includes a script to generate Chrome Web Store promotional graphics.

### Quick Setup
```bash
# Windows
setup-assets.bat

# macOS/Linux
chmod +x setup-assets.sh
./setup-assets.sh

# Manual
npm install
npm run generate-assets
```

### Generated Assets
- **Store Icon** (128×128)
- **Screenshots** (1280×800, 640×400)
- **Promo Tiles** (440×280, 1400×560)

See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.

## 📈 Use Cases

### 1. **API Regression Detection**
Track if endpoints change schema unexpectedly:
```
Example: POST /api/users
Call #5: { id, name, email, role }
Call #6: { id, name, email }  ← role field removed!
```

### 2. **Performance Tracking**
Identify latency regressions:
```
Timeline View:
11:45 → 245ms ✅
11:46 → 523ms ⚠️ (latency spike)
11:47 → 1250ms ❌ (timeout)
```

### 3. **Environment Debugging**
Switch between dev/staging/prod:
```
Filter by env tag → Only see prod requests
Compare dev vs prod responses → Spot differences
```

### 4. **Cross-Reload Testing**
Reload the page and keep recording:
```
Page Load #1: 3 requests captured
Page Reload: 3 new requests recorded
Compare: Did anything change?
```

## 🔧 Development

### Structure
- **panel.js**: Main application logic (~700 lines)
  - State management
  - DOM rendering
  - IndexedDB operations
  - Export functionality
  - Error handling

- **styles.css**: Theming
  - Dark theme (default)
  - Light theme (new!)
  - Component styles

- **panel.html**: UI markup
  - Controls and filters
  - Three-column layout
  - Comparison view

### Adding Features

1. **New Filter Type**
   - Add input to `panel.html` controls
   - Implement filter logic in `filterTimeline()`
   - Update `renderTimeline()` to use filter

2. **New Export Format**
   - Create `exportAs<Format>()` function
   - Add to export handler
   - Test file download

3. **New Comparison Metric**
   - Extend `buildComparisonDiff()`
   - Add to comparison view
   - Update styling as needed

## 🐛 Known Limitations

- Bodies are truncated to ~15 KB for storage sanity; bump `MAX_BODY_LENGTH` if needed.
- Comparison mode shows last 20 calls max (to keep UI performant).
- IndexedDB storage limited to browser quota (~50MB estimated).

## 💡 Future Enhancements

- 📅 Date range picker for filtering
- 📊 P95/P99 latency calculations
- 🔁 Request retry with modified payloads
- ✓ Schema validation against JSON schemas
- 🔔 Automatic regression alerts
- 👥 Team sync and sharing
- 🌐 Cloud backup of recordings
- 📈 Graphical performance charts

## 📝 Notes

### Optional Future Hooks
- Call out to a local helper that exposes git branch/commit, CI build number, or env metadata and attach to each snapshot.
- Webhook integration for automatic alerts on regressions.

### Data Management
- Hit **Clear** to wipe IndexedDB from the panel.
- Export before clearing to preserve important data.
- Storage indicator warns at 90% capacity.

## 🎯 Best Practices

1. **Regular Exports** - Export important test runs before clearing
2. **Environment Tagging** - Use x-env headers for easy filtering
3. **Meaningful Branches** - Use x-branch headers with descriptive names
4. **Review Diffs** - Always check schema diffs after API changes
5. **Monitor Latency** - Watch for performance regressions

## 📄 License

MIT

## 🔒 Privacy Policy

This extension does not collect, store, or transmit any personal data. All processing occurs locally in your browser. See our full [Privacy Policy](PRIVACY_POLICY.md) for details.

## 🤝 Contributing

Found a bug? Have a feature request?

1. Create an issue with details
2. Fork and create a feature branch
3. Submit a pull request

## 📞 Support

- Check [ENHANCEMENTS.md](ENHANCEMENTS.md) for feature details
- See [ASSET_GENERATION.md](ASSET_GENERATION.md) for asset help
- Review [QUICKSTART.md](QUICKSTART.md) for quick reference

---

**Happy debugging! 🎉**
