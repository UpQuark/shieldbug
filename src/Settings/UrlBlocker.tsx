import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useState} from 'react';

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
		chrome.storage.local.set({blockedUrls: updatedBlockedUrls}, () => {
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
			chrome.storage.local.set({blockedUrls: newBlockedUrls}, () => {
				updateBlockedUrlsList(newBlockedUrls);
			});
		}
		setUrlInput('');
	};

	const openSettingsPage = () => {
		chrome.runtime.openOptionsPage();
	};

	return (
		<div className="container-fluid">
			<form onSubmit={handleSubmit} id="urlForm" className="mb-3">
				<div className="input-group">
					<input
						type="text"
						id="urlInput"
						value={urlInput}
						onChange={(e) => setUrlInput(e.target.value)}
						placeholder="Enter URL to block"
						className="form-control"
					/>
					<button type="submit" className="btn btn-primary">
						Add URL
					</button>
				</div>
			</form>
			<ul id="blockedUrlsList" className="list-group">
				{blockedUrls.map((url) => (
					<li key={url} className="list-group-item d-flex justify-content-between align-items-center">
						{url}
						<button onClick={() => deleteUrl(url)} className="btn btn-outline-danger btn-sm">
							Delete
						</button>
					</li>
				))}
			</ul>
			<button onClick={openSettingsPage} className="btn btn-secondary mt-3">
				Open Settings
			</button>
		</div>
	);
};

export default UrlBlocker;
