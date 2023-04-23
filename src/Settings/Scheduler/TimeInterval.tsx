import * as React from "react";
import {useEffect, useState} from "react";
import { Button, ButtonGroup, Col, Container, Row } from "react-bootstrap";
import Select from "react-select";

const TimeInterval = () => {
	const [blockOptions, setBlockOptions] = useState([]);
	const [timeIntervals, setTimeIntervals] = useState([
		{ start: "", end: "", selectedDays: Array(7).fill(false) },
	]);

	useEffect(() => {
		fetchBlockOptions();
	}, []);


	const fetchBlockOptions = () => {
		chrome.storage.local.get(["blockedCategories", "blockLists"], (data) => {
			const options = [];

			CategoryTypes.forEach((category) => {
				options.push({name: category.name, value: category.name});
			});

			if (data.blockLists) {
				data.blockLists.forEach((list) => {
					options.push({name: list.name, value: list.name});
				});
			}

			setBlockOptions(options);
		});
	};


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
		console.log("Saving interval: ", timeIntervals[index]);
	};

	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	const generateTimeOptions = () => {
		const options = [];
		for (let i = 0; i < 24; i++) {
			for (let j = 0; j < 60; j += 15) {
				const hour24 = i < 10 ? `0${i}` : i;
				const minute = j < 10 ? `0${j}` : j;
				const ampm = i < 12 ? "AM" : "PM";
				const hour12 = i % 12 === 0 ? 12 : i % 12;
				const hour12Padded = hour12 < 10 ? `0${hour12}` : hour12;
				const formattedTime = `${hour12Padded}:${minute} ${ampm}`;
				options.push({ value: `${hour24}:${minute}`, label: formattedTime });
			}
		}
		return options;
	};

	const timeOptions = generateTimeOptions();

	return (
		<>
			{timeIntervals.map((interval, index) => (
				<Container key={index} className="mb-4">
					<Row className="mb-2">
						<h5>From</h5>
						<Col>
							<Select
								options={timeOptions}
								value={timeOptions.find(
									(option) => option.value === interval.start
								)}
								onChange={(e) => handleTimeChange(index, "start", e.value)}
								menuPlacement="auto"
								menuPortalTarget={document.body}
								styles={{
									menuPortal: (base) => ({ ...base, zIndex: 9999 }),
								}}
							/>
						</Col>
						<Col xs="auto">
							<h5>to</h5>
						</Col>
						<Col>
							<Select
								options={timeOptions}
								value={timeOptions.find(
									(option) => option.value === interval.end
								)}
								onChange={(e) => handleTimeChange(index, "end", e.value)}
								menuPlacement="auto"
								menuPortalTarget={document.body}
								styles={{
									menuPortal: (base) => ({ ...base, zIndex: 9999 }),
								}}
							/>
						</Col>

						<Col>
							<ButtonGroup>
								{days.map((day, dayIndex) => (
									<Button
										key={dayIndex}
										className={"text-white"}
										variant={
											interval.selectedDays[dayIndex] ? "primary" : "secondary"
										}
										onClick={() => toggleDay(index, dayIndex)}
									>
										{day}
									</Button>
								))}
							</ButtonGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<Button
								className="text-white"
								onClick={() => saveInterval(index)}
							>
								Save Interval
							</Button>
						</Col>
					</Row>
				</Container>
			))}
			<Row className="mb-3">
				<Col>
					<Button className="text-white" onClick={addTimeInterval}>
						Add Time Interval
					</Button>
				</Col>
			</Row>
		</>
	);
};

export default TimeInterval;
