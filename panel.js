(() => {
  const DB_NAME = "request-time-lapse";
  const DB_VERSION = 1;
  const STORE = "requests";
  const MAX_BODY_LENGTH = 15000;
  const STORAGE_QUOTA = 50 * 1024 * 1024; // 50MB estimate

  const state = {
    db: null,
    requests: [],
    endpoints: new Map(),
    selectedEndpointKey: null,
    selectedEntryId: null,
    selectedCompareId: null,
    compareMode: false,
    theme: localStorage.getItem("theme") || "dark",
    filters: {
      status: "",
      latency: null,
      response: "",
    },
  };

  const dom = {};

  // ============================================================
  // INITIALIZATION
  // ============================================================
  async function init() {
    try {
      cacheDom();
      applyTheme();
      bindUI();
      state.db = await openDatabase();
      state.requests = await loadAllRequests();
      recomputeEndpoints();
      renderEndpoints();
      selectDefaultEndpoint();
      renderTimeline();
      renderDetails();
      startRecording();
      updateStorageIndicator();
      logInfo("App initialized successfully");
    } catch (error) {
      handleError("Initialization failed", error);
    }
  }

  function cacheDom() {
    dom.endpointsList = document.getElementById("endpointsList");
    dom.timelineList = document.getElementById("timelineList");
    dom.requestDetail = document.getElementById("requestDetail");
    dom.responseDetail = document.getElementById("responseDetail");
    dom.diffDetail = document.getElementById("diffDetail");
    dom.environmentFilter = document.getElementById("environmentFilter");
    dom.endpointSearch = document.getElementById("endpointSearch");
    dom.statusFilter = document.getElementById("statusFilter");
    dom.latencyFilter = document.getElementById("latencyFilter");
    dom.responseFilter = document.getElementById("responseFilter");
    dom.exportBundle = document.getElementById("exportBundle");
    dom.exportBundleBtn = document.getElementById("exportBundleBtn");
    dom.clearData = document.getElementById("clearData");
    dom.themeToggle = document.getElementById("themeToggle");
    dom.storageStatus = document.getElementById("storageStatus");
    dom.compareToggle = document.getElementById("compareToggle");
    dom.detailsView = document.getElementById("detailsView");
    dom.compareView = document.getElementById("compareView");
    dom.compareRequest1 = document.getElementById("compareRequest1");
    dom.compareRequest2 = document.getElementById("compareRequest2");
    dom.compareResponse1 = document.getElementById("compareResponse1");
    dom.compareResponse2 = document.getElementById("compareResponse2");
    dom.compareDiff = document.getElementById("compareDiff");
  }

  function bindUI() {
    dom.environmentFilter.addEventListener("input", () => {
      renderEndpoints();
      renderTimeline();
    });

    dom.endpointSearch.addEventListener("input", () => {
      renderEndpoints();
    });

    dom.statusFilter.addEventListener("input", () => {
      state.filters.status = dom.statusFilter.value;
      renderTimeline();
    });

    dom.latencyFilter.addEventListener("input", () => {
      state.filters.latency = dom.latencyFilter.value ? parseInt(dom.latencyFilter.value) : null;
      renderTimeline();
    });

    dom.responseFilter.addEventListener("input", () => {
      state.filters.response = dom.responseFilter.value.toLowerCase();
      renderTimeline();
    });

    dom.exportBundle.addEventListener("click", exportBundle);
    dom.exportBundleBtn.addEventListener("click", exportBundleJSON);

    dom.clearData.addEventListener("click", async () => {
      if (confirm("Clear all recorded requests? This cannot be undone.")) {
        try {
          await clearDatabase();
          state.requests = [];
          recomputeEndpoints();
          state.selectedEndpointKey = null;
          state.selectedEntryId = null;
          renderEndpoints();
          renderTimeline();
          renderDetails();
          updateStorageIndicator();
          logInfo("Data cleared");
        } catch (error) {
          handleError("Failed to clear data", error);
        }
      }
    });

    dom.themeToggle.addEventListener("click", toggleTheme);
    dom.compareToggle.addEventListener("click", toggleCompareMode);

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "k" || e.key === "K") {
          e.preventDefault();
          dom.endpointSearch.focus();
        } else if (e.key === "e" || e.key === "E") {
          e.preventDefault();
          exportBundleJSON();
        } else if (e.key === "t" || e.key === "T") {
          e.preventDefault();
          toggleTheme();
        }
      }
      if (e.ctrlKey && e.shiftKey && (e.key === "c" || e.key === "C")) {
        e.preventDefault();
        toggleCompareMode();
      }
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        navigateTimeline(e.key === "ArrowUp");
      }
    });
  }

  function startRecording() {
    const statusEl = document.getElementById("recordingStatus");
    statusEl.textContent = "Recording";
    statusEl.classList.remove("pill-warn");
    statusEl.classList.add("pill-live");

    try {
      chrome.devtools.network.onRequestFinished.addListener((request) => {
        try {
          request.getContent((body) => {
            const entry = buildEntry(request, body || "");
            persistEntry(entry);
          });
        } catch (error) {
          logError("Error processing request", error);
        }
      });
    } catch (error) {
      handleError("Failed to start recording", error);
    }
  }

  function buildEntry(request, responseBody) {
    const startedAt = new Date(request.startedDateTime || Date.now()).getTime();
    const headers = headerListToObject(request.request?.headers || []);
    const responseHeaders = headerListToObject(request.response?.headers || []);
    const urlStr = request.request?.url || "";
    const url = safeURL(urlStr);
    const envTag = detectEnvironment(headers, url);
    const branchTag = detectBranch(headers, url);
    const parsedBody = trimBody(responseBody);
    const parsedJson = parseJSONSafe(parsedBody);
    const schema = parsedJson ? buildSchemaMap(parsedJson) : {};

    const entry = {
      id: crypto.randomUUID(),
      endpointKey: buildEndpointKey(request),
      method: request.request?.method || "GET",
      url: urlStr,
      host: url?.host || "unknown",
      path: url?.pathname || urlStr,
      querySignature: buildQuerySignature(url),
      environment: envTag,
      branch: branchTag,
      status: request.response?.status || 0,
      statusText: request.response?.statusText || "",
      latencyMs: Math.round((request.time || 0) * 1000),
      requestHeaders: headers,
      requestBody: trimBody(request.request?.postData?.text || ""),
      responseHeaders,
      responseBody: parsedBody,
      mimeType: request.response?.content?.mimeType || "",
      payloadSize: estimateSize(parsedBody),
      schemaMap: schema,
      startedAt,
    };

    return entry;
  }

  async function persistEntry(entry) {
    try {
      await saveRequest(entry);
      state.requests.push(entry);
      recomputeEndpoints();

      if (!state.selectedEndpointKey) {
        state.selectedEndpointKey = entry.endpointKey;
      }
      renderEndpoints();

      if (entry.endpointKey === state.selectedEndpointKey) {
        renderTimeline();
      }

      updateStorageIndicator();
    } catch (error) {
      handleError("Failed to persist request", error);
    }
  }

  function buildEndpointKey(request) {
    const url = safeURL(request.request?.url || "");
    const path = url ? url.pathname : request.request?.url || "";
    return `${request.request?.method || "GET"} ${path}`;
  }

  function buildQuerySignature(url) {
    if (!url) return "";
    const keys = [...url.searchParams.keys()].sort();
    return keys.join("&");
  }

  function headerListToObject(list) {
    return (list || []).reduce((acc, h) => {
      acc[h.name.toLowerCase()] = h.value;
      return acc;
    }, {});
  }

  function detectEnvironment(headers, url) {
    const lowerHeaders = headers || {};
    const candidates = [
      lowerHeaders["x-env"],
      lowerHeaders["x-environment"],
      lowerHeaders["x-deployment"],
      url?.searchParams.get("env"),
      url?.searchParams.get("stage"),
    ];
    return candidates.find(Boolean) || "unlabeled";
  }

  function detectBranch(headers, url) {
    const lowerHeaders = headers || {};
    const candidates = [
      lowerHeaders["x-branch"],
      lowerHeaders["x-git-branch"],
      url?.searchParams.get("branch"),
    ];
    return candidates.find(Boolean) || "unknown-branch";
  }

  function parseJSONSafe(text) {
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  }

  function trimBody(body) {
    if (!body) return "";
    if (body.length <= MAX_BODY_LENGTH) return body;
    return `${body.slice(0, MAX_BODY_LENGTH)}\n\n[truncated]`;
  }

  function buildSchemaMap(value, prefix = "", acc = {}) {
    if (value === null) {
      acc[prefix || "$"] = "null";
      return acc;
    }
    const type = Array.isArray(value) ? "array" : typeof value;
    acc[prefix || "$"] = type;

    if (type === "object") {
      Object.keys(value).forEach((key) => {
        buildSchemaMap(value[key], prefix ? `${prefix}.${key}` : key, acc);
      });
    } else if (type === "array") {
      if (value.length > 0) {
        buildSchemaMap(value[0], `${prefix}[]`, acc);
      } else {
        acc[`${prefix}[]`] = "empty-array";
      }
    }
    return acc;
  }

  function estimateSize(str) {
    return new TextEncoder().encode(str || "").length;
  }

  function recomputeEndpoints() {
    const map = new Map();
    state.requests.forEach((req) => {
      const current = map.get(req.endpointKey) || {
        key: req.endpointKey,
        method: req.method,
        path: req.path,
        count: 0,
        lastStatus: req.status,
        totalLatency: 0,
        avgLatency: 0,
        environments: new Set(),
      };

      current.count += 1;
      current.lastStatus = req.status;
      current.totalLatency += req.latencyMs;
      current.avgLatency = Math.round(current.totalLatency / current.count);
      current.environments.add(req.environment);

      map.set(req.endpointKey, current);
    });
    state.endpoints = map;
  }

  function renderEndpoints() {
    dom.endpointsList.innerHTML = "";
    const search = (dom.endpointSearch.value || "").toLowerCase();
    const envFilter = (dom.environmentFilter.value || "").toLowerCase();

    const entries = [...state.endpoints.values()].filter((endpoint) => {
      const matchesSearch =
        !search ||
        endpoint.key.toLowerCase().includes(search) ||
        endpoint.path.toLowerCase().includes(search);
      const matchesEnv =
        !envFilter ||
        [...endpoint.environments].some((e) =>
          (e || "").toLowerCase().includes(envFilter)
        );
      return matchesSearch && matchesEnv;
    });

    if (entries.length === 0) {
      dom.endpointsList.innerHTML = '<div class="empty">No endpoints yet.</div>';
      return;
    }

    entries.sort((a, b) => b.count - a.count);

    entries.forEach((endpoint) => {
      const item = document.createElement("div");
      item.className = "list-item";
      if (endpoint.key === state.selectedEndpointKey) {
        item.classList.add("active");
      }
      item.innerHTML = `
        <div class="endpoint-title">${endpoint.key}</div>
        <div class="small">calls: ${endpoint.count} · avg: ${endpoint.avgLatency}ms · last: <span class="${endpoint.lastStatus >= 200 && endpoint.lastStatus < 400 ? "status-ok" : "status-bad"}">${endpoint.lastStatus}</span></div>
        <div class="small">${[...endpoint.environments]
          .map((e) => `<span class="badge">${e}</span>`)
          .join("")}</div>
      `;

      item.addEventListener("click", () => {
        state.selectedEndpointKey = endpoint.key;
        state.selectedEntryId = null;
        state.selectedCompareId = null;
        renderEndpoints();
        renderTimeline();
        renderDetails();
      });

      dom.endpointsList.appendChild(item);
    });
  }

  function renderTimeline() {
    dom.timelineList.innerHTML = "";
    if (!state.selectedEndpointKey) {
      dom.timelineList.innerHTML =
        '<div class="empty">Select an endpoint to see history.</div>';
      return;
    }

    let filtered = state.requests
      .filter((r) => r.endpointKey === state.selectedEndpointKey)
      .sort((a, b) => b.startedAt - a.startedAt);

    filtered = filterTimeline(filtered);

    if (filtered.length === 0) {
      dom.timelineList.innerHTML =
        '<div class="empty">No calls match the filters.</div>';
      return;
    }

    filtered.forEach((req) => {
      const previous = findPrevious(filtered, req);
      const warnings = buildWarnings(req, previous);
      const item = document.createElement("div");
      item.className = "list-item";
      if (req.id === state.selectedEntryId) item.classList.add("active");
      const statusClass =
        req.status >= 200 && req.status < 400 ? "status-ok" : "status-bad";

      item.innerHTML = `
        <div>${new Date(req.startedAt).toLocaleTimeString()} · <span class="${statusClass}">${req.status}</span> · ${req.latencyMs}ms</div>
        <div class="small">${req.environment} · ${req.branch}</div>
        <div class="timeline-meta">
          <span class="badge">${req.method}</span>
          <span class="badge">${req.mimeType || "unknown"}</span>
          <span class="badge">${req.payloadSize} bytes</span>
          ${warnings
            .map((w) => `<span class="badge warning">${w}</span>`)
            .join("")}
        </div>
      `;

      item.addEventListener("click", () => {
        if (state.compareMode && state.selectedEntryId && state.selectedEntryId !== req.id) {
          state.selectedCompareId = req.id;
          renderComparison();
        } else {
          state.selectedEntryId = req.id;
          if (!state.compareMode) {
            renderTimeline();
            renderDetails();
          }
        }
        renderTimeline();
      });

      if (state.compareMode && req.id === state.selectedCompareId) {
        item.classList.add("compare-selected");
      }

      dom.timelineList.appendChild(item);
    });

    if (!state.selectedEntryId && filtered[0]) {
      state.selectedEntryId = filtered[0].id;
      if (state.compareMode) {
        renderComparison();
      } else {
        renderDetails();
      }
    }
  }

  function renderDetails() {
    const entry = state.requests.find((r) => r.id === state.selectedEntryId);
    if (!entry) {
      dom.requestDetail.textContent = "No request selected.";
      dom.responseDetail.textContent = "";
      dom.diffDetail.textContent = "";
      return;
    }

    const requestText = [
      `${entry.method} ${entry.url}`,
      "",
      "Headers:",
      prettyJSON(entry.requestHeaders),
      "",
      entry.requestBody ? "Body:" : "Body: <empty>",
      entry.requestBody || "",
    ].join("\n");

    const responseText = [
      `Status: ${entry.status} ${entry.statusText}`,
      `Latency: ${entry.latencyMs}ms`,
      `Mime: ${entry.mimeType}`,
      "",
      "Headers:",
      prettyJSON(entry.responseHeaders),
      "",
      entry.responseBody ? "Body:" : "Body: <empty>",
      entry.responseBody || "",
    ].join("\n");

    dom.requestDetail.textContent = requestText;
    dom.responseDetail.textContent = responseText;
    dom.diffDetail.textContent = buildDiffText(entry);
  }

  function buildDiffText(entry) {
    const previous = findPrevious(state.requests, entry);
    if (!previous) return "No previous call to diff against.";

    const schemaDiff = diffSchema(previous.schemaMap || {}, entry.schemaMap || {});
    const statusChange =
      entry.status !== previous.status
        ? `Status changed: ${previous.status} -> ${entry.status}`
        : "Status unchanged.";
    const latencyDelta = entry.latencyMs - previous.latencyMs;
    const latencyText = `Latency: ${previous.latencyMs}ms -> ${entry.latencyMs}ms (${latencyDelta >= 0 ? "+" : ""}${latencyDelta}ms)`;

    const jsonChange =
      entry.responseBody && previous.responseBody
        ? diffBodies(previous.responseBody, entry.responseBody)
        : "Payload diff unavailable.";

    return [statusChange, latencyText, schemaDiff, jsonChange].join("\n\n");
  }

  function findPrevious(collection, entry) {
    return collection
      .filter(
        (r) => r.endpointKey === entry.endpointKey && r.startedAt < entry.startedAt
      )
      .sort((a, b) => b.startedAt - a.startedAt)[0];
  }

  function buildWarnings(entry, previous) {
    const warnings = [];
    if (!previous) return warnings;
    const schemaDiff = diffSchema(previous.schemaMap || {}, entry.schemaMap || {});
    if (schemaDiff !== "Schema stable.") warnings.push("schema change");
    if (entry.status >= 500) warnings.push("server error");
    const perfThreshold = previous.latencyMs * 1.5 + 50;
    if (entry.latencyMs > perfThreshold) warnings.push("latency spike");
    return warnings;
  }

  function diffSchema(prev, next) {
    const added = [];
    const removed = [];
    const changed = [];

    Object.keys(next).forEach((key) => {
      if (!prev[key]) {
        added.push(`${key} (${next[key]})`);
      } else if (prev[key] !== next[key]) {
        changed.push(`${key}: ${prev[key]} -> ${next[key]}`);
      }
    });

    Object.keys(prev).forEach((key) => {
      if (!next[key]) removed.push(key);
    });

    if (!added.length && !removed.length && !changed.length) {
      return "Schema stable.";
    }

    return [
      added.length ? `Added: ${added.join(", ")}` : "",
      removed.length ? `Removed: ${removed.join(", ")}` : "",
      changed.length ? `Type changes: ${changed.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function diffBodies(prevBody, nextBody) {
    const prevObj = parseJSONSafe(prevBody);
    const nextObj = parseJSONSafe(nextBody);
    if (!prevObj || !nextObj) return "Non-JSON bodies; showing head/tail instead.\n\nprev:\n" + clip(prevBody) + "\n\nnext:\n" + clip(nextBody);

    const changes = [];
    if (JSON.stringify(prevObj) === JSON.stringify(nextObj)) {
      return "JSON identical.";
    }

    const prevKeys = new Set(Object.keys(flatten(prevObj)));
    const nextKeys = new Set(Object.keys(flatten(nextObj)));
    const added = [...nextKeys].filter((k) => !prevKeys.has(k));
    const removed = [...prevKeys].filter((k) => !nextKeys.has(k));

    if (added.length) changes.push(`+ ${added.slice(0, 8).join(", ")}`);
    if (removed.length) changes.push(`- ${removed.slice(0, 8).join(", ")}`);
    changes.push("See full payloads in Request/Response panels above.");
    return changes.join("\n");
  }

  function flatten(obj, prefix = "", acc = {}) {
    if (typeof obj !== "object" || obj === null) {
      acc[prefix || "$"] = obj;
      return acc;
    }
    Object.keys(obj).forEach((key) => {
      flatten(obj[key], prefix ? `${prefix}.${key}` : key, acc);
    });
    return acc;
  }

  function clip(text) {
    return text.length > 400 ? `${text.slice(0, 400)}...` : text;
  }

  function prettyJSON(obj) {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return String(obj);
    }
  }

  // ============================================================
  // THEME MANAGEMENT
  // ============================================================
  function applyTheme() {
    if (state.theme === "light") {
      document.documentElement.classList.add("light-theme");
      dom.themeToggle.textContent = "☀️ Light";
    } else {
      document.documentElement.classList.remove("light-theme");
      dom.themeToggle.textContent = "🌙 Dark";
    }
  }

  function toggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", state.theme);
    applyTheme();
    logInfo(`Theme switched to ${state.theme}`);
  }

  // ============================================================
  // COMPARE MODE
  // ============================================================
  function toggleCompareMode() {
    state.compareMode = !state.compareMode;
    if (!state.compareMode) {
      state.selectedCompareId = null;
    }
    dom.detailsView.style.display = state.compareMode ? "none" : "block";
    dom.compareView.style.display = state.compareMode ? "block" : "none";
    dom.compareToggle.style.opacity = state.compareMode ? "1" : "0.5";
    renderTimeline();
    logInfo(`Compare mode: ${state.compareMode ? "ON" : "OFF"}`);
  }

  function renderComparison() {
    if (!state.selectedEntryId || !state.selectedCompareId) {
      dom.compareView.innerHTML = '<div class="empty">Select two snapshots to compare.</div>';
      return;
    }

    const entry1 = state.requests.find((r) => r.id === state.selectedEntryId);
    const entry2 = state.requests.find((r) => r.id === state.selectedCompareId);

    if (!entry1 || !entry2) return;

    const requestText1 = `${entry1.method} ${entry1.url}\n\nHeaders:\n${prettyJSON(entry1.requestHeaders)}\n\nBody:\n${entry1.requestBody || "<empty>"}`;
    const requestText2 = `${entry2.method} ${entry2.url}\n\nHeaders:\n${prettyJSON(entry2.requestHeaders)}\n\nBody:\n${entry2.requestBody || "<empty>"}`;

    const responseText1 = `Status: ${entry1.status} ${entry1.statusText}\nLatency: ${entry1.latencyMs}ms\n\nHeaders:\n${prettyJSON(entry1.responseHeaders)}\n\nBody:\n${entry1.responseBody || "<empty>"}`;
    const responseText2 = `Status: ${entry2.status} ${entry2.statusText}\nLatency: ${entry2.latencyMs}ms\n\nHeaders:\n${prettyJSON(entry2.responseHeaders)}\n\nBody:\n${entry2.responseBody || "<empty>"}`;

    const diffText = buildComparisonDiff(entry1, entry2);

    dom.compareRequest1.textContent = requestText1;
    dom.compareRequest2.textContent = requestText2;
    dom.compareResponse1.textContent = responseText1;
    dom.compareResponse2.textContent = responseText2;
    dom.compareDiff.textContent = diffText;
  }

  function buildComparisonDiff(entry1, entry2) {
    const lines = [];
    lines.push("=== COMPARISON DIFF ===\n");

    if (entry1.status !== entry2.status) {
      lines.push(`Status: ${entry1.status} -> ${entry2.status}`);
    }

    const latencyDelta = entry2.latencyMs - entry1.latencyMs;
    lines.push(`Latency: ${entry1.latencyMs}ms -> ${entry2.latencyMs}ms (${latencyDelta >= 0 ? "+" : ""}${latencyDelta}ms)`);

    const schemaDiff = diffSchema(entry1.schemaMap || {}, entry2.schemaMap || {});
    if (schemaDiff !== "Schema stable.") {
      lines.push(`\nSchema changes:\n${schemaDiff}`);
    }

    if (entry1.responseBody && entry2.responseBody) {
      const jsonDiff = diffBodies(entry1.responseBody, entry2.responseBody);
      if (jsonDiff !== "JSON identical.") {
        lines.push(`\nPayload changes:\n${jsonDiff}`);
      }
    }

    return lines.join("\n");
  }

  // ============================================================
  // STORAGE MANAGEMENT
  // ============================================================
  async function updateStorageIndicator() {
    try {
      const usage = await getStorageUsage();
      const percent = Math.round((usage / STORAGE_QUOTA) * 100);
      const display = percent > 90 ? `📊 ${percent}% (WARNING)` : `📊 ${percent}%`;
      dom.storageStatus.textContent = display;
      dom.storageStatus.className = percent > 90 ? "pill pill-warn" : "pill";
    } catch (error) {
      logError("Failed to update storage indicator", error);
    }
  }

  async function getStorageUsage() {
    return new Promise((resolve) => {
      const tx = state.db.transaction(STORE, "readonly");
      const store = tx.objectStore(STORE);
      const req = store.getAll();
      req.onsuccess = () => {
        const total = req.result.reduce((sum, obj) => {
          return sum + new TextEncoder().encode(JSON.stringify(obj)).length;
        }, 0);
        resolve(total);
      };
      req.onerror = () => resolve(0);
    });
  }

  // ============================================================
  // FILTERING
  // ============================================================
  function filterTimeline(requests) {
    return requests.filter((r) => {
      // Status filter
      if (state.filters.status) {
        const statuses = state.filters.status.split(",").map((s) => parseInt(s.trim()));
        if (!statuses.includes(r.status)) return false;
      }

      // Latency filter
      if (state.filters.latency !== null && r.latencyMs > state.filters.latency) {
        return false;
      }

      // Response content filter
      if (state.filters.response) {
        const bodyText = (r.responseBody || "").toLowerCase();
        if (!bodyText.includes(state.filters.response)) return false;
      }

      return true;
    });
  }

  function navigateTimeline(isUp) {
    if (!state.selectedEndpointKey) return;

    let filtered = state.requests
      .filter((r) => r.endpointKey === state.selectedEndpointKey)
      .sort((a, b) => b.startedAt - a.startedAt);

    filtered = filterTimeline(filtered);

    const currentIdx = filtered.findIndex((r) => r.id === state.selectedEntryId);
    let nextIdx = isUp ? currentIdx - 1 : currentIdx + 1;

    if (nextIdx >= 0 && nextIdx < filtered.length) {
      state.selectedEntryId = filtered[nextIdx].id;
      renderTimeline();
      if (state.compareMode) {
        renderComparison();
      } else {
        renderDetails();
      }
    }
  }

  async function exportBundle() {
    try {
      if (!state.selectedEndpointKey) {
        alert("Select an endpoint to export.");
        return;
      }

      const format = prompt("Export format: JSON, CSV, or HTML?", "JSON");
      if (!format) return;

      const upperFormat = format.toUpperCase();
      const entries = state.requests
        .filter((r) => r.endpointKey === state.selectedEndpointKey)
        .sort((a, b) => a.startedAt - b.startedAt);

      if (upperFormat === "CSV") {
        exportAsCSV(entries);
      } else if (upperFormat === "HTML") {
        exportAsHTML(entries);
      } else {
        exportAsJSON(entries);
      }
      logInfo(`Exported ${entries.length} requests as ${upperFormat}`);
    } catch (error) {
      handleError("Export failed", error);
    }
  }

  async function exportBundleJSON() {
    try {
      if (!state.selectedEndpointKey) {
        alert("Select an endpoint to export.");
        return;
      }

      const entries = state.requests
        .filter((r) => r.endpointKey === state.selectedEndpointKey)
        .sort((a, b) => a.startedAt - b.startedAt);

      exportAsJSON(entries);
      logInfo(`Exported ${entries.length} requests as JSON`);
    } catch (error) {
      handleError("JSON export failed", error);
    }
  }

  function exportAsJSON(entries) {
    const annotated = entries.map((entry, idx) => {
      const previous = idx > 0 ? entries[idx - 1] : null;
      return {
        id: entry.id,
        startedAt: entry.startedAt,
        status: entry.status,
        latencyMs: entry.latencyMs,
        environment: entry.environment,
        branch: entry.branch,
        method: entry.method,
        url: entry.url,
        requestHeaders: entry.requestHeaders,
        responseHeaders: entry.responseHeaders,
        diffSummary: previous ? buildDiffText(entry) : "First call.",
      };
    });

    const bundle = {
      generatedAt: new Date().toISOString(),
      endpoint: state.selectedEndpointKey,
      total: entries.length,
      sample: annotated.slice(-20),
    };

    downloadFile(JSON.stringify(bundle, null, 2), "request-time-lapse-bundle.json", "application/json");
  }

  function exportAsCSV(entries) {
    const headers = ["Timestamp", "Status", "Latency (ms)", "Environment", "Branch", "Method", "URL"];
    const rows = entries.map((e) => [
      new Date(e.startedAt).toISOString(),
      e.status,
      e.latencyMs,
      e.environment,
      e.branch,
      e.method,
      e.url,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    downloadFile(csv, "request-time-lapse-bundle.csv", "text/csv");
  }

  function exportAsHTML(entries) {
    const rows = entries
      .map(
        (e) => `
      <tr>
        <td>${new Date(e.startedAt).toLocaleString()}</td>
        <td>${e.status}</td>
        <td>${e.latencyMs}ms</td>
        <td>${e.environment}</td>
        <td>${e.branch}</td>
        <td>${e.method}</td>
        <td>${clip(e.url)}</td>
      </tr>
    `
      )
      .join("");

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Request Time-Lapse Report</title>
        <style>
          body { font-family: system-ui; margin: 20px; background: #f5f5f5; }
          h1 { color: #333; }
          table { border-collapse: collapse; width: 100%; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          th { background: #0078d4; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          tr:hover { background: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>Request Time-Lapse Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <p>Endpoint: ${state.selectedEndpointKey}</p>
        <p>Total Requests: ${entries.length}</p>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Status</th>
              <th>Latency</th>
              <th>Environment</th>
              <th>Branch</th>
              <th>Method</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
    `;

    downloadFile(html, "request-time-lapse-bundle.html", "text/html");
  }

  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function selectDefaultEndpoint() {
    if (!state.selectedEndpointKey && state.requests[0]) {
      state.selectedEndpointKey = state.requests[0].endpointKey;
    }
  }

  function safeURL(urlStr) {
    try {
      return new URL(urlStr);
    } catch (e) {
      return null;
    }
  }

  // ============================================================
  // ERROR HANDLING & LOGGING
  // ============================================================
  function handleError(message, error) {
    console.error(`[RequestTimeLapse] ${message}:`, error);
    const errorMsg = error?.message || String(error);
    showErrorToUser(`${message}: ${errorMsg}`);
  }

  function logInfo(message) {
    console.log(`[RequestTimeLapse] ${message}`);
  }

  function logError(message, error) {
    console.error(`[RequestTimeLapse] ${message}:`, error);
  }

  function showErrorToUser(message) {
    const errorEl = document.createElement("div");
    errorEl.className = "error-message";
    errorEl.textContent = message;
    const detailsView = document.getElementById("detailsView");
    if (detailsView && detailsView.parentElement) {
      detailsView.parentElement.insertBefore(errorEl, detailsView);
      setTimeout(() => errorEl.remove(), 5000);
    }
  }

  // ============================================================
  // INDEXEDDB HELPERS
  // ============================================================
  function openDatabase() {
    return new Promise((resolve, reject) => {
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onerror = (ev) => reject(new Error("Database open failed"));
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE)) {
            const store = db.createObjectStore(STORE, { keyPath: "id" });
            store.createIndex("endpointKey", "endpointKey", { unique: false });
            store.createIndex("startedAt", "startedAt", { unique: false });
          }
        };
        req.onsuccess = () => resolve(req.result);
      } catch (error) {
        reject(error);
      }
    });
  }

  function saveRequest(entry) {
    return new Promise((resolve, reject) => {
      try {
        const tx = state.db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(entry);
        tx.oncomplete = () => resolve();
        tx.onerror = (ev) => reject(new Error("Save failed"));
      } catch (error) {
        reject(error);
      }
    });
  }

  function loadAllRequests() {
    return new Promise((resolve, reject) => {
      try {
        const tx = state.db.transaction(STORE, "readonly");
        const req = tx.objectStore(STORE).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = (ev) => reject(new Error("Load failed"));
      } catch (error) {
        reject(error);
      }
    });
  }

  function clearDatabase() {
    return new Promise((resolve, reject) => {
      try {
        const tx = state.db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = (ev) => reject(new Error("Clear failed"));
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============================================================
  // ENTRY POINT
  // ============================================================
  let started = false;
  window.panelReady = () => {
    if (!started) {
      started = true;
      init();
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    window.panelReady();
  });
})();
