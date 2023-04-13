/// <reference types="chrome"/>

self.addEventListener('install', () => {
  chrome.storage.local.set({
    blockedUrls: [
      "https://youtube.com",
      "https://www.youtube.com",
    ]
  });
});
