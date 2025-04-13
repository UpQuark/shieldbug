/**
 * BlockedCounter - Helper to track how many times sites have been blocked
 * Simplified to only track total blocks
 */

/**
 * Initialize the counter in storage if it doesn't exist
 */
export const initBlockedCounters = async (): Promise<void> => {
  const data = await chrome.storage.local.get('totalBlocksCount');
  
  if (!data.totalBlocksCount && data.totalBlocksCount !== 0) {
    await chrome.storage.local.set({ totalBlocksCount: 0 });
    console.log('Initialized block counter storage with 0');
  }
};

/**
 * Increment the total block counter
 */
export const incrementBlockCount = async (): Promise<void> => {
  try {
    // Get current counter
    const data = await chrome.storage.local.get('totalBlocksCount');
    const currentCount = data.totalBlocksCount || 0;
    
    // Increment counter
    const newCount = currentCount + 1;
    
    // Save back to storage
    await chrome.storage.local.set({ totalBlocksCount: newCount });
    console.log(`Incremented total block count to ${newCount}`);
  } catch (error) {
    console.error('Error incrementing block count:', error);
  }
};

/**
 * Get the total number of blocks
 * @returns The total number of blocks
 */
export const getTotalBlockCount = async (): Promise<number> => {
  try {
    const data = await chrome.storage.local.get('totalBlocksCount');
    return data.totalBlocksCount || 0;
  } catch (error) {
    console.error('Error getting total block count:', error);
    return 0;
  }
};

/**
 * Reset the counter
 */
export const resetBlockCounter = async (): Promise<void> => {
  try {
    await chrome.storage.local.set({ totalBlocksCount: 0 });
    console.log('Reset block counter to 0');
  } catch (error) {
    console.error('Error resetting block counter:', error);
  }
}; 