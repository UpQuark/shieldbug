/**
 * Checks if a URL is blocked
 * @param url
 * @param blockedUrls
 * @param blockedKeywords
 */
export const isUrlBlocked = (url: string, blockedUrls: string[], blockedKeywords: string[]): boolean => {
	if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
	const hostname = new URL(url).hostname;
	const mainDomain = hostname.split('.').slice(-2).join('.');

	// Check against blocked URLs
	if (blockedUrls.includes(mainDomain)) {
		return true;
	}

	// Check against blocked keywords
	for (const keyword of blockedKeywords) {
		if (url.includes(keyword)) {
			return true;
		}
	}

	return false;
}