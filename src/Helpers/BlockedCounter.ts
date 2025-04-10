/**
 * BlockedCounter - Helper to track how many times sites have been blocked
 * Used to store and retrieve counters for blocked sites
 */

// Type definition for the counters object
export interface BlockedSiteCounters {
  [domain: string]: number;  // Domain as key, count as value
  totalBlocks: number;       // Total blocks across all sites
}

/**
 * Initialize the counters object in storage if it doesn't exist
 */
export const initBlockedCounters = async (): Promise<void> => {
  const data = await chrome.storage.local.get('blockedCounters');
  
  if (!data.blockedCounters) {
    await chrome.storage.local.set({
      blockedCounters: {
        totalBlocks: 0
      }
    });
    console.log('Initialized blocked counters storage');
  }
};

/**
 * Increment the counter for a specific domain
 * @param domain The domain that was blocked
 */
export const incrementBlockCount = async (domain: string): Promise<void> => {
  try {
    // Normalize the domain (remove www. prefix)
    const normalizedDomain = domain.replace(/^www\./, '');
    
    // Get current counters
    const data = await chrome.storage.local.get('blockedCounters');
    const counters: BlockedSiteCounters = data.blockedCounters || { totalBlocks: 0 };
    
    // Increment counters
    counters[normalizedDomain] = (counters[normalizedDomain] || 0) + 1;
    counters.totalBlocks += 1;
    
    // Save back to storage
    await chrome.storage.local.set({ blockedCounters: counters });
    console.log(`Incremented block count for ${normalizedDomain}`, counters);
  } catch (error) {
    console.error('Error incrementing block count:', error);
  }
};

/**
 * Get the counter for a specific domain
 * @param domain The domain to get count for
 * @returns The number of times the domain has been blocked
 */
export const getBlockCount = async (domain: string): Promise<number> => {
  try {
    // Normalize the domain
    const normalizedDomain = domain.replace(/^www\./, '');
    
    // Get current counters
    const data = await chrome.storage.local.get('blockedCounters');
    const counters: BlockedSiteCounters = data.blockedCounters || { totalBlocks: 0 };
    
    return counters[normalizedDomain] || 0;
  } catch (error) {
    console.error('Error getting block count:', error);
    return 0;
  }
};

/**
 * Get the total number of blocks across all sites
 * @returns The total number of blocks
 */
export const getTotalBlockCount = async (): Promise<number> => {
  try {
    const data = await chrome.storage.local.get('blockedCounters');
    const counters: BlockedSiteCounters = data.blockedCounters || { totalBlocks: 0 };
    
    return counters.totalBlocks;
  } catch (error) {
    console.error('Error getting total block count:', error);
    return 0;
  }
};

/**
 * Get all domain counters
 * @returns Object with all domain counters
 */
export const getAllBlockCounters = async (): Promise<BlockedSiteCounters> => {
  try {
    const data = await chrome.storage.local.get('blockedCounters');
    return data.blockedCounters || { totalBlocks: 0 };
  } catch (error) {
    console.error('Error getting all block counters:', error);
    return { totalBlocks: 0 };
  }
};

/**
 * Reset all counters
 */
export const resetAllBlockCounters = async (): Promise<void> => {
  try {
    await chrome.storage.local.set({
      blockedCounters: {
        totalBlocks: 0
      }
    });
    console.log('Reset all block counters');
  } catch (error) {
    console.error('Error resetting block counters:', error);
  }
}; 