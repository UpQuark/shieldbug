/// <reference types="chrome"/>

import {BlockList} from "./Settings/BlockedSites/BlockedSitesTypes";
import {TimeInterval} from "./Settings/Scheduler/SchedulerTypes";
import {isBlockScheduleActive} from "./Settings/Scheduler/TimeHelper";
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

// Function to add a new redirect rule dynamically
function addRedirectRule(rule: chrome.declarativeNetRequest.Rule) {
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [rule],
    removeRuleIds: []
  }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error adding rule:", chrome.runtime.lastError);
    } else {
      console.log("Rule added successfully.");
    }
  });
  console.log("Adding redirect rule")
}

// Function to remove a rule by its ID
// function removeRule(ruleId: number) {
//   chrome.declarativeNetRequest.updateDynamicRules({
//     addRules: [],
//     removeRuleIds: [ruleId]
//   }, () => {
//     if (chrome.runtime.lastError) {
//       console.error("Error removing rule:", chrome.runtime.lastError);
//     } else {
//       console.log("Rule removed successfully.");
//     }
//   });
// }

// Example usage: Add a new redirect rule
const newRule: chrome.declarativeNetRequest.Rule = {
  id: Math.floor(Math.random() * 10000000),
  priority: 1,
  action: {
    type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
    redirect: {
      url: "https://google.com"
    }
  },
  condition: {
    urlFilter: "*://*/*",
    resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME]
  }
};

// Add the rule when the service worker starts
chrome.runtime.onStartup.addListener(() => {
  addRedirectRule(newRule);
});

chrome.runtime.onInstalled.addListener(() => {
  addRedirectRule(newRule);
});

// // Listen for messages to dynamically add or remove rules
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'addRule') {
//     addRedirectRule(message.rule);
//   } else if (message.action === 'removeRule') {
//     removeRule(message.ruleId);
//   }
//   sendResponse({ status: 'done' });
// });