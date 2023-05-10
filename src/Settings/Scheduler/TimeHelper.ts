/**
 * Generates an array of time options in 15 minute increments
 */
export const generateTimeOptions = () => {
	const options = [];
	for (let i = 0; i < 24; i++) {
		for (let j = 0; j < 60; j += 15) {
			const hour24 = i < 10 ? `0${i}` : i;
			const minute = j < 10 ? `0${j}` : j;
			const ampm = i < 12 ? "AM" : "PM";
			const hour12 = i % 12 === 0 ? 12 : i % 12;
			const hour12Padded = hour12 < 10 ? `0${hour12}` : hour12;
			const formattedTime = `${hour12Padded}:${minute} ${ampm}`;
			options.push({value: `${hour24}:${minute}`, label: formattedTime});
		}
	}
	return options;
};