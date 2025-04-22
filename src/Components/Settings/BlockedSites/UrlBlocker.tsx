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
	Typography,
	Box,
	Divider,
	Collapse,
	Badge
} from "@mui/material";
import {Delete, ExpandMore, ExpandLess, AddCircle} from "@mui/icons-material";
import BlockListAdder from "./components/BlockListAdder";

interface UrlBlockerProps {
	blockLists: BlockList[];
	onBlockListsChange: (updatedBlockLists: BlockList[]) => void;
	collapsible?: boolean;
	defaultCollapsed?: boolean;
	showBlockCurrentSite?: boolean;
}

const UrlBlocker: React.FC<UrlBlockerProps> = ({ 
	blockLists, 
	onBlockListsChange, 
	collapsible = false, 
	defaultCollapsed = true,
	showBlockCurrentSite = false
}) => {
	const [canBlockCurrentSite, setCanBlockCurrentSite] = useState<boolean>(false);
	const [currentSite, setCurrentSite] = useState<string>('');
	const [expanded, setExpanded] = useState<Record<string, boolean>>({});

	// Initialize expansion state based on defaultCollapsed prop
	useEffect(() => {
		if (collapsible && blockLists.length > 0) {
			const initialExpanded: Record<string, boolean> = {};
			blockLists.forEach(list => {
				initialExpanded[list.id] = !defaultCollapsed;
			});
			setExpanded(initialExpanded);
		}
	}, [collapsible, defaultCollapsed, blockLists.length]);

	const toggleExpand = (listId: string) => {
		setExpanded(prev => ({
			...prev,
			[listId]: !prev[listId]
		}));
	};

	const isExpanded = (listId: string): boolean => {
		// If not collapsible, always return true (expanded)
		if (!collapsible) return true;
		// If collapsible but no explicit state, use the inverse of defaultCollapsed
		return expanded[listId] !== undefined ? expanded[listId] : !defaultCollapsed;
	};

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

		// Get the domain and remove 'www.' if present
		let domain = new URL(url).hostname;
		if (domain.startsWith('www.')) {
			domain = domain.substring(4); // Remove 'www.'
		}
		
		const updatedBlockLists = blockLists.map((list) => {
			if (list.id === listId && !list.urls.includes(domain)) {
				return { ...list, urls: [...list.urls, domain] };
			}
			return list;
		});

		onBlockListsChange(updatedBlockLists);
		
		// Auto-expand the list when a new URL is added
		if (collapsible) {
			setExpanded(prev => ({
				...prev,
				[listId]: true
			}));
		}
		
		// If we're blocking the current site, navigate to the block page
		if (!inputUrl && canBlockCurrentSite) {
			// Navigate to the block page using the usual method
			chrome.runtime.sendMessage({ action: "openBlockPage" });
			
			// Also increment the counter via Chrome's declarativeNetRequest API
			// by redirecting to the block page with the count parameter
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				const tabId = tabs[0].id;
				if (tabId !== undefined) {
					chrome.tabs.update(tabId, { url: chrome.runtime.getURL("block.html?count=true") });
				}
			});
		}
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
			{(canBlockCurrentSite || showBlockCurrentSite) && (
				<Button
					fullWidth
					variant="contained"
					color="primary"
					sx={{marginBottom: 2}}
					onClick={(event) => blockUrl(event, 'main')}
					disabled={!canBlockCurrentSite}
					startIcon={<AddCircle />}
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

					{/* URL List */}
					{list.urls.length > 0 ? (
						<>
							<Box 
								sx={{ 
									display: 'flex', 
									alignItems: 'center', 
									mb: 1.5,
									cursor: collapsible ? 'pointer' : 'default',
									'&:hover': collapsible ? {
										'& .collapseIcon': {
											color: 'primary.main'
										}
									} : {}
								}}
								onClick={collapsible ? () => toggleExpand(list.id) : undefined}
							>
								<Typography 
									variant="h6" 
									color="secondary.main" 
									sx={{ 
										fontSize: '0.95rem', 
										fontWeight: 600,
										textTransform: 'uppercase',
										letterSpacing: '0.5px',
										display: 'flex',
										alignItems: 'center'
									}}
								>
									Blocked websites
									{collapsible && (
										<Badge 
											badgeContent={list.urls.length} 
											color="primary" 
											sx={{ ml: 2.5, mr: 1 }}
										/>
									)}
								</Typography>
								<Divider sx={{ flexGrow: 1, ml: 2 }} />
								{collapsible && (
									<IconButton 
										size="small" 
										className="collapseIcon"
										sx={{ ml: 1 }}
									>
										{isExpanded(list.id) ? <ExpandLess /> : <ExpandMore />}
									</IconButton>
								)}
							</Box>
							<Collapse in={isExpanded(list.id)}>
								<List sx={{ mt: 1 }}>
									{list.urls.map((url) => (
										<ListItem 
											key={url} 
											sx={{
												py: 1.5, 
												px: 2,
												mb: 1,
												border: '1px solid',
												borderColor: 'divider',
												borderRadius: 1,
												bgcolor: 'background.paper',
												'&:hover': {
													bgcolor: 'action.hover',
													'& .deleteButton': {
														color: 'error.main',
														opacity: 1
													}
												},
												transition: 'all 0.2s ease'
											}}
										>
											<Favicon url={url} size={28} />
											<ListItemText 
												primary={url}
												primaryTypographyProps={{
													sx: { 
														fontWeight: 500, 
														fontSize: '1.05rem',
														color: 'text.primary' 
													}
												}}
											/>
											<ListItemSecondaryAction>
												<IconButton 
													edge="end" 
													aria-label="delete" 
													onClick={() => deleteUrl(list.id, url)}
													className="deleteButton"
													sx={{ 
														opacity: 0.7,
														transition: 'all 0.2s ease'
													}}
												>
													<Delete />
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
									))}
								</List>
							</Collapse>
						</>
					) : (
						<Box 
							sx={{ 
								py: 4, 
								textAlign: 'center',
								color: 'text.secondary',
								bgcolor: 'background.paper',
								border: '1px dashed',
								borderColor: 'divider',
								borderRadius: 1,
								mb: 2
							}}
						>
							<Typography variant="body2">
								No websites blocked yet
							</Typography>
						</Box>
					)}
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