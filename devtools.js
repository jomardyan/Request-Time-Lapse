chrome.devtools.panels.create(
  "Request Time-Lapse",
  "",
  "panel.html",
  (panel) => {
    panel.onShown.addListener((win) => {
      if (win && win.panelReady) {
        win.panelReady();
      }
    });
  }
);
