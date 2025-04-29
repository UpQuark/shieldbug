import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface CalendarImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (calendarId: string, timeMin: string, timeMax: string) => void;
  calendars: Array<{ id: string; summary: string }>;
}

const CalendarImportDialog: React.FC<CalendarImportDialogProps> = ({
  open,
  onClose,
  onImport,
  calendars
}) => {
  const [selectedCalendar, setSelectedCalendar] = React.useState('');
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  });

  const handleImport = () => {
    if (selectedCalendar && startDate && endDate) {
      onImport(
        selectedCalendar,
        startDate.toISOString(),
        endDate.toISOString()
      );
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Import from Calendar</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            select
            label="Calendar"
            value={selectedCalendar}
            onChange={(e) => setSelectedCalendar(e.target.value)}
            fullWidth
          >
            {calendars.map((calendar) => (
              <MenuItem key={calendar.id} value={calendar.id}>
                {calendar.summary}
              </MenuItem>
            ))}
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue: Date | null) => setStartDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue: Date | null) => setEndDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleImport} variant="contained" color="primary">
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalendarImportDialog; 