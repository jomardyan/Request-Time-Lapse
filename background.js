/**
 * Request Time-Lapse - Background Service Worker
 * Handles extension icon click to open tutorial
 */

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Open tutorial in a new window
  chrome.windows.create({
    url: chrome.runtime.getURL('tutorial.html'),
    type: 'popup',
    width: 1000,
    height: 800,
    focused: true,
  });
});

// Optional: Handle installation/update
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Open tutorial on first install
    chrome.tabs.create({
      url: chrome.runtime.getURL('tutorial.html'),
    });
  }
});

console.log('[RequestTimeLapse] Background service worker loaded');
