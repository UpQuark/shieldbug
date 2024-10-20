import {Button, ButtonGroup} from "@mui/material";
import * as React from "react";
import {TimeInterval} from "./SchedulerTypes";

interface DaySelectorProps {
	timeIntervals: TimeInterval[];
	timeIntervalIndex: number;
	setTimeIntervals: React.Dispatch<React.SetStateAction<TimeInterval[]>>;
	saveInterval: (index: number) => void;
	className?: string;
	sx?: React.CSSProperties;
}

// TODO: too many redundant args
/**
 * DaySelector is a component that allows the user to select which days of the week an interval is active, and modify
 * that interval within the interval list.
 * @param timeInterval
 * @param timeIntervals
 * @param timeIntervalIndex
 * @param setTimeIntervals
 * @constructor
 */
const DaySelector = (
	{timeIntervals, timeIntervalIndex, setTimeIntervals, saveInterval, className, sx} : DaySelectorProps
) => {
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	const toggleDay = (intervalIndex: number, dayIndex: number): void => {
		const newIntervals = [...timeIntervals];
		newIntervals[intervalIndex].selectedDays[dayIndex] = !newIntervals[
			intervalIndex
			].selectedDays[dayIndex];
		setTimeIntervals(newIntervals);
		saveInterval(intervalIndex)
	};

	return (
		<ButtonGroup aria-label="outlined primary button group" sx={sx} className={className}>
			{days.map((day, dayIndex) => (
				<Button
					key={dayIndex}
					variant={timeIntervals[timeIntervalIndex].selectedDays[dayIndex] ? "contained" : "outlined"}
					onClick={() => toggleDay(timeIntervalIndex, dayIndex)}
				>
					{day}
				</Button>
			))
			}
		</ButtonGroup>
	);
}

export default DaySelector;