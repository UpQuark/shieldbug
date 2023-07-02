import * as React from 'react';
import {Switch, FormControlLabel, FormGroup, Box, Typography, TextField} from '@mui/material';
import SignPost from "../../UiComponents/SignPost";
import {useEffect} from "react";

// TODO: The feature flag stuff in here is begging for a small management service

/**
 * Settings for "commitment" features like 'deep breaths' (timed lockout), password protection, and daily view limits
 * @constructor
 */
const Commitment: React.FC = () => {
	const [deepBreath, setDeepBreath] = React.useState(false);
	const [passwordProtection, setPasswordProtection] = React.useState(false);
	const [dailyLimits, setDailyLimits] = React.useState(false);

	const [deepBreathLength, setDeepBreathLength] = React.useState<number>();

	/**
	 * Load settings from storage
	 */
	useEffect(() => {
		chrome.storage.sync.get(['features/deepBreath/enabled', 'features/passwordProtection/enabled', 'features/dailyLimits/enabled'], (data) => {
			setDeepBreath(data["features/deepBreath/enabled"] || false);
			setDeepBreathLength(data["features/deepBreath/length"] || 0)
			setPasswordProtection(data["features/passwordProtection/enabled"] || false);
			setDailyLimits(data["features/dailyLimits/enabled"] || false);
		});
	}, []);


	/**
	 * Save setting to storage
	 * @param event
	 */
	const handleChangeDeepBreath = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDeepBreath(event.target.checked);
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
		setDailyLimits(event.target.checked);
		chrome.storage.sync.set({
			"features/dailyLimits/enabled": event.target.checked
		})
	};

	/**
	 * Save setting to storage
	 * @param event
	 */
	const handleChangeTime = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDeepBreathLength(Number(event.target.value));
		chrome.storage.sync.set({
			"features/deepBreath/length": Number(event.target.value)
		});
	}

	return (
		<div>
			<h1>Timeout</h1>
			<SignPost>
				<h2 style={{color: 'white'}}>Interdict distractions.</h2>
			</SignPost>

			<Box>
				<h3>Deep Breath</h3>
				<p>Set a timer that locks you out of settings for a few seconds.</p>
				<p>Take a deep breath.</p>
				<p>Decide if you still want to continue</p>
				<FormControlLabel
					control={<Switch checked={deepBreath} onChange={handleChangeDeepBreath} style={{fontSize: '3rem'}}/>}
					label="Enable"
				/>
				{deepBreath &&
          <TextField
            type="number"
            label="Seconds"
            value={deepBreathLength}
            onChange={handleChangeTime}
            InputProps={{inputProps: {min: 0}}} // Only allows non-negative values
          />
				}
			</Box>

			<Box>
				<Typography variant="h6">Password Protection</Typography>
				<FormControlLabel
					control={<Switch checked={passwordProtection} onChange={handleChangePasswordProtection}
					                 style={{fontSize: '3rem'}}/>}
					label="Enable"
				/>
			</Box>

			<Box>
				<Typography variant="h6">Daily Limits</Typography>
				<FormControlLabel
					control={<Switch checked={dailyLimits} onChange={handleChangeDailyLimits} style={{fontSize: '3rem'}}/>}
					label="Enable"
				/>
			</Box>
		</div>
	);
};

export default Commitment;
