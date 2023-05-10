import * as React from "react";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Container, Row } from "react-bootstrap";
import Select from "react-select";
import { generateTimeOptions } from "./TimeHelper";

interface SelectOptions {
	label: string;
	value: string;
}

/**
 * Time interval selector for scheduling blocked sites
 * @constructor
 */
const BlockScheduler = () => {
	const [blockOptions, setBlockOptions] = useState<SelectOptions[]>([]);
	const [timeIntervals, setTimeIntervals] = useState([
		{ start: "", end: "", selectedDays: Array(7).fill(false) },
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
			{ start: "", end: "", selectedDays: Array(7).fill(false) },
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
	};

	const toggleDay = (intervalIndex: number, dayIndex: number): void => {
		const newIntervals = [...timeIntervals];
		newIntervals[intervalIndex].selectedDays[dayIndex] = !newIntervals[
			intervalIndex
			].selectedDays[dayIndex];
		setTimeIntervals(newIntervals);
	};

	const saveInterval = (index: number) => {
		// Save interval to chrome storage
		chrome.storage.sync.set({ [`interval${index}`]: timeIntervals[index] }, function () {
			console.log(`Interval ${index} is saved.`);
		});
		setEditingIndex(null);
	};

	const deleteInterval = (index: number) => {
		console.log("Deleting interval: ", timeIntervals[index]);
	};

	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const timeOptions = generateTimeOptions();

	return (
		<>
			{timeIntervals.map((interval, index) => (
				<Container key={index} className="mb-4 p-0">
					<Row className="mb-2">
						<Col>
							<h5>From:</h5>
							{editingIndex === index ? (
								<Select
									options={timeOptions}
									value={timeOptions.find(
										(option) => option.value === interval.start
									)}
									onChange={(e) =>
										handleTimeChange(index, "start", e.value)
									}
									menuPlacement="auto"
									menuPortalTarget={document.body}
									styles={{
										menuPortal: (base) => ({ ...base, zIndex: 9999 }),
									}}
								/>
							) : (
								<p>{interval.start}</p>
							)}
						</Col>
						<Col>
							<h5>To:</h5>
							{editingIndex === index ? (
								<Select
									options={timeOptions}
									value={timeOptions.find(
										(option) => option.value === interval.end
									)}
									onChange={(e) =>
										handleTimeChange(index, "end", e.value)
									}
									menuPlacement="auto"
									menuPortalTarget={document.body}
									styles={{
										menuPortal: (base) => ({ ...base, zIndex: 9999 }),
									}}
								/>
							) : (
								<p>{interval.end}</p>
							)}
						</Col>
						<Col>
							<h5>On days:</h5>
							{editingIndex === index ? (
								<ButtonGroup>
									{days.map((day, dayIndex) => (
										<Button
											key={dayIndex}
											className={"text-white"}
											variant={
												interval.selectedDays[dayIndex]
													? "primary"
													: "secondary"
											}
											onClick={() => toggleDay(index, dayIndex)}
										>
											{day}
										</Button>
									))}
								</ButtonGroup>
							) : (
								<p>{days.filter((day, i) => interval.selectedDays[i]).join(", ")}</p>
							)}
						</Col>
					</Row>
					<Row>
						<Col>
							{editingIndex === index ? (
								<>
									<Button
										className="text-white me-3"
										onClick={() => saveInterval(index)}
									>
										Save schedule
									</Button>
									<Button
										className="text-white"
										variant="secondary"
										onClick={() => setEditingIndex(null)}
									>
										Cancel
									</Button>
								</>
							) : (
								<Button
									className="text-white"
									onClick={() => setEditingIndex(index)}
								>
									Edit
								</Button>
							)}
						</Col>
					</Row>
				</Container>
			))}
			<hr/>
			<Row className="mb-3">
				<Col>
					<Button className="text-white" onClick={addTimeInterval}>
						Add schedule
					</Button>
				</Col>
			</Row>
		</>
	);
};

export default BlockScheduler;
