import * as React from "react";
import BlockScheduler from "./BlockScheduler";
import { Box, Typography, Paper } from '@mui/material';

const Scheduler: React.FC = () => {
	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Scheduler
			</Typography>
			<Typography variant="body1" paragraph>
				Schedule intervals where your ShieldBug block list is active.
				This is useful for blocking distracting sites during dedicated hours, like during work or study.
			</Typography>
			
			<Paper elevation={3} sx={{ p: 3 }}>
				<Typography variant="h5" gutterBottom>
					Schedule Settings
				</Typography>
				<BlockScheduler/>
			</Paper>
		</Box>
	);
};

export default Scheduler;
