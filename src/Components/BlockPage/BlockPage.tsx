import * as React from 'react';
import { useState, useEffect } from 'react';
import { getTotalBlockCount } from '../../Helpers/BlockedCounter';
import { Typography, ThemeProvider, Box, CssBaseline } from "@mui/material";
import { createTheme } from '@mui/material/styles';
import { getDesignTokens } from "../../../styles/MuiTheme";

const BlockPage: React.FC = () => {
	const [totalCount, setTotalCount] = useState<number>(0);
	const [isDeterrentEnabled, setIsDeterrentEnabled] = useState(false);
	const [deterrentImage, setDeterrentImage] = useState<string>('');
	const [availableImages, setAvailableImages] = useState<number>(2); // Default to 2 images
	const [mode, setMode] = useState<'light' | 'dark'>('light');

	// Create theme dynamically
	const theme = React.useMemo(() => {
		return createTheme(getDesignTokens(mode));
	}, [mode]);

	useEffect(() => {
		// Load theme preference
		chrome.storage.sync.get(['themeMode'], (data) => {
			if (data.themeMode === 'light' || data.themeMode === 'dark') {
				setMode(data.themeMode);
			} else if (data.themeMode === 'system' || !data.themeMode) {
				// Use system preference
				const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
				setMode(prefersDarkMode ? 'dark' : 'light');
			}
		});

		// Check if blocking is enabled
		chrome.storage.sync.get(['blockingEnabled'], (data) => {
			console.log('BlockPage: blocking is', data.blockingEnabled === false ? 'DISABLED' : 'ENABLED');
		});

		// Fetch the total block count when component mounts
		const fetchTotalCount = async () => {
			try {
				const count = await getTotalBlockCount();
				setTotalCount(count);
			} catch (error) {
				console.error('Error fetching total block count:', error);
			}
		};

		// Load deterrent setting and pick a random image
		chrome.storage.sync.get(['isDeterrentEnabled'], (data) => {
			console.log('Deterrent setting:', data.isDeterrentEnabled);
			setIsDeterrentEnabled(data.isDeterrentEnabled || false);
			if (data.isDeterrentEnabled) {
				const imageNumber = Math.floor(Math.random() * availableImages) + 1;
				const imagePath = `assets/deterrentImages/spiders/${imageNumber}.jpg`;
				console.log('Loading deterrent image:', imagePath);
				setDeterrentImage(imagePath);
			}
		});

		fetchTotalCount();
	}, [availableImages]);

	const hasBackgroundImage = isDeterrentEnabled && deterrentImage;

	const containerStyle = hasBackgroundImage ? {
		backgroundImage: `url(${chrome.runtime.getURL(deterrentImage)})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		backgroundBlendMode: 'overlay'
	} : {};

	const contentStyle = hasBackgroundImage ? {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		padding: '2rem',
		borderRadius: '1rem'
	} : {};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					minHeight: '100vh',
					width: '100%',
					color: hasBackgroundImage ? 'white' : 'text.primary',
					bgcolor: 'background.default',
					...containerStyle
				}}
			>
				<Box
					sx={{
						textAlign: 'center',
						maxWidth: 600,
						margin: '0 auto',
						bgcolor: hasBackgroundImage ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
						borderRadius: hasBackgroundImage ? 2 : 0,
						p: hasBackgroundImage ? 4 : 2,
						boxShadow: hasBackgroundImage ? 3 : 'none',
						...contentStyle
					}}
				>
					<Typography
						variant="h1"
						sx={{
							fontSize: '2.5rem',
							mb: 2,
							color: hasBackgroundImage ? 'white' : 'primary.main'
						}}
					>
						Don't Panic!
					</Typography>
					<Typography
						variant="body1"
						sx={{
							fontSize: '1.2rem',
							mb: 2,
							color: hasBackgroundImage ? 'white' : 'text.primary'
						}}
					>
						ShieldBug has blocked this website.
					</Typography>
					<Box
						component="img"
						src={chrome.runtime.getURL('assets/icon-template.png')}
						alt="Shieldbug"
						sx={{
							width: 200,
							height: 200,
							my: 4
						}}
					/>
					<Typography variant="body1" color={hasBackgroundImage ? 'white' : 'text.primary'}>
						ShieldBug has blocked <Typography component="span" sx={{ fontWeight: 600, display: 'inline' }} variant="body1" color="primary">{totalCount}</Typography> distractions
					</Typography>
					{hasBackgroundImage && (
						<Box >
							<Typography 
								variant="body1"
								sx={{
									mt: 1,
									fontSize: "0.85rem",
									textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
									color: 'rgba(255, 255, 255, 0.8)'
								}}
							>
								You have opted into to see pictures of spiders to deter you from visiting this website (or to overcome your fear of spiders). You can disable this in
								ShieldBug's settings.
							</Typography>
						</Box>
					)}
				</Box>
			</Box>
		</ThemeProvider>
	);
};

export default BlockPage;
