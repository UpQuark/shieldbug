/// <reference types="chrome"/>

self.addEventListener('install', () => {
  chrome.storage.local.set({
    blockedUrls: []
  });
});
