import * as React from 'react';
import {
	Switch,
	FormControlLabel,
	FormGroup,
	Box,
	Typography,
	TextField,
	Card,
	CardContent,
	FormLabel,
	Paper
} from '@mui/material';
import { useEffect } from "react";

/**
 * Settings for "commitment" features like 'deep breaths' (timed lockout), password protection, and daily view limits
 */
const Commitment: React.FC = () => {
	const [deepBreathEnabled, setDeepBreathEnabled] = React.useState(false);
	const [passwordProtectionEnabled, setPasswordProtection] = React.useState(false);
	const [dailyLimitsEnabled, setDailyLimitsEnabled] = React.useState(false);
	const [deepBreathLength, setDeepBreathLength] = React.useState<number>();

	/**
	 * Load settings from storage
	 */
	useEffect(() => {
		chrome.storage.sync.get(['features/deepBreath/enabled', 'features/deepBreath/length', 'features/passwordProtection/enabled', 'features/dailyLimits/enabled'], (data) => {
			setDeepBreathEnabled(data["features/deepBreath/enabled"] || false);
			setDeepBreathLength(data["features/deepBreath/length"] || 0)
			setPasswordProtection(data["features/passwordProtection/enabled"] || false);
			setDailyLimitsEnabled(data["features/dailyLimits/enabled"] || false);
		});
	}, []);

	const handleChangeDeepBreath = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDeepBreathEnabled(event.target.checked);
		chrome.storage.sync.set({
			"features/deepBreath/enabled": event.target.checked
		});
	};

	const handleChangePasswordProtection = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordProtection(event.target.checked);
		chrome.storage.sync.set({
			"features/passwordProtection/enabled": event.target.checked
		})
	};

	const handleChangeDailyLimits = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDailyLimitsEnabled(event.target.checked);
		chrome.storage.sync.set({
			"features/dailyLimits/enabled": event.target.checked
		})
	};

	const handleChangeTime = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = Number(event.target.value);
		if (newValue >= 0 && newValue <= 99) {
			setDeepBreathLength(newValue);
			chrome.storage.sync.set({
				"features/deepBreath/length": newValue
			});
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Commitment
			</Typography>
			<Typography variant="body1" paragraph>
				Commit yourself to blocking distractions! These optional features help you stay focused 
				and avoid circumventing your distraction blocking.
			</Typography>

			<Paper elevation={3} sx={{ p: 3 }}>
				<Typography variant="h5" gutterBottom>
					Commitment Settings
				</Typography>
				
				<Card sx={{ mb: 3 }}>
					<CardContent>
						<Typography variant="h6" gutterBottom>Deep Breath</Typography>
						<Typography variant="body2" color="text.secondary" paragraph>
							Set a countdown timer that locks you out of settings for a duration. 
							Give yourself time to take a deep breath and turn back.
						</Typography>
						<FormControlLabel
							control={<Switch checked={deepBreathEnabled} onChange={handleChangeDeepBreath} />}
							label="Enable"
						/>
						{deepBreathEnabled && (
							<Box sx={{ mt: 2 }}>
								<FormLabel component="legend">Countdown length</FormLabel>
								<TextField
									type="number"
									label="Seconds"
									value={deepBreathLength}
									onChange={handleChangeTime}
									variant="outlined"
									size="small"
									sx={{ mt: 1 }}
								/>
							</Box>
						)}
					</CardContent>
				</Card>
				
				{/* Commented out features that might be added later */}
				{/*
				<Card sx={{marginBottom: 3}}>
					<CardContent>
						<Typography variant="h6" gutterBottom>Password Protection</Typography>
						<Typography variant="body2" color="text.secondary" paragraph>
							Protect your settings with a password to prevent impulsive changes.
						</Typography>
						<FormControlLabel
							control={<Switch checked={passwordProtectionEnabled} onChange={handleChangePasswordProtection} />}
							label="Enable"
						/>
					</CardContent>
				</Card>

				<Card sx={{marginBottom: 3}}>
					<CardContent>
						<Typography variant="h6" gutterBottom>Daily Limits</Typography>
						<Typography variant="body2" color="text.secondary" paragraph>
							Set daily time limits for accessing blocked sites.
						</Typography>
						<FormControlLabel
							control={<Switch checked={dailyLimitsEnabled} onChange={handleChangeDailyLimits} />}
							label="Enable"
						/>
					</CardContent>
				</Card>
				*/}
			</Paper>
		</Box>
	);
};

export default Commitment;
