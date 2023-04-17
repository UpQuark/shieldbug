import * as React from 'react';

const BlockPage: React.FC = () => {
	return (
		<div>
			<h1>BlockPage</h1>
			<p>This is the BlockPage component.</p>
			<img src={chrome.runtime.getURL('images/icon-template.png')} alt="Shieldbug" />
		</div>
	);
};

export default BlockPage;
