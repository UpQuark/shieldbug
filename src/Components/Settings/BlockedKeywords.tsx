import * as React from 'react';
import KeywordBlocker from "./KeywordBlocker";

const BlockedKeywords: React.FC = () => {
	return (
		<div>
			<h1>Blocked Keywords</h1>
			<p>Block URLs by keyword.</p>
			<KeywordBlocker />
		</div>
	);
};

export default BlockedKeywords;
