export interface TimeInterval {
	start: string;
	end: string;
	selectedDays: boolean[];
	enabled: boolean;
}

export interface BlockSchedule {
	id: string;
	name: string;
	startTime: {
		hour: number;
		minute: number;
	};
	endTime: {
		hour: number;
		minute: number;
	};
	days: number[];
	active: boolean;
}