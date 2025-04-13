import * as React from 'react';
import {useEffect, useState} from "react";
import Favicon from "./Favicon";
import DeveloperFeatureFlags from "../../../Flags/DeveloperFeatureFlags";
import {BlockList} from "./BlockedSitesTypes";
import BlockListEditableName from "./components/BlockListEditableName";
import BlockListMainRadio from "./components/BlockListMainRadio";
import BlockListDeleteButton from "./components/BlockListDeleteButton";
import {
	FormGroup,
	Button,
	ListItem,
	ListItemSecondaryAction,
	IconButton,
	ListItemText,
	List,
} from "@mui/material";
import {Delete} from "@mui/icons-material";
import BlockListAdder from "./components/BlockListAdder";

interface UrlBlockerProps {
	blockLists: BlockList[];
	onBlockListsChange: (updatedBlockLists: BlockList[]) => void;
}

const UrlBlocker: React.FC<UrlBlockerProps> = ({ blockLists, onBlockListsChange }) => {
	const [canBlockCurrentSite, setCanBlockCurrentSite] = useState<boolean>(false);
	const [currentSite, setCurrentSite] = useState<string>('');

	const deleteUrl = (listId: string, urlToDelete: string) => {
		const updatedBlockLists = blockLists.map((list) => {
			if (list.id === listId) {
				return { ...list, urls: list.urls.filter((url: string) => url !== urlToDelete) };
			}
			return list;
		});
		onBlockListsChange(updatedBlockLists);
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
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			url = 'https://' + url;
		}

		const domain = new URL(url).hostname;
		const updatedBlockLists = blockLists.map((list) => {
			if (list.id === listId && !list.urls.includes(domain)) {
				return { ...list, urls: [...list.urls, domain] };
			}
			return list;
		});

		onBlockListsChange(updatedBlockLists);
	};

	const addNewBlockList = () => {
		const newListId = `list-${new Date().getTime()}`;
		const updatedBlockLists = [
			...blockLists,
			{ id: newListId, name: `List ${blockLists.length + 1}`, urls: [], active: false },
		];
		onBlockListsChange(updatedBlockLists);
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

	return (
		<>
			{canBlockCurrentSite && (
				<Button
					fullWidth
					variant="contained"
					color="primary"
					sx={{marginBottom: 2}}
					onClick={(event) => blockUrl(event, 'main')}
				>
					Block current site
				</Button>
			)}
			{blockLists.map((list, index) => (
				<div key={list.id} style={{ marginBottom: '1rem' }}>
					<FormGroup row>
						{DeveloperFeatureFlags.BLockSites_MultipleLists && (
							<BlockListEditableName 
								blockLists={blockLists} 
								onBlockListsChange={onBlockListsChange} 
								list={list} 
								index={index} 
							/>
						)}

						{DeveloperFeatureFlags.BLockSites_MultipleLists && (
							<BlockListMainRadio list={list} blockLists={blockLists} updateBlockLists={onBlockListsChange} />
						)}
					</FormGroup>

					<BlockListAdder list={list} blockUrl={blockUrl}/>

					{/* Delete button */}
					{/*{list.id !== 'main' && (*/}
					{/*	<BlockListDeleteButton*/}
					{/*		list={list}*/}
					{/*		blockLists={blockLists}*/}
					{/*		updateBlockLists={updateBlockLists}*/}
					{/*	/>*/}
					{/*)}*/}

					{/* URL List */}
					<List>
						{list.urls.map((url) => (
							<ListItem key={url} dense>
								<Favicon url={url} />
								<ListItemText primary={url} />
								<ListItemSecondaryAction>
									<IconButton edge="end" aria-label="delete" onClick={() => deleteUrl(list.id, url)}>
										<Delete />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						))}
					</List>
				</div>
			))}
			{DeveloperFeatureFlags.BLockSites_MultipleLists && (
				<Button fullWidth variant="contained" color="primary" onClick={addNewBlockList}>
					Add New Block List
				</Button>
			)}
		</>
	);
};

export default UrlBlocker;