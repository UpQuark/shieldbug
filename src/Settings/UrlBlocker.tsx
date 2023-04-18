import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useState} from 'react';
import {Button, Container, Form, InputGroup, ListGroup} from 'react-bootstrap';

/**
 * A component that allows the user to block URLs as a list, persisted in chrome storage
 * @constructor
 */
const UrlBlocker: React.FC = () => {
	const [blockedUrls, setBlockedUrls] = useState<string[]>([]);
	const [urlInput, setUrlInput] = useState<string>('');
	const [canBlockCurrentSite, setCanBlockCurrentSite] = useState<boolean>(false);
	const [currentSite, setCurrentSite] = useState<string>('');

	/**
	 * Get the blocked URLs out of chrome storage and load 'em up into state
	 */
	useEffect(() => {
		chrome.storage.local.get('blockedUrls', (data: { blockedUrls?: string[] }) => {
			setBlockedUrls(data.blockedUrls || []);
		});
	}, []);

	const getFaviconUrl = (url: string) => {
		try {
			const { protocol, hostname } = new URL(`https://${url}`);
			return `${protocol}//${hostname}/favicon.ico`;
		} catch (error) {
			console.error('Error getting favicon URL:', error);
			return '';
		}
	};

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

	const handleBlockCurrentPage = (event: React.FormEvent) => {
		const url = currentSite;
		const mainDomain = new URL(url).hostname.split('.').slice(-2).join('.');
		const newBlockedUrls = [...blockedUrls, mainDomain];

		if (!blockedUrls.includes(mainDomain)) {
			chrome.storage.local.set({blockedUrls: newBlockedUrls}, () => {
				updateBlockedUrlsList(newBlockedUrls);
				void chrome.runtime.sendMessage({ action: "openBlockPage" });
			});
		}
	}

	useEffect(() => {
		chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
			const currentTab = tabs[0];
			const pageUrl = currentTab.url;
			if (pageUrl?.startsWith('http')) {
				setCanBlockCurrentSite(true)
				setCurrentSite(pageUrl)
			}
			console.log('Current page URL:', pageUrl);
		});
	}, []);


	return (
		<Container fluid>
			{canBlockCurrentSite &&
        <Button
          className={"text-white w-100 my-2"}
          onClick={handleBlockCurrentPage}
        >
          Block current site</Button>
			}

			<Form onSubmit={handleSubmit} className="mb-3">
				<InputGroup>
					<Form.Control
						type="text"
						value={urlInput}
						onChange={(e) => setUrlInput(e.target.value)}
						placeholder="Enter URL to block"
					/>
					<Button type="submit" variant="primary" className={"text-white"}>
						Add URL
					</Button>
				</InputGroup>
			</Form>
			<ListGroup>
				{blockedUrls.map((url) => (
					<ListGroup.Item key={url} className="d-flex justify-content-between align-items-center">
						<img
							src={getFaviconUrl(url)}
							alt={`Favicon for ${url}`}
							width="16"
							height="16"
							className="me-2"
						/>
						{url}
						<Button onClick={() => deleteUrl(url)} variant="outline-danger" size="sm">
							Delete
						</Button>
					</ListGroup.Item>
				))}
			</ListGroup>
		</Container>
	);
};

export default UrlBlocker;
