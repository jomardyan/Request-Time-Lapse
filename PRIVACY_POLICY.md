# Privacy Policy for Request Time-Lapse

**Effective date:** December 2, 2025  

This Privacy Policy describes how the browser extension **Request Time-Lapse** (the "Extension") provided by **jomardyan** ("we", "us", or "our") handles information when used in supported browsers, including Google Chrome and Microsoft Edge.

By installing or using the Extension, you acknowledge that you have read and understood this Privacy Policy.

## 1. Scope

This Privacy Policy applies solely to the Extension as distributed through:
- The Chrome Web Store for Google Chrome and other Chromium-based browsers.
- The Microsoft Edge Add-ons store for Microsoft Edge.

It does not apply to any websites, services, or applications that may be accessed through the Extension but are operated by third parties under their own privacy policies.

## 2. Data Collection and Processing

**Request Time-Lapse does not collect, store, transmit, or process any personal data or personally identifiable information (PII) on external servers.**

Specifically, the Extension does **not**:
- Collect or transmit your browsing history, URLs, or search queries to external servers
- Send your IP address or device identifiers anywhere
- Use cookies or similar tracking technologies for analytics
- Track your behavior across websites for marketing or profiling
- Perform any external analytics or user tracking
- Transmit any recorded network request data to external servers
- Share any data with third parties

All features of the Extension work entirely locally within your browser and DevTools environment.

## 3. Local Processing and Storage

### Network Request Recording
The Extension operates as a DevTools panel that:
- Records network requests made by web pages you visit **while DevTools is open**
- Captures request/response data including URLs, headers, payloads, status codes, and timing information
- Stores this data **locally in your browser's IndexedDB** (not on external servers)
- Groups and analyzes requests to help you debug API changes and performance issues

### Data Storage Location
- All recorded network data is stored **only in your browser's local IndexedDB**
- Request history, response payloads, and settings remain on your device
- We have no servers, no databases, and no access to any information captured by the Extension
- You have complete control over this data and can clear it at any time from the Extension panel

### Data Retention
- Data is retained until you manually clear it using the Extension's "Clear" button
- Uninstalling the Extension removes all associated local data
- There is no automatic data expiration or external backup

## 4. No Third-Party Services

The Extension does **not**:
- Use third-party analytics tools, advertising networks, or tracking pixels
- Embed third-party SDKs or scripts for data collection
- Share any information with third parties (there is no data to share)
- Communicate with external servers or APIs
- Send telemetry or usage statistics

## 5. Permissions Explained

Request Time-Lapse requests the following browser permissions to provide its core functionality. **These permissions are not used for data collection, tracking, or external transmission:**

### Storage Permission
- **Purpose**: Store recorded network request history, response data, and user settings locally in IndexedDB
- **Data**: Request/response snapshots, filter preferences, theme settings
- **Privacy**: All data remains in your browser's local storage; nothing is transmitted externally

### Host Permissions (all_urls)
- **Purpose**: Required for the DevTools API to intercept and record network requests from any domain you debug
- **Data**: The Extension records network request details (URLs, headers, payloads) **only while DevTools is open**
- **Privacy**: Recorded data is stored locally and never transmitted to external servers
- **Important**: This permission does not grant access to page content or user activity outside of DevTools network monitoring

### DevTools Page
- **Purpose**: Integrate with Chrome/Edge DevTools to provide the network recording panel
- **Data**: Access to network activity through `chrome.devtools.network` API
- **Privacy**: Only captures network requests; does not access browsing history or user behavior outside DevTools

All permissions are used exclusively for the DevTools network debugging functionality and not for any form of data collection, tracking, or monetization.

## 6. What Data is Recorded Locally

When you use the Extension with DevTools open, it records locally:
- **Request URLs** - The endpoints being called
- **HTTP Methods** - GET, POST, PUT, DELETE, etc.
- **Request/Response Headers** - Including custom headers like environment tags
- **Request/Response Bodies** - Payloads (truncated to 15KB by default)
- **Status Codes** - HTTP response codes (200, 404, 500, etc.)
- **Timing Information** - Latency and performance metrics
- **Timestamps** - When each request occurred

**Important Notes:**
- This data is captured **only while DevTools is open** on pages you are actively debugging
- All data is stored **only in your browser's local IndexedDB**
- No data is ever transmitted to external servers
- You can export this data locally as JSON, CSV, or HTML for your own use
- You can clear all recorded data at any time using the Extension's "Clear" button

## 7. Children's Privacy

Because the Extension does not collect or transmit any personal information to external servers, and all data remains local to the user's browser, it does not knowingly collect information from children of any age. The Extension is intended for developer use and operates as a debugging tool.

## 8. User Rights and Controls

Since the Extension does not collect or store personal data on external servers, there is no personal data for us to access, modify, export, or delete.

You have complete control over the Extension and your locally stored data:
- **Disable**: Turn off the Extension at any time from your browser's extensions page
- **Clear Data**: Use the "Clear" button in the Extension panel to delete all recorded network data
- **Export Data**: Export your recorded data locally as JSON, CSV, or HTML files before clearing
- **Uninstall**: Remove the Extension completely, which will delete all locally stored data
- **Browser Storage**: Clear the Extension's IndexedDB storage through your browser's developer tools

To manage extensions:
- **Chrome**: chrome://extensions/
- **Edge**: edge://extensions/

## 9. International Data Transfers

Because we do not collect, store, or transmit any personal data to external servers, there are no international transfers of data. All network recording data remains local to your device.

## 10. Changes to This Privacy Policy

We may update this Privacy Policy to reflect:
- Changes in the Extension's functionality or behavior
- Updates to applicable laws, regulations, or browser extension policies
- Improvements to our privacy practices

When changes are made:
- The "Effective date" at the top will be updated
- Material changes will be reflected in the Chrome Web Store and Microsoft Edge Add-ons listings
- Continued use of the Extension after changes constitutes acceptance of the updated policy

## 11. Compliance

This Extension is designed to comply with:
- Chrome Web Store Developer Program Policies
- Microsoft Edge Add-ons Policies
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)

Given that no personal data is collected or transmitted externally, and all data processing occurs locally, most data protection obligations do not apply.

## 12. Security

While the Extension itself does not transmit data externally, the network requests you record may contain sensitive information (API keys, authentication tokens, personal data in payloads). We recommend:
- Clearing sensitive data from the Extension after debugging sessions
- Not sharing exported data files containing sensitive information
- Being mindful of what network traffic you record when debugging production systems
- Using the Extension's export feature to backup important debugging sessions before clearing

## 13. Contact

If you have any questions or concerns about this Privacy Policy or the Extension, you can contact us at:

**Developer:** jomardyan  
**GitHub Repository:** [https://github.com/jomardyan/Request-Time-Lapse](https://github.com/jomardyan/Request-Time-Lapse)  
**Report Issues:** [https://github.com/jomardyan/Request-Time-Lapse/issues](https://github.com/jomardyan/Request-Time-Lapse/issues)

---

**Summary**: Request Time-Lapse is a privacy-respecting DevTools extension that records network requests locally in your browser for debugging purposes. It collects no personal data, makes no external network requests, and shares nothing with third parties. All recorded network data remains in your browser's local storage under your complete control.
