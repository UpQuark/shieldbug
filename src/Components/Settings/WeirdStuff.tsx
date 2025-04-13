import * as React from 'react';
import { Switch, FormControlLabel, Card, CardContent, Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';

const WeirdStuff: React.FC = () => {
	const [isDeterrentEnabled, setIsDeterrentEnabled] = useState(false);

	useEffect(() => {
		// Load setting from storage
		chrome.storage.sync.get(['isDeterrentEnabled'], (data) => {
			setIsDeterrentEnabled(data.isDeterrentEnabled || false);
		});
	}, []);

	const handleDeterrentToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.checked;
		setIsDeterrentEnabled(newValue);
		chrome.storage.sync.set({ isDeterrentEnabled: newValue });
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Weird Stuff
			</Typography>
			<Typography variant="body1" paragraph>
				Do you want to help break your habit of compulsive browsing? Replace your block page with random deterrent images.
				This will help you associate blocked sites with unpleasant experiences, making it easier to avoid them.
			</Typography>

			<Card sx={{ mb: 3 }}>
				<CardContent>
					<FormControlLabel
						control={
							<Switch
								checked={isDeterrentEnabled}
								onChange={handleDeterrentToggle}
							/>
						}
						label="Enable deterrent images on block page"
					/>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
						When enabled, blocked pages will show a random image from our deterrent collection instead of the default block page.
					</Typography>
				</CardContent>
			</Card>
		</Box>
	);
};

export default WeirdStuff;
