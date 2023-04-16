import React, { useState, useEffect } from 'react';

const UrlBlocker: React.FC = () => {
	const [blockedUrls, setBlockedUrls] = useState<string[]>([]);
	const [urlInput, setUrlInput] = useState<string>('');

	useEffect(() => {
		chrome.storage.local.get('blockedUrls', (data: { blockedUrls?: string[] }) => {
			setBlockedUrls(data.blockedUrls || []);
		});
	}, []);

	const updateBlockedUrlsList = (updatedBlockedUrls: string[]) => {
		setBlockedUrls(updatedBlockedUrls);
	};

	const deleteUrl = (urlToDelete: string) => {
		const updatedBlockedUrls = blockedUrls.filter((url) => url !== urlToDelete);
		chrome.storage.local.set({ blockedUrls: updatedBlockedUrls }, () => {
			updateBlockedUrlsList(updatedBlockedUrls);
		});
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		let url = urlInput;
		if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
		const mainDomain = new URL(url).hostname.split('.').slice(-2).join('.');
		const newBlockedUrls = [...blockedUrls, mainDomain];

		if (!blockedUrls.includes(mainDomain)) {
			chrome.storage.local.set({ blockedUrls: newBlockedUrls }, () => {
				updateBlockedUrlsList(newBlockedUrls);
			});
		}
		setUrlInput('');
	};

	const openSettingsPage = () => {
		chrome.runtime.openOptionsPage();
	};

	return (
		<div>
			<form onSubmit={handleSubmit} id="urlForm">
				<input
					type="text"
					id="urlInput"
					value={urlInput}
					onChange={(e) => setUrlInput(e.target.value)}
					placeholder="Enter URL to block"
				/>
				<button type="submit">Add URL</button>
			</form>
			<ul id="blockedUrlsList">
				{blockedUrls.map((url) => (
					<li key={url}>
						{url}
						<button onClick={() => deleteUrl(url)}>Delete</button>
					</li>
				))}
			</ul>
			<button onClick={openSettingsPage}>Open Settings</button>
		</div>
	);
};

export default UrlBlocker;
