import {isUrlBlocked} from "./Helpers/UrlBlockChecker";

function openBlockPage() {
  void chrome.runtime.sendMessage({ action: "openBlockPage" });
}

chrome.storage.local.get(
  ["blockedUrls", "blockedKeywords", "blockedCategories"],
  async (data: {
    blockedUrls?: string[],
    blockedKeywords?: string[],
    blockedCategories?: string[]
  }) => {
  const currentUrl: string = window.location.href;
  const blockedUrls: string[] = data.blockedUrls || [];
  const blockedKeywords: string[] = data.blockedKeywords || [];
  const blockedCategories: string[] = data.blockedCategories || [];

  if (await isUrlBlocked(currentUrl, blockedUrls, blockedKeywords, blockedCategories)) {
    openBlockPage();
  }
});