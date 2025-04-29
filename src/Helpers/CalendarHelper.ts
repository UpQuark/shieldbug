import { BlockSchedule } from '../Components/Settings/Scheduler/SchedulerTypes';

interface GoogleCalendarEvent {
  summary: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
}

/**
 * Imports events from Google Calendar API
 * @param calendarId The ID of the calendar to import from
 * @param timeMin Start time for the import range
 * @param timeMax End time for the import range
 * @returns Promise with array of calendar events
 */
export const importFromGoogleCalendar = async (
  calendarId: string,
  timeMin: string,
  timeMax: string
): Promise<GoogleCalendarEvent[]> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?` +
      `timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          'Authorization': `Bearer ${await getGoogleAuthToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error importing from Google Calendar:', error);
    throw error;
  }
};

/**
 * Maps Google Calendar events to ShieldBug block schedules
 * @param events Array of Google Calendar events
 * @returns Array of BlockSchedule objects
 */
export const mapEventsToBlockSchedules = (events: GoogleCalendarEvent[]): BlockSchedule[] => {
  return events.map(event => {
    const startTime = new Date(event.start.dateTime);
    const endTime = new Date(event.end.dateTime);

    return {
      id: `calendar-${event.summary}-${startTime.getTime()}`,
      name: event.summary,
      startTime: {
        hour: startTime.getHours(),
        minute: startTime.getMinutes()
      },
      endTime: {
        hour: endTime.getHours(),
        minute: endTime.getMinutes()
      },
      days: [startTime.getDay()], // Single day for now, could be expanded to recurring events
      active: true
    };
  });
};

/**
 * Parent method that imports calendar events and maps them to block schedules
 * @param calendarId The ID of the calendar to import from
 * @param timeMin Start time for the import range
 * @param timeMax End time for the import range
 * @returns Promise with array of BlockSchedule objects
 */
export const importCalendarToBlockSchedules = async (
  calendarId: string,
  timeMin: string,
  timeMax: string
): Promise<BlockSchedule[]> => {
  try {
    const events = await importFromGoogleCalendar(calendarId, timeMin, timeMax);
    return mapEventsToBlockSchedules(events);
  } catch (error) {
    console.error('Error importing calendar to block schedules:', error);
    throw error;
  }
};

/**
 * Helper function to get Google OAuth token
 * @returns Promise with the OAuth token
 */
const getGoogleAuthToken = async (): Promise<string> => {
  // This will need to be implemented with proper OAuth flow
  // For now, we'll return a placeholder
  return 'YOUR_OAUTH_TOKEN';
}; 