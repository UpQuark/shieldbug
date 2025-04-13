import * as React from 'react';
import {createRoot} from "react-dom/client";
import BlockPage from "./BlockPage";
import '../../../styles/CustomTheme.scss';
import { incrementBlockCount, initBlockedCounters } from '../../Helpers/BlockedCounter';

// Check if we should count this block
const urlParams = new URLSearchParams(window.location.search);
const shouldCount = urlParams.get('count') === 'true';

// Initialize counters and increment if needed
const initAndIncrementCounter = async () => {
  try {
    // Make sure counter is initialized first
    await initBlockedCounters();
    
    if (shouldCount) {
      // Increment the counter
      await incrementBlockCount();
      console.log('Incremented total block count');
      
      // Clear the query parameter to prevent double-counting on refresh
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      console.log('Cleared URL parameters to prevent double-counting');
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
