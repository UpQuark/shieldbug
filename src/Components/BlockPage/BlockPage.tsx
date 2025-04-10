import * as React from 'react';
import { useState, useEffect } from 'react';
import './BlockPage.scss';
import { getTotalBlockCount } from '../../Helpers/BlockedCounter';
import { Typography, ThemeProvider } from "@mui/material";
import theme from "../../../styles/MuiTheme";

const BlockPage: React.FC = () => {
	const [totalCount, setTotalCount] = useState<number>(0);

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

		fetchTotalCount();
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<div className="block-page-container">
				<div className="text-center">
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
