import * as React from 'react';
import UrlBlocker from "./UrlBlocker";
import CategoryBlocker from "../BlockedCategories/CategoryBlocker";
import DeveloperFeatureFlags from "../../../Flags/DeveloperFeatureFlags";
import { 
	Paper, 
	Typography, 
	Box, 
	Button, 
	Dialog, 
	DialogTitle, 
	DialogContent, 
	DialogActions,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Snackbar,
	Alert,
	ListItemIcon,
	Divider,
	Card,
	CardContent,
	CardActions,
	Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import Favicon from "./Favicon";

interface PopularSite {
	name: string;
	url: string;
	category: string;
}

const BlockedItemsDialog: React.FC = () => {
	const [open, setOpen] = React.useState(false);
	const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
	const [blockLists, setBlockLists] = React.useState<any[]>([]);
	const [blockedCategories, setBlockedCategories] = React.useState<string[]>([]);
	const [popularSites, setPopularSites] = React.useState<PopularSite[]>([]);

	React.useEffect(() => {
		// Load block lists from storage
		chrome.storage.sync.get(['blockLists', 'blockedCategories'], (data) => {
			setBlockLists(data.blockLists || [{ id: 'main', name: 'Main', urls: [], active: true }]);
			setBlockedCategories(data.blockedCategories || []);
		});

		// Load popular sites from JSON file
		fetch('/assets/blocklists.json')
			.then(response => response.json())
			.then(data => setPopularSites(data.popularSites))
			.catch(error => console.error('Error loading blocklists:', error));
	}, []);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const showSnackbar = (message: string, severity: 'success' | 'error') => {
		setSnackbar({ open: true, message, severity });
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	const updateBlockLists = (updatedBlockLists: any[]) => {
		chrome.storage.sync.set({ blockLists: updatedBlockLists }, () => {
			setBlockLists(updatedBlockLists);
			// Notify the root page to update its blocked sites list
			chrome.runtime.sendMessage({ type: 'UPDATE_BLOCKED_SITES', blockLists: updatedBlockLists });
		});
	};

	const handleCategoryToggle = (category: string, checked: boolean) => {
		let updatedBlockedCategories: string[];

		if (checked) {
			updatedBlockedCategories = [...blockedCategories, category];
		} else {
			updatedBlockedCategories = blockedCategories.filter((c) => c !== category);
		}

		chrome.storage.sync.set({ blockedCategories: updatedBlockedCategories }, () => {
			setBlockedCategories(updatedBlockedCategories);
			showSnackbar(
				checked ? `${category} category blocked` : `${category} category unblocked`,
				'success'
			);
		});
	};

	const handleAddSite = (url: string) => {
		const mainList = blockLists.find(list => list.id === 'main');
		if (!mainList) return;

		if (!mainList.urls.includes(url)) {
			const updatedBlockLists = blockLists.map(list => {
				if (list.id === 'main') {
					return { ...list, urls: [...list.urls, url] };
				}
				return list;
			});
			updateBlockLists(updatedBlockLists);
			showSnackbar(`${url} added to block list`, 'success');
		} else {
			showSnackbar(`${url} is already blocked`, 'error');
		}
	};

	const getMainBlockList = () => {
		return blockLists.find(list => list.id === 'main') || { urls: [] };
	};

	const unblockedSites = popularSites.filter(site => !getMainBlockList().urls.includes(site.url));

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Blocked Items
			</Typography>
			<Typography variant="body1" paragraph>
				You can block individual sites using ShieldBug. Just enter the URL of the site you want to block below.
			</Typography>

			{DeveloperFeatureFlags.BLockSites_MultipleLists && (
				<Typography variant="body1" paragraph>
					You can create more than one list of sites to block. One will always be your "main" list which is always
					active. Other block lists can be attached to schedules so that they are only active at certain times.
				</Typography>
			)}

			<Box sx={{ mb: 3 }}>
				<Button 
					variant="contained" 
					color="primary" 
					onClick={handleClickOpen}
					sx={{ mb: 2 }}
				>
					Block Something
				</Button>
			</Box>

			<Grid container spacing={3}>
				<Grid item xs={12}>
					<CategoryBlocker 
						blockedCategories={blockedCategories}
						onCategoryToggle={handleCategoryToggle}
						title="Blocked Categories"
					/>
				</Grid>
				<Grid item xs={12}>
					<Paper elevation={3} sx={{ p: 3 }}>
						<Typography variant="h5">
							Blocked Sites
						</Typography>
						<UrlBlocker 
							blockLists={blockLists}
							onBlockListsChange={updateBlockLists}
						/>
					</Paper>
				</Grid>
			</Grid>

			<Dialog 
				open={open} 
				onClose={handleClose}
				maxWidth="lg"
				fullWidth
			>
				<DialogTitle variant={"h1"} sx={{fontSize:"2.125rem"}}>Block a New Distraction</DialogTitle>
				<DialogContent>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Paper elevation={2} sx={{ p: 2 }}>
								<Typography variant="h6" gutterBottom>
									Block popular sites
								</Typography>
								<Grid container spacing={2}>
									{unblockedSites.map((site) => (
										<Grid item xs={12} sm={6} md={4} key={site.url}>
											<Card>
												<CardContent>
													<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
														<Box sx={{ display: 'flex', alignItems: 'center' }}>
															<Favicon url={site.url} />
															<Typography variant="h6" sx={{ ml: 1 }}>
																{site.name}
															</Typography>
														</Box>
														<IconButton 
															size="small" 
															onClick={() => handleAddSite(site.url)}
															color="primary"
														>
															<AddIcon />
														</IconButton>
													</Box>
													<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
														{site.url}
													</Typography>
													<Chip 
														label={site.category} 
														size="small" 
														color="primary" 
														variant="outlined"
													/>
												</CardContent>
											</Card>
										</Grid>
									))}
								</Grid>
							</Paper>
						</Grid>
						<Grid item xs={12}>
							<Divider sx={{ my: 1 }} />
						</Grid>
						<Grid item xs={12}>
							<Paper elevation={2} sx={{ p: 2 }}>
								<Typography variant="h6" gutterBottom>
									Block Categories
								</Typography>
								<CategoryBlocker 
									blockedCategories={blockedCategories}
									onCategoryToggle={handleCategoryToggle}
									showPaper={false}
									showTitle={false}
								/>
							</Paper>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleClose} variant="contained" color="primary">
						Done
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar 
				open={snackbar.open} 
				autoHideDuration={3000} 
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert 
					onClose={handleCloseSnackbar} 
					severity={snackbar.severity}
					sx={{ width: '100%' }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default BlockedItemsDialog; 