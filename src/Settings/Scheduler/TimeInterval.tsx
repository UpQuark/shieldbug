import * as React from "react";
import { useState } from "react";
import { Button, ButtonGroup, Col, Container, Row } from "react-bootstrap";
import Select from "react-select";

const TimeInterval = () => {
	const [timeIntervals, setTimeIntervals] = useState([{ start: "", end: "" }]);
	const [selectedDays, setSelectedDays] = useState(Array(7).fill(false));

	const addTimeInterval = () => {
		setTimeIntervals([...timeIntervals, { start: "", end: "" }]);
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

	const toggleDay = (index: number): void => {
		const newSelectedDays = [...selectedDays];
		newSelectedDays[index] = !newSelectedDays[index];
		setSelectedDays(newSelectedDays);
	};

	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	const generateTimeOptions = () => {
		const options = [];
		for (let i = 0; i < 24; i++) {
			for (let j = 0; j < 60; j += 15) {
				const hour = i < 10 ? `0${i}` : i;
				const minute = j < 10 ? `0${j}` : j;
				options.push({ value: `${hour}:${minute}`, label: `${hour}:${minute}` });
			}
		}
		return options;
	};

	const timeOptions = generateTimeOptions();

	return (
		<Container>
			{timeIntervals.map((interval, index) => (
				<Row key={index} className="mb-2">
					<Col>
						<Select
							options={timeOptions}
							value={timeOptions.find((option) => option.value === interval.start)}
							onChange={(e) => handleTimeChange(index, "start", e.value)}
							menuPlacement="auto"
							menuPortalTarget={document.body}
							styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
						/>
					</Col>
					<Col xs="auto">-</Col>
					<Col>
						<Select
							options={timeOptions}
							value={timeOptions.find((option) => option.value === interval.end)}
							onChange={(e) => handleTimeChange(index, "end", e.value)}
							menuPlacement="auto"
							menuPortalTarget={document.body}
							styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
						/>
					</Col>
				</Row>
			))}
			<Row className="mb-3">
				<Col>
					<Button onClick={addTimeInterval}>Add Time Interval</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<ButtonGroup>
						{days.map((day, index) => (
							<Button
								key={index}
								variant={selectedDays[index] ? "primary" : "secondary"}
								onClick={() => toggleDay(index)}
							>
								{day}
							</Button>
						))}
					</ButtonGroup>
				</Col>
			</Row>
		</Container>
	);
};

export default TimeInterval;
