function openBlockPage() {
  chrome.runtime.sendMessage({ action: "openBlockPage" });
}

function isUrlBlocked(url: string, blockedUrls: string[], blockedKeywords: string[]): boolean {
  if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
  const hostname = new URL(url).hostname;
  const mainDomain = hostname.split('.').slice(-2).join('.');

  // Check against blocked URLs
  if (blockedUrls.includes(mainDomain)) {
    return true;
  }

  // Check against blocked keywords
  for (const keyword of blockedKeywords) {
    if (url.includes(keyword)) {
      return true;
    }
  }

  return false;
}

chrome.storage.local.get(["blockedUrls", "blockedKeywords"], (data: { blockedUrls?: string[], blockedKeywords?: string[] }) => {
  const currentUrl: string = window.location.href;
  const blockedUrls: string[] = data.blockedUrls || [];
  const blockedKeywords: string[] = data.blockedKeywords || [];

  if (isUrlBlocked(currentUrl, blockedUrls, blockedKeywords)) {
    openBlockPage();
  }
});