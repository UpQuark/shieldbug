/// <reference types="chrome"/>

import {BlockList} from "./Components/Settings/BlockedSites/BlockedSitesTypes";
import {TimeInterval} from "./Components/Settings/Scheduler/SchedulerTypes";
import {isBlockScheduleActive} from "./Components/Settings/Scheduler/TimeHelper";
import {isUrlBlocked} from "./Helpers/UrlBlockChecker";

function openBlockPage() {
  void chrome.runtime.sendMessage({action: "openBlockPage"});
}

self.addEventListener('install', () => {
  chrome.storage.sync.set({
    blockedUrls: []
  });
});

console.log("Loaded ShieldBug Background Script");


/**
 * When a message with action "openBlockPage" is received, updates the currently
 * active tab's URL to block.html file provided by the extension. This displays
 * the block page in the current tab and prevents the user from going back to the previous page.
 */
chrome.runtime.onMessage.addListener(
  (request: { action: string }, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    if (request.action === "openBlockPage") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        const tabId = tabs[0].id;
        if (tabId !== undefined) {
          chrome.tabs.update(tabId, { url: chrome.runtime.getURL("block.html") });
        }
      });
    }
  }
);

// Open options page on install
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === "install") {
    // This code runs when the extension is first installed
    chrome.runtime.openOptionsPage();
  }
});

// Define a constant rule ID to make it easier to manage
const NY_TIMES_RULE_ID = 1001;

// Clear all existing dynamic rules and set up our rules
async function setupRedirectRules() {
  console.log("Setting up redirect rules...");
  
  try {
    // First get existing rules
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    console.log("Existing rules:", existingRules);
    
    // Get all rule IDs to remove them
    const ruleIdsToRemove = existingRules.map(rule => rule.id);
    console.log("Removing rule IDs:", ruleIdsToRemove);
    
    // Define our new rule for NYTimes
    const nyTimesRule = {
      id: NY_TIMES_RULE_ID,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: {
          url: chrome.runtime.getURL("block.html")
        }
      },
      condition: {
        urlFilter: "*://*.nytimes.com/*",
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME]
      }
    };
    
    // Clear existing rules and add our new one
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIdsToRemove,
      addRules: [nyTimesRule]
    });
    
    // Verify rules were updated properly
    const updatedRules = await chrome.declarativeNetRequest.getDynamicRules();
    console.log("Rules after update:", updatedRules);
    
  } catch (error) {
    console.error("Error setting up redirect rules:", error);
  }
}

// Set up rules when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed/updated - setting up redirect rules");
  setupRedirectRules();
});

// Set up rules when the service worker starts
chrome.runtime.onStartup.addListener(() => {
  console.log("Service worker starting up - setting up redirect rules");
  setupRedirectRules();
});