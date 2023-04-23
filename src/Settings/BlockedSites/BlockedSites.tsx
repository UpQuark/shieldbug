import * as React from 'react';
import UrlBlocker from "./UrlBlocker";
import FeatureFlags from "../../FeatureFlags";

const BlockedSites: React.FC = () => {
	return (
		<div>
			<h1>Blocked Sites</h1>
			<p>
				You can block individual sites using ShieldBug. Just enter the URL of the site you want to block below.
			</p>

			{FeatureFlags.BLockSites_MultipleLists &&
        <p>
          You can create more than one list of sites to block. One will always be your "main" list which is always
          active.
          Other block lists can be attached to schedules so that they are only active at certain times.
        </p>
			}

			<UrlBlocker/>
		</div>
	);
};

export default BlockedSites;
