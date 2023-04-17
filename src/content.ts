function openBlockPage() {
  chrome.runtime.sendMessage({ action: "openBlockPage" });
}

function isUrlBlocked(url: string, blockedUrls: string[]): boolean {
  if (!url.startsWith("http://") && !url.startsWith("https://"))  url = "https://" + url;
  const hostname = new URL(url).hostname;
  const mainDomain = hostname.split('.').slice(-2).join('.');
  return blockedUrls.includes(mainDomain);
}

chrome.storage.local.get("blockedUrls", (data: { blockedUrls?: string[] }) => {
  const currentUrl: string = window.location.href;
  const blockedUrls: string[] = data.blockedUrls || [];

  if (isUrlBlocked(currentUrl, blockedUrls)) {
    openBlockPage();
  }
});
