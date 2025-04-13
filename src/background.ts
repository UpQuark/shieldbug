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

// Clear all existing dynamic rules and set up rules from blocklists
async function setupRedirectRules() {
  console.log("Setting up redirect rules from blocklists...");
  
  try {
    // First get existing rules
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    console.log("Existing rules:", existingRules);
    
    // Get all rule IDs to remove them
    const ruleIdsToRemove = existingRules.map(rule => rule.id);
    console.log("Removing rule IDs:", ruleIdsToRemove);
    
    // Get blocked URLs from storage
    const data = await chrome.storage.sync.get(['blockLists', 'blockedUrls', 'blockedCategories']);
    console.log("Retrieved block data:", data);
    
    const blockLists: BlockList[] = data.blockLists || [];
    const legacyBlockedUrls: string[] = data.blockedUrls || [];
    const blockedCategories: string[] = data.blockedCategories || [];
    
    // Collect all active URLs from block lists
    let allBlockedUrls: string[] = [...legacyBlockedUrls];
    blockLists.forEach(list => {
      if (list.active) {
        allBlockedUrls = [...allBlockedUrls, ...list.urls];
      }
    });
    
    // Add URLs from blocked categories
    for (const category of blockedCategories) {
      try {
        const response = await fetch(chrome.runtime.getURL(`assets/blockLists/${category}.json`));
        const categoryData = await response.json();
        if (categoryData.urls) {
          allBlockedUrls = [...allBlockedUrls, ...categoryData.urls];
        }
      } catch (error) {
        console.error(`Error loading category: ${category}`, error);
      }
    }
    
    // Remove duplicates
    allBlockedUrls = [...new Set(allBlockedUrls)];
    console.log("All blocked URLs:", allBlockedUrls);
    
    // Create rules for each blocked URL
    const newRules = allBlockedUrls.map((url, index) => ({
      id: index + 1, // Rule IDs start from 1
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: {
          url: chrome.runtime.getURL(`block.html?count=true`)
        }
      },
      condition: {
        urlFilter: `*://*.${url}/*`,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME]
      }
    }));
    
    // Clear existing rules and add our new ones
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIdsToRemove,
      addRules: newRules
    });
    
    // Verify rules were updated properly
    const updatedRules = await chrome.declarativeNetRequest.getDynamicRules();
    console.log("Rules after update:", updatedRules);
    
  } catch (error) {
    console.error("Error setting up redirect rules:", error);
  }
}

// Listen for changes to the blocked URLs and update rules
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && 
      (changes.blockLists || changes.blockedUrls || changes.blockedCategories)) {
    console.log("Blocked sites changed, updating rules");
    setupRedirectRules();
  }
});

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