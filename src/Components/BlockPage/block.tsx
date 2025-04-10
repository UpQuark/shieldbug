import * as React from 'react';
import {createRoot} from "react-dom/client";
import BlockPage from "./BlockPage";
import '../../../styles/CustomTheme.scss';
import { incrementBlockCount, initBlockedCounters } from '../../Helpers/BlockedCounter';

// Get the blocked domain from the query string
const urlParams = new URLSearchParams(window.location.search);
const blockedDomain = urlParams.get('blocked') || 'unknown';

console.log('Blocked domain from URL params:', blockedDomain);

// Initialize counters and increment for the blocked domain
const initAndIncrementCounter = async () => {
  try {
    // Make sure counters are initialized first
    await initBlockedCounters();
    
    if (blockedDomain !== 'unknown') {
      await incrementBlockCount(blockedDomain);
      console.log(`Incremented block count for ${blockedDomain}`);
      
      // Clear the query parameter to prevent double-counting on refresh
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      console.log('Cleared URL parameters to prevent double-counting');
    } else {
      console.warn('No blocked domain found in URL parameters');
    }
  } catch (err) {
    console.error('Error handling block count:', err);
  }
};

// Execute the counter initialization and increment
initAndIncrementCounter();

const container = document.getElementById('block-root')
// @ts-ignore
const root = createRoot(container);
root.render(
  <BlockPage />
);
