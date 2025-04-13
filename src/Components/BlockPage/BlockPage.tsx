import * as React from 'react';
import { useState, useEffect } from 'react';
import { getTotalBlockCount } from '../../Helpers/BlockedCounter';
import { Typography, ThemeProvider, Box } from "@mui/material";
import theme from "../../../styles/MuiTheme";

const BlockPage: React.FC = () => {
	const [totalCount, setTotalCount] = useState<number>(0);
	const [isDeterrentEnabled, setIsDeterrentEnabled] = useState(false);
	const [deterrentImage, setDeterrentImage] = useState<string>('');
	const [availableImages, setAvailableImages] = useState<number>(2); // Default to 2 images

	useEffect(() => {
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
	} : {
		backgroundColor: theme.palette.background.default
	};

	const contentStyle = hasBackgroundImage ? {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		padding: '2rem',
		borderRadius: '1rem'
	} : {
		padding: '2rem'
	};

	return (
		<ThemeProvider theme={theme}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					minHeight: '100vh',
					width: '100%',
					color: 'white',
					...containerStyle
				}}
			>
				<Box
					sx={{
						textAlign: 'center',
						maxWidth: 600,
						margin: '0 auto',
						...contentStyle
					}}
				>
					<Typography
						variant="h1"
						sx={{
							fontSize: '2.5rem',
							mb: 2
						}}
					>
						Don't Panic!
					</Typography>
					<Typography
						variant="body1"
						color="light"
						sx={{
							fontSize: '1.2rem',
							mb: 2
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
					<Typography variant="body1">
						ShieldBug has blocked <Typography component="span" sx={{ fontWeight: 600, display: 'inline' }} variant="body1" color="primary">{totalCount}</Typography> distractions
					</Typography>
					{hasBackgroundImage && (
						<Box >
							<Typography 
								variant="body1"
								color="text.secondary"
								sx={{
									mt: 1,
									fontSize: "0.85rem",
									textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)"
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
