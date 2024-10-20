import * as React from "react";
import BlockScheduler from "./BlockScheduler";

const Scheduler: React.FC = () => {
	return (
		<div>
			<h1>Scheduler</h1>
			<p>
				Schedule intervals where your ShieldBug block list is active.
			</p>
			<p>
				This is useful for blocking distracting sites during dedicated hours, like during work or study.
			</p>
			<BlockScheduler/>
		</div>
	);
};

export default Scheduler;
