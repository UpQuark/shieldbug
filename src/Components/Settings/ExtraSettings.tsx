import * as React from 'react';
import { Switch, FormControlLabel, Card, CardContent, Typography, Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { ThemeContext } from './SettingsApp';

type ThemeMode = 'light' | 'dark' | 'system';

const ExtraSettings: React.FC = () => {
	const [isDeterrentEnabled, setIsDeterrentEnabled] = useState(false);
	const { currentTheme, setThemeMode } = useContext(ThemeContext);

	useEffect(() => {
		// Load settings from storage
		chrome.storage.sync.get(['isDeterrentEnabled'], (data) => {
			setIsDeterrentEnabled(data.isDeterrentEnabled || false);
		});
	}, []);

	const handleDeterrentToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.checked;
		setIsDeterrentEnabled(newValue);
		chrome.storage.sync.set({ isDeterrentEnabled: newValue });
	};

	const handleThemeChange = (event: SelectChangeEvent) => {
		const newThemeMode = event.target.value as ThemeMode;
		
		// Use the context function to update the theme
		setThemeMode(newThemeMode);
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Extra Settings
			</Typography>
			
			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom>Theme Settings</Typography>
					<FormControl fullWidth sx={{ mb: 2 }}>
						<InputLabel id="theme-mode-label">Theme Mode</InputLabel>
						<Select
							labelId="theme-mode-label"
							id="theme-mode-select"
							value={currentTheme}
							label="Theme Mode"
							onChange={handleThemeChange}
						>
							<MenuItem value="system">System Default</MenuItem>
							<MenuItem value="light">Light</MenuItem>
							<MenuItem value="dark">Dark</MenuItem>
						</Select>
					</FormControl>
				</CardContent>
			</Card>

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

export default ExtraSettings;
