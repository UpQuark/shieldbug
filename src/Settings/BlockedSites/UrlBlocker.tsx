import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
	Button,
	Container,
	Form,
	InputGroup,
	ListGroup,
	Row,
	Col
} from 'react-bootstrap';
import {useEffect, useState} from "react";
import Favicon from "./Favicon";
import FeatureFlags from "../../FeatureFlags";
import {BlockList} from "./BlockedSitesTypes";
import BlockListEditableName from "./components/BlockListEditableName";
import BlockListMainRadio from "./components/BlockListMainRadio";
import BlockListDeleteButton from "./components/BlockListDeleteButton";

const UrlBlocker: React.FC = () => {
	const [blockLists, setBlockLists] = useState<BlockList[]>([
		{ id: 'main', name: 'Main', urls: [], active: true },
	]);
	const [urlInput, setUrlInput] = useState<string>('');
	const [canBlockCurrentSite, setCanBlockCurrentSite] = useState<boolean>(false);
	const [currentSite, setCurrentSite] = useState<string>('');

	const updateBlockLists = (updatedBlockLists: any[]) => {
		chrome.storage.local.set({ blockLists: updatedBlockLists }, () => {
			setBlockLists(updatedBlockLists);
		});
	};

	const deleteUrl = (listId: string, urlToDelete: string) => {
		const updatedBlockLists = blockLists.map((list) => {
			if (list.id === listId) {
				return { ...list, urls: list.urls.filter((url: string) => url !== urlToDelete) };
			}
			return list;
		});
		updateBlockLists(updatedBlockLists);
	};

	/**
	 * Block the supplied URL (defaults to current page), and add it to a given blocklist
	 * @param event
	 * @param listId
	 * @param inputUrl
	 */
	const blockUrl = (event: React.FormEvent, listId: string = 'main', inputUrl?: string) => {
		event.preventDefault();

		let url: string = inputUrl ? inputUrl : currentSite;
		if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
		const mainDomain = new URL(url).hostname.split('.').slice(-2).join('.');
		const updatedBlockLists = blockLists.map((list) => {
			if (list.id === listId && !list.urls.includes(mainDomain)) {
				return { ...list, urls: [...list.urls, mainDomain] };
			}
			return list;
		});

		updateBlockLists(updatedBlockLists);
		if (inputUrl) setUrlInput('');
	};

	const addNewBlockList = () => {
		const newListId = `list-${new Date().getTime()}`;
		const updatedBlockLists = [
			...blockLists,
			{ id: newListId, name: `List ${blockLists.length + 1}`, urls: [], active: false },
		];
		setBlockLists(updatedBlockLists);
	};

	/**
	 * Figure out the current URL on page load to determine if the user can block the current site
	 * invalid URLs include chrome://, file://, etc.
	 */
	useEffect(() => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const currentTab = tabs[0];
			const pageUrl = currentTab.url;
			if (pageUrl?.startsWith('http')) {
				setCanBlockCurrentSite(true);
				setCurrentSite(pageUrl);
			}
			console.log('Current page URL:', pageUrl);
		});
	}, []);

	/**
	 * Load block lists from storage on page load
	 */
	useEffect(() => {
		chrome.storage.local.get('blockLists', (data: { blockLists?: any[] }) => {
			setBlockLists(data.blockLists || [{ id: 'main', name: 'Main', urls: [], active: true }]);
		});
	}, []);

	return (
		<Container style={{ paddingLeft: 0 }}>
			{canBlockCurrentSite && (
				<Button className={'text-white w-100 my-2'} onClick={(event) => blockUrl(event, 'main')}>
					Block current site
				</Button>
			)}
			{blockLists.map((list, index) => (
				<div key={list.id} className="mb-5">
					<Row className="mb-2">

						{FeatureFlags.BLockSites_MultipleLists && (
							<Col>
								<BlockListEditableName blockLists={blockLists} setBlockLists={setBlockLists} list={list} index={index}/>
							</Col>
						)}

						{FeatureFlags.BLockSites_MultipleLists && (
							<Col xs="auto">
								<BlockListMainRadio list={list} blockLists={blockLists} updateBlockLists={updateBlockLists}/>
							</Col>
						)}

					</Row>

					<Form onSubmit={(event) => blockUrl(event, list.id, urlInput)} className="mb-3">
						<InputGroup>
							<Form.Control
								type="text"
								value={urlInput}
								onChange={(e) => setUrlInput(e.target.value)}
								placeholder="Enter URL to block"
							/>
							<Button type="submit" variant="primary" className={'text-white'}>
								Block website
							</Button>

							{/* Delete button*/}
							<Col xs="auto">
								{list.id !== 'main' && (
									<BlockListDeleteButton list={list} blockLists={blockLists} updateBlockLists={updateBlockLists}/>
								)}
							</Col>
						</InputGroup>
					</Form>

					{/* URL List */}
					<ListGroup>
						{list.urls.map((url) => (
							<ListGroup.Item key={url} className="d-flex justify-content-between align-items-center">
								<Favicon url={url}/>
								{url}
								<Button onClick={() => deleteUrl(list.id, url)} variant="outline-danger" size="sm">
									Delete
								</Button>
							</ListGroup.Item>
						))}
					</ListGroup>
				</div>
			))}
			{FeatureFlags.BLockSites_MultipleLists && (
				<Button className="w-100 my-2 text-white" onClick={addNewBlockList}>
					Add New Block List
				</Button>
			)}

		</Container>
	);
};

export default UrlBlocker;