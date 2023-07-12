import * as React from 'react';
import {Button, ButtonGroup, Grid, Container, Typography, Switch} from "@mui/material";
import Select from "react-select";
import {generateTimeOptions} from "./TimeHelper";
import {useEffect, useState} from "react";
import DaySelector from "./DaySelector";
import {TimeInterval} from "./SchedulerTypes";
import {Delete, Edit} from "@mui/icons-material";

interface SelectOptions {
	label: string;
	value: string;
}

const BlockScheduler = () => {
	const [blockOptions, setBlockOptions] = useState<SelectOptions[]>([]);
	const [timeIntervals, setTimeIntervals] = useState<TimeInterval[]>([
		{start: "", end: "", selectedDays: Array(7).fill(false), enabled: true},
	]);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	useEffect(() => {
		// Load intervals from chrome storage
		chrome.storage.sync.get(null, function (items) {
			let loadedIntervals = [];
			for (let key in items) {
				if (key.startsWith("interval")) {
					loadedIntervals.push(items[key]);
				}
			}
			setTimeIntervals(loadedIntervals);
		});
	}, []);

	const addTimeInterval = () => {
		setTimeIntervals([
			...timeIntervals,
			{start: "", end: "", selectedDays: Array(7).fill(false), enabled: true},
		]);
	};

	const handleTimeChange = (
		index: number,
		type: "start" | "end",
		value: string
	): void => {
		const newIntervals = [...timeIntervals];
		newIntervals[index][type] = value;
		setTimeIntervals(newIntervals);
		saveInterval(index);
	};

	const saveInterval = (index: number) => {
		// Save interval to chrome storage
		chrome.storage.sync.set({[`interval${index}`]: timeIntervals[index]}, function () {
			console.log(`Interval ${index} is saved.`);
		});
		setEditingIndex(null);
	};

	const deleteInterval = (index: number) => {
		// Delete interval from chrome storage
		chrome.storage.sync.remove(`interval${index}`, function() {
			console.log(`Interval ${index} is deleted.`);
		});

		// Update state
		setTimeIntervals(timeIntervals.filter((_, i) => i !== index));
	};

	const toggleIntervalEnabled = (index: number, value: boolean) => {
		// Update interval enabled status in state
		const newIntervals = [...timeIntervals];
		newIntervals[index].enabled = value;
		setTimeIntervals(newIntervals);

		// Save the updated state to Chrome storage
		saveInterval(index);
	};

	const timeOptions = generateTimeOptions();

	return (
		<>
			{timeIntervals.map((interval, index) => (
				<div key={index}>
					{index > 0 && <hr/>}
					<Grid container spacing={2} key={index} style={{marginBottom: 24}}>

						<Grid item xs={12} sm={6} md={1.5}>
							<Typography variant="h6">From:</Typography>
							<Select
								options={timeOptions}
								value={timeOptions.find((option) => option.value === interval.start)}
								onChange={(e) => handleTimeChange(index, "start", e?.value || "")}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={1.5}>
							<Typography variant="h6">To:</Typography>
							<Select
								options={timeOptions}
								value={timeOptions.find((option) => option.value === interval.end)}
								onChange={(e) => handleTimeChange(index, "end", e?.value || "")}
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={8} lg={6} xl={5}>
							<Grid container>
								<Typography variant="h6" sx={{justifySelf: "flex-start", textAlign: "left", width: "100%"}}>On days:</Typography>
								<DaySelector
									timeIntervals={timeIntervals}
									timeIntervalIndex={index}
									setTimeIntervals={setTimeIntervals}
									saveInterval={saveInterval}
								/>
							</Grid>
						</Grid>
						<Grid item xs={6} md={1}>
							<Typography variant="h6">Enabled:</Typography>
							<Switch
								checked={interval.enabled}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => toggleIntervalEnabled(index, e.target.checked)}
							/>
						</Grid>
						<Grid item xs={6} md={1}>
							<Typography variant="h6">&nbsp;</Typography>
							<Button variant={"outlined"} onClick={() => deleteInterval(index)}>
								<Delete/>
							</Button>
						</Grid>
					</Grid>
				</div>
			))}
			<Grid container justifyContent="center">
				<Grid item xs={12}>
					<Button variant="contained" color="primary" onClick={addTimeInterval}>
						Add schedule
					</Button>
				</Grid>
			</Grid>
		</>
	);
};

export default BlockScheduler;

