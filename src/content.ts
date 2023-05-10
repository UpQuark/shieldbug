import {isUrlBlocked} from "./Helpers/UrlBlockChecker";
import {BlockList} from "./Settings/BlockedSites/BlockedSitesTypes";
import {isBlockScheduleActive} from "./Settings/Scheduler/TimeHelper";
import {TimeInterval} from "./Settings/Scheduler/SchedulerTypes";

function openBlockPage() {
  void chrome.runtime.sendMessage({ action: "openBlockPage" });
}

chrome.storage.local.get(
  ["blockLists", "blockedKeywords", "blockedCategories", "intervals"],
  async (data: {
    blockLists?: BlockList[],
    blockedKeywords?: string[],
    blockedCategories?: string[]
  }) => {
  const currentUrl: string = window.location.href;
  const blockLists: BlockList[] = data.blockLists || [];
  const blockedKeywords: string[] = data.blockedKeywords || [];
  const blockedCategories: string[] = data.blockedCategories || [];
    let loadedIntervals: TimeInterval[] = [];

    chrome.storage.sync.get(null, async function (items) {
      for (let key in items) {
        if (key.startsWith("interval")) {
          loadedIntervals.push(items[key]);
        }
      }

      // Check for whether you USE scheduled blocking windows and IF SO whether you are in one right now
      let inScheduledBlockingWindow = false
      if (loadedIntervals.length === 0) {
        inScheduledBlockingWindow = true;
      }
      inScheduledBlockingWindow = loadedIntervals.reduce((previousValue, currentInterval) => {
        if (isBlockScheduleActive(currentInterval)) {
          return true;
        }
        return previousValue;
      }, false);

      // TODO: I am only defaulting to first blocklist
      if (
        await isUrlBlocked(currentUrl, blockLists[0].urls, blockedKeywords, blockedCategories)
        && inScheduledBlockingWindow
      ) {
        openBlockPage();
      }
    });
});