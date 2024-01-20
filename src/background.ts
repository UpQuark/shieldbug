/// <reference types="chrome"/>

self.addEventListener('install', () => {
  chrome.storage.sync.set({
    blockedUrls: []
  });
});

/**
 * When a message with action "openBlockPage" is received, updates the currently
 * active tab's URL to block.html file provided by the extension. This displays
 * the block page in the current tab and prevents the user from going back to the previous page.
 */
chrome.runtime.onMessage.addListener(
  (request: { action: string }, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    if (request.action === "openBlockPage") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        const tabId = tabs[0].id;
        if (tabId !== undefined) {
          chrome.tabs.update(tabId, { url: chrome.runtime.getURL("block.html") });
        }
      });
    }
  }
);

// Open options page on install
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === "install") {
    // This code runs when the extension is first installed
    chrome.runtime.openOptionsPage();
  }
});