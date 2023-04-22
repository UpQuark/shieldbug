import * as React from 'react';
import UrlBlocker from "./UrlBlocker";

const BlockedSites: React.FC = () => {
	return (
		<div>
			<h1>Blocked Sites</h1>
			<p>
				You can block individual sites using ShieldBug.
			</p>
			<UrlBlocker />
		</div>
	);
};

export default BlockedSites;
