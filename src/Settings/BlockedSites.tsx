// BlockedSites.tsx
import * as React from 'react';
import UrlBlocker from "./UrlBlocker";

const BlockedSites: React.FC = () => {
	return (
		<div>
			<h1>Blocked Sites</h1>
			<UrlBlocker />
		</div>
	);
};

export default BlockedSites;
