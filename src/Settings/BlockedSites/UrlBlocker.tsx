import * as React from 'react';
import {useEffect, useState} from "react";
import Favicon from "./Favicon";
import FeatureFlags from "../../FeatureFlags";
import {BlockList} from "./BlockedSitesTypes";
import BlockListEditableName from "./components/BlockListEditableName";
import BlockListMainRadio from "./components/BlockListMainRadio";
import BlockListDeleteButton from "./components/BlockListDeleteButton";
import {
	Container,
	FormGroup,
	Button,
	FormControl,
	TextField,
	ListItem,
	ListItemSecondaryAction,
	IconButton, ListItemText, List, Grid
} from "@mui/material";
import {MdDelete} from "react-icons/all";
import BlockListAdder from "./components/BlockListAdder";

const UrlBlocker: React.FC = () => {
	const [blockLists, setBlockLists] = useState<BlockList[]>([
		{ id: 'main', name: 'Main', urls: [], active: true },
	]);
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
		<>
			{canBlockCurrentSite && (
				<Button
					fullWidth
					variant="contained"
					color="primary"
					className={'mb-3'}
					onClick={(event) => blockUrl(event, 'main')}
				>
					Block current site
				</Button>
			)}
			{blockLists.map((list, index) => (
				<div key={list.id} style={{ marginBottom: '1rem' }}>
					<FormGroup row>
						{FeatureFlags.BLockSites_MultipleLists && (
							<BlockListEditableName blockLists={blockLists} setBlockLists={setBlockLists} list={list} index={index} />
						)}

						{FeatureFlags.BLockSites_MultipleLists && (
							<BlockListMainRadio list={list} blockLists={blockLists} updateBlockLists={updateBlockLists} />
						)}
					</FormGroup>

					<BlockListAdder list={list} blockUrl={blockUrl}/>

					{/* Delete button */}
					{list.id !== 'main' && (
						<BlockListDeleteButton
							list={list}
							blockLists={blockLists}
							updateBlockLists={updateBlockLists}
						/>
					)}

					{/* URL List */}
					<List>
						{list.urls.map((url) => (
							<ListItem key={url} dense button>
								<Favicon url={url} />
								<ListItemText primary={url} />
								<ListItemSecondaryAction>
									<IconButton edge="end" aria-label="delete" onClick={() => deleteUrl(list.id, url)}>
										<MdDelete />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						))}
					</List>
				</div>
			))}
			{FeatureFlags.BLockSites_MultipleLists && (
				<Button fullWidth variant="contained" color="primary" onClick={addNewBlockList}>
					Add New Block List
				</Button>
			)}
		</>
	);
};

export default UrlBlocker;