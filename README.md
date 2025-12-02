# Request Time-Lapse

[![Version](https://img.shields.io/badge/version-0.1.0-blue)](https://github.com/jomardyan/Request-Time-Lapse/releases)
[![License](https://img.shields.io/badge/license-Source%20Available-green)](LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-orange)](https://github.com/jomardyan/Request-Time-Lapse)

DevTools panel that records and replays network requests across page reloads for API regression debugging, schema tracking, and performance monitoring.

## Why Request Time-Lapse

Modern web applications constantly evolve, and APIs change frequently. Request Time-Lapse helps developers detect breaking changes, track schema drift, and monitor performance regressions by maintaining a persistent history of network requests across browser sessions.

## Key Features

- **Persistent Request History** - Records network calls across page reloads and browser sessions using IndexedDB
- **Smart Request Grouping** - Automatically organizes requests by endpoint (HTTP method + pathname)
- **Schema Change Detection** - Identifies type changes and missing fields in API responses
- **Performance Tracking** - Monitors latency trends and detects performance regressions
- **Environment-Aware** - Tracks deployment environments via headers (`x-env`, `x-environment`, `x-deployment`)
- **JSON Diff Viewer** - Side-by-side comparison of request/response payloads
- **Multiple Export Formats** - Export data as JSON, CSV, or HTML reports
- **Keyboard Shortcuts** - Efficient navigation and control for power users

## Installation

### Chrome/Edge (Developer Mode)

```bash
# Clone the repository
git clone https://github.com/jomardyan/Request-Time-Lapse.git
cd Request-Time-Lapse
```

1. Open `chrome://extensions` in Chrome or Edge
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked** and select the cloned folder
4. Open DevTools (F12) → Navigate to **Request Time-Lapse** tab

### Generate Promotional Assets (Optional)

```bash
# Install dependencies
npm install

# Generate assets for Chrome Web Store
npm run generate-assets
```

## Quick Start

### Basic Usage

1. Open any web page with API calls
2. Open DevTools (F12) and switch to the **Request Time-Lapse** tab
3. Reload the page to start recording requests
4. Click on any endpoint to view request/response details
5. Select two requests to compare changes

### Filtering Requests

```javascript
// Filter by status code
Status: 200, 404, 500

// Filter by latency
Latency > 500ms

// Filter by environment
Environment: production, staging, dev
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `Cmd+K` | Focus endpoint search |
| `Ctrl+E` / `Cmd+E` | Export as JSON |
| `Ctrl+T` / `Cmd+T` | Toggle theme (dark/light) |
| `Ctrl+Shift+C` / `Cmd+Shift+C` | Toggle comparison mode |
| `↑` / `↓` | Navigate timeline entries |

## Configuration

### Adjust Storage Limits

Modify `MAX_BODY_LENGTH` in `panel.js` to control response body truncation:

```javascript
const MAX_BODY_LENGTH = 15000; // bytes
```

### Custom Environment Detection

Add custom headers for environment detection in `panel.js`:

```javascript
function detectEnvironment(request) {
  const headers = request.headers || {};
  const candidates = [
    headers["x-custom-env"],     // Your custom header
    headers["x-environment"],
    headers["x-deployment"],
    // Add more header names as needed
  ];
  // ...
}
```

## Use Cases

### API Regression Detection

Track schema changes across deployments:

```
Endpoint: POST /api/users
Call #5: { id, name, email, role }
Call #6: { id, name, email }  ← "role" field removed!
```

### Performance Monitoring

Identify latency spikes:

```
11:45 → 245ms ✅ Normal
11:46 → 523ms ⚠️ Latency spike detected
11:47 → 1250ms ❌ Potential timeout issue
```

### Cross-Environment Testing

Compare responses between environments:

```
Dev:  { feature_flag: true, debug_mode: true }
Prod: { feature_flag: false }
```

## Project Structure

```
.
├── manifest.json          # Extension configuration
├── devtools.html/js       # DevTools panel registration
├── panel.html             # Main UI layout
├── panel.js               # Core application logic
├── styles.css             # Theme and component styles
├── background.js          # Service worker
├── generate-assets.js     # Promotional asset generator
└── docs/
    ├── QUICKSTART.md      # Quick reference guide
    ├── ENHANCEMENTS.md    # Feature documentation
    └── DEVELOPER_GUIDE.md # Development guidelines
```

## Development

### Running Locally

```bash
# No build process required - load directly as unpacked extension
chrome://extensions → Load unpacked → Select folder
```

### Testing

1. Open DevTools on any page with network activity
2. Navigate to Request Time-Lapse tab
3. Trigger API calls through the page
4. Verify requests appear in the timeline

### Adding New Features

**New Filter Type:**
- Add UI control in `panel.html`
- Implement filter logic in `filterTimeline()` function
- Update `renderTimeline()` to apply the filter

**New Export Format:**
- Create `exportAs<Format>()` function in `panel.js`
- Add export option to the export dropdown menu
- Test download functionality

## Known Limitations

- Response bodies truncated to 15KB by default (configurable)
- Comparison mode limited to last 20 requests per endpoint
- IndexedDB storage capped at ~50MB (browser-dependent)
- Large binary responses not fully captured

## Contributing

While the source code is available for review, **modifications and redistribution are not permitted** under the current license. For feature requests or bug reports:

1. Open an issue on GitHub with detailed information
2. Provide reproduction steps for bugs
3. Suggest use cases for feature requests

## License

This project is licensed under a **Source Available License**. You are free to:
- Use the extension for personal, educational, or commercial purposes
- View and study the source code
- Install and run the extension

You are **not permitted** to:
- Clone, fork, or redistribute the source code
- Modify or create derivative works
- Sell or sublicense the software

See the [LICENSE](LICENSE) file for complete terms.

## Privacy

Request Time-Lapse operates entirely locally within your browser. No data is collected, transmitted, or stored on external servers. All request history is stored in your browser's IndexedDB.

For details, see the [Privacy Policy](PRIVACY_POLICY.md).

## Support

- **Documentation**: Check [QUICKSTART.md](QUICKSTART.md) for quick reference
- **Features**: See [ENHANCEMENTS.md](ENHANCEMENTS.md) for detailed feature list
- **Development**: Review [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for technical details
- **Issues**: Report bugs via [GitHub Issues](https://github.com/jomardyan/Request-Time-Lapse/issues)

## Author

**Hayk Jomardyan**
- GitHub: [@jomardyan](https://github.com/jomardyan)
- Repository: [Request-Time-Lapse](https://github.com/jomardyan/Request-Time-Lapse)

---

**Version 0.1.0** | [Changelog](https://github.com/jomardyan/Request-Time-Lapse/releases) | [Report Issue](https://github.com/jomardyan/Request-Time-Lapse/issues)
