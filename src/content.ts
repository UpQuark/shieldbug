import {isUrlBlocked} from "./UrlBlocker";

function openBlockPage() {
  chrome.runtime.sendMessage({ action: "openBlockPage" });
}

chrome.storage.local.get(["blockedUrls", "blockedKeywords"], (data: { blockedUrls?: string[], blockedKeywords?: string[] }) => {
  const currentUrl: string = window.location.href;
  const blockedUrls: string[] = data.blockedUrls || [];
  const blockedKeywords: string[] = data.blockedKeywords || [];

  if (isUrlBlocked(currentUrl, blockedUrls, blockedKeywords)) {
    openBlockPage();
  }
});