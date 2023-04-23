import * as React from "react";
import TimeInterval from "./TimeInterval";

const Scheduler: React.FC = () => {
	return (
		<div>
			<h1>Scheduler</h1>
			<p>
				Schedule intervals where ShieldBug will be active or alternate block lists will kick in.
				Block social media during the day and your work email at night, block off focus times, and
				be present during them.
			</p>
			<TimeInterval/>
		</div>
	);
};

export default Scheduler;
