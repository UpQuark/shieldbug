import * as React from 'react';
import featureFlags from "../../FeatureFlags";
import {colors} from "@mui/material";
import SignPost from "../../UiComponents/SignPost";

const Commitment: React.FC = () => {
	return (
		<div>
			<h1>Commitment</h1>
			<SignPost>
				<h2 style={{color: 'white'}}>Interdict distractions.</h2>
			</SignPost>

			<p style={{marginTop: '1rem'}}>
				Set a timer and a friendly query for yourself. Give yourself time to take a deep breath and think about
				whether you want to continue.
			</p>

		</div>
	);
};

export default Commitment;
