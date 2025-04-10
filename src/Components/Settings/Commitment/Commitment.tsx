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
	FormLabel
} from '@mui/material';
import SignPost from "../../../Components/SignPost";
import {useEffect} from "react";

// TODO: The feature flag stuff in here is begging for a small management service

/**
 * Settings for "commitment" features like 'deep breaths' (timed lockout), password protection, and daily view limits
 * @constructor
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


	/**
	 * Save setting to storage
	 * @param event
	 */
	const handleChangeDeepBreath = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDeepBreathEnabled(event.target.checked);
		chrome.storage.sync.set({
			"features/deepBreath/enabled": event.target.checked
		});
	};

	/**
	 * Save setting to storage
	 * @param event
	 */
	const handleChangePasswordProtection = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordProtection(event.target.checked);
		chrome.storage.sync.set({
			"features/passwordProtection/enabled": event.target.checked
		})
	};

	/**
	 * Save setting to storage
	 * @param event
	 */
	const handleChangeDailyLimits = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDailyLimitsEnabled(event.target.checked);
		chrome.storage.sync.set({
			"features/dailyLimits/enabled": event.target.checked
		})
	};

	/**
	 * Save setting to storage
	 * @param event
	 */
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
		<div>
			<h1>Commitment</h1>
			{/*<SignPost>*/}
			{/*	<h2 style={{color: 'white'}}>Interdict distractions.</h2>*/}
			{/*</SignPost>*/}

			<Typography variant="body1" sx={{ fontWeight: '700', marginBottom: 3 }}>
				Commit yourself to blocking distractions! These optional features to help you stay focused and avoid circumventing
				your distraction blocking.
			</Typography>

			<Card sx={{marginBottom: 3}}>
				<CardContent>
					<Box>
						<h3>Deep Breath</h3>
						<p>
							Set a countdown timer that locks you out of settings for a duration. Give yourself time to take a deep breath
							and turn back.
						</p>
						<FormControlLabel
							control={<Switch checked={deepBreathEnabled} onChange={handleChangeDeepBreath} style={{fontSize: '3rem'}}/>}
							label="Enable"
						/>
						{deepBreathEnabled &&
							<div>
                <FormLabel component="legend">Countdown length</FormLabel>
                <TextField
                  type="number"
                  label="Seconds"
                  value={deepBreathLength}
                  onChange={handleChangeTime}
                />
							</div>
						}
					</Box>
				</CardContent>
			</Card>

			{/*<Card sx={{marginBottom: 3}}>*/}
			{/*	<CardContent>*/}
			{/*		<Box>*/}
			{/*			<Typography variant="h6">Password Protection</Typography>*/}
			{/*			<FormControlLabel*/}
			{/*				control={<Switch checked={passwordProtectionEnabled} onChange={handleChangePasswordProtection}*/}
			{/*				                 style={{fontSize: '3rem'}}/>}*/}
			{/*				label="Enable"*/}
			{/*			/>*/}
			{/*		</Box>*/}
			{/*	</CardContent>*/}
			{/*</Card>*/}

			{/*<Card sx={{marginBottom: 3}}>*/}
			{/*	<CardContent>*/}
			{/*		<Box>*/}
			{/*			<Typography variant="h6">Daily Limits</Typography>*/}
			{/*			<FormControlLabel*/}
			{/*				control={<Switch checked={dailyLimitsEnabled} onChange={handleChangeDailyLimits} style={{fontSize: '3rem'}}/>}*/}
			{/*				label="Enable"*/}
			{/*			/>*/}
			{/*		</Box>*/}
			{/*	</CardContent>*/}
			{/*</Card>*/}
		</div>
	);
};

export default Commitment;
