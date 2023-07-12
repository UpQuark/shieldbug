/**
 * Checks if a URL is blocked
 * @param url
 * @param blockedUrls
 * @param blockedKeywords
 * @param blockedCategories
 */
export const isUrlBlocked = async (
	url: string,
	blockedUrls: string[],
	blockedKeywords: string[],
	blockedCategories: string[]
): Promise<boolean> => {
	if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
	const hostname = new URL(url).hostname;
	const mainDomain = hostname.split('.').slice(-2).join('.');

	// Check against blocked URLs
	if (blockedUrls?.includes(mainDomain)) {
		return true;
	}

	// Check against blocked keywords
	for (const keyword of blockedKeywords) {
		if (url.includes(keyword)) {
			return true;
		}
	}

	// Check against blocked categories
	for (const category of blockedCategories) {
		try {
			const response = await fetch(chrome.runtime.getURL(`assets/blockLists/${category}.json`));
			const data = await response.json();

			// Check against URLs in the category
			if (data.urls && data.urls.includes(mainDomain)) {
				return true;
			}

			// Check against keywords in the category
			if (data.keywords) {
				for (const keyword of data.keywords) {
					if (url.includes(keyword)) {
						return true;
					}
				}
			}
		} catch (error) {
			console.error(`Error loading category: ${category}`, error);
		}
	}

	return false;
};
