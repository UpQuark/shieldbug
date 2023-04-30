import {isUrlBlocked} from "./Helpers/UrlBlockChecker";
import {BlockList} from "./Settings/BlockedSites/BlockedSitesTypes";

function openBlockPage() {
  void chrome.runtime.sendMessage({ action: "openBlockPage" });
}

chrome.storage.local.get(
  ["blockLists", "blockedKeywords", "blockedCategories"],
  async (data: {
    blockLists?: BlockList[],
    blockedKeywords?: string[],
    blockedCategories?: string[]
  }) => {
  const currentUrl: string = window.location.href;
  const blockLists: BlockList[] = data.blockLists || [];
  const blockedKeywords: string[] = data.blockedKeywords || [];
  const blockedCategories: string[] = data.blockedCategories || [];

  // TODO: I am only defaulting to first blocklist
  if (await isUrlBlocked(currentUrl, blockLists[0].urls, blockedKeywords, blockedCategories)) {
    openBlockPage();
  }
});