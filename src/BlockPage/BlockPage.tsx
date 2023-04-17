import * as React from 'react';

const BlockPage: React.FC = () => {
	return (
		<div>
			<h1>Don't Panic!</h1>
			<p>ShieldBug has blocked this website.</p>
			<img
				style={{width: 200, height: 200}}
				src={chrome.runtime.getURL('assets/icon-template.png')}
				alt="Shieldbug"
			/>
		</div>
	);
};

export default BlockPage;
