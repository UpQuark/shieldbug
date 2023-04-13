function replaceWithCat(): void {
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh;">
      <img src="https://example-cat-image.com/cat.jpg" alt="A cute cat">
    </div>
  `;
}

chrome.storage.local.get("blockedUrls", (data: { blockedUrls?: string[] }) => {
  const currentUrl: string = window.location.href;
  const blockedUrls: string[] = data.blockedUrls || [];

  for (const url of blockedUrls) {
    if (currentUrl.startsWith(url)) {
      replaceWithCat();
      break;
    }
  }
});
