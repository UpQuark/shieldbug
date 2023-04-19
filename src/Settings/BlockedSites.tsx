import * as React from 'react';
import UrlBlocker from "./UrlBlocker";
import CategoryBlocker from "./CategoryBlocker";

const BlockedSites: React.FC = () => {
	return (
		<div>
			{/*<h1>Blocked Categories</h1>*/}
			{/*<p>Block entire categories of distraction all at once!</p>*/}
			{/*<CategoryBlocker />*/}

			<h1>Blocked Sites</h1>
			<p>
				You can block individual sites using ShieldBug.
			</p>
			<UrlBlocker />
		</div>
	);
};

export default BlockedSites;
