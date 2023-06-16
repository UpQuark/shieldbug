import * as React from 'react';
import { Switch, FormControlLabel, FormGroup, Box, Typography } from '@mui/material';
import SignPost from "../../UiComponents/SignPost";

const Commitment: React.FC = () => {
	const [deepBreath, setDeepBreath] = React.useState(false);
	const [passwordProtection, setPasswordProtection] = React.useState(false);
	const [dailyLimits, setDailyLimits] = React.useState(false);

	const handleChangeDeepBreath = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDeepBreath(event.target.checked);
	};

	const handleChangePasswordProtection = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordProtection(event.target.checked);
	};

	const handleChangeDailyLimits = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDailyLimits(event.target.checked);
	};

	return (
		<div>
			<h1>Commitment</h1>
			<SignPost>
				<h2 style={{color: 'white'}}>Interdict distractions.</h2>
			</SignPost>

			<p style={{marginTop: '1rem'}}>
				<ul>
					<li>Set a timer that locks you out of settings for a few seconds</li>
					<li>Take a deep breath</li>
					<li>Decide if you still want to continue</li>
				</ul>
			</p>

			<Box>
				<Typography variant="h6">Deep Breath</Typography>
				<FormControlLabel
					control={<Switch checked={deepBreath} onChange={handleChangeDeepBreath} style={{ fontSize: '3rem' }} />}
					label="Enable"
				/>
			</Box>

			<Box>
				<Typography variant="h6">Password Protection</Typography>
				<FormControlLabel
					control={<Switch checked={passwordProtection} onChange={handleChangePasswordProtection} style={{ fontSize: '3rem' }} />}
					label="Enable"
				/>
			</Box>

			<Box>
				<Typography variant="h6">Daily Limits</Typography>
				<FormControlLabel
					control={<Switch checked={dailyLimits} onChange={handleChangeDailyLimits} style={{ fontSize: '3rem' }} />}
					label="Enable"
				/>
			</Box>
		</div>
	);
};

export default Commitment;
