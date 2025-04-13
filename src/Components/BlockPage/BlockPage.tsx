import * as React from 'react';
import { useState, useEffect } from 'react';
import './BlockPage.scss';
import { getTotalBlockCount } from '../../Helpers/BlockedCounter';
import { Typography, ThemeProvider } from "@mui/material";
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

	const backgroundStyle = isDeterrentEnabled && deterrentImage ? {
		backgroundImage: `url(${chrome.runtime.getURL(deterrentImage)})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		backgroundBlendMode: 'overlay'
	} : {};

	return (
		<ThemeProvider theme={theme}>
			<div 
				className="block-page-container"
				style={backgroundStyle}
			>
				<div className="text-center" style={{ 
					backgroundColor: isDeterrentEnabled ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
					padding: '2rem',
					borderRadius: '1rem'
				}}>
					<h1>Don't Panic!</h1>
					<p className="text-secondary">ShieldBug has blocked this website.</p>
					<img
						style={{width: 200, height: 200}}
						src={chrome.runtime.getURL('assets/icon-template.png')}
						alt="Shieldbug"
					/>
					<p>
						ShieldBug has blocked <Typography component="span" sx={{fontWeight: 600, display: 'inline'}} variant="body1" color="primary">{totalCount}</Typography> distractions
					</p>
				</div>
			</div>
		</ThemeProvider>
	);
};

export default BlockPage;
