import * as React from "react";
import BlockScheduler from "./BlockScheduler";
import { Box, Typography, Paper, Button } from '@mui/material';
import { importCalendarToBlockSchedules } from '../../../Helpers/CalendarHelper';
import { CalendarMonth } from '@mui/icons-material';
import CalendarImportDialog from './CalendarImportDialog';
import { getGoogleAuthToken } from '../../../Helpers/GoogleAuthHelper';

const Scheduler: React.FC = () => {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [calendars, setCalendars] = React.useState<Array<{ id: string; summary: string }>>([]);

	const fetchCalendars = async () => {
		try {
			const token = await getGoogleAuthToken();
			const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			
			if (!response.ok) {
				throw new Error('Failed to fetch calendars');
			}
			
			const data = await response.json();
			setCalendars(data.items.map((item: any) => ({
				id: item.id,
				summary: item.summary
			})));
		} catch (error) {
			console.error('Error fetching calendars:', error);
			alert('Failed to fetch calendars. Please try again.');
		}
	};

	const handleImportClick = () => {
		fetchCalendars();
		setDialogOpen(true);
	};

	const handleImport = async (calendarId: string, timeMin: string, timeMax: string) => {
		try {
			const blockSchedules = await importCalendarToBlockSchedules(calendarId, timeMin, timeMax);
			
			// Load existing intervals
			const { intervals } = await chrome.storage.sync.get('intervals');
			const existingIntervals = intervals || [];
			
			// Convert block schedules to intervals format
			const newIntervals = blockSchedules.map(schedule => ({
				start: `${schedule.startTime.hour}:${schedule.startTime.minute}`,
				end: `${schedule.endTime.hour}:${schedule.endTime.minute}`,
				selectedDays: Array(7).fill(false).map((_, i) => schedule.days.includes(i)),
				enabled: schedule.active
			}));
			
			// Save all intervals
			await chrome.storage.sync.set({
				intervals: [...existingIntervals, ...newIntervals]
			});
			
			alert('Successfully imported calendar events!');
		} catch (error) {
			console.error('Error importing from calendar:', error);
			alert('Failed to import from calendar. Please try again.');
		}
	};

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
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
					<Typography variant="h5">
						Schedule Settings
					</Typography>
					<Button
						variant="contained"
						color="primary"
						startIcon={<CalendarMonth />}
						onClick={handleImportClick}
					>
						Import from Calendar
					</Button>
				</Box>
				<BlockScheduler/>
			</Paper>

			<CalendarImportDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				onImport={handleImport}
				calendars={calendars}
			/>
		</Box>
	);
};

export default Scheduler;
