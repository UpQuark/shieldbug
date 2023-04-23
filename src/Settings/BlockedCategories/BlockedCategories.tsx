import * as React from 'react';
import CategoryBlocker from "./CategoryBlocker";

const BlockedCategories: React.FC = () => {
	return (
		<div>
			<h1>Blocked Categories</h1>
			<p>Block entire categories of distraction all at once!</p>
			<CategoryBlocker />
		</div>
	);
};

export default BlockedCategories;
