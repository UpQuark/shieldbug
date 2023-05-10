import * as React from "react";
import BlockScheduler from "./BlockScheduler";

const Scheduler: React.FC = () => {
	return (
		<div>
			<h1>Scheduler</h1>
			<p>
				Schedule intervals where ShieldBug is active.
			</p>
			<BlockScheduler/>
		</div>
	);
};

export default Scheduler;
