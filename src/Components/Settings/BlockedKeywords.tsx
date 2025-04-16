import * as React from 'react';
import KeywordBlocker from "./KeywordBlocker";
import { Box, Typography, Paper } from '@mui/material';

const BlockedKeywords: React.FC = () => {
	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Blocked Keywords
			</Typography>
			<Typography variant="body1" paragraph>
				Block URLs by keyword to prevent access to sites containing specific terms.
			</Typography>
			
			<Paper elevation={3} sx={{ p: 3 }}>
				<Typography variant="h5" gutterBottom>
					Keyword Settings
				</Typography>
				<KeywordBlocker />
			</Paper>
		</Box>
	);
};

export default BlockedKeywords;
