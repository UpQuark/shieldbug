self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      await chrome.storage.local.set({
        blockedUrls: [
          "https://example.com",
          "https://example.org"
        ]
      });
    })()
  );
});
