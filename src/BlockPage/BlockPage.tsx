import * as React from 'react';
import './BlockPage.scss';

const BlockPage: React.FC = () => {
	return (
		<div className="block-page-container">
			<div className="text-center">
				<h1>Don't Panic!</h1>
				<p className="text-secondary">ShieldBug has blocked this website.</p>
				<img
					style={{width: 200, height: 200}}
					src={chrome.runtime.getURL('assets/icon-template.png')}
					alt="Shieldbug"
				/>
			</div>
		</div>
	);
};

export default BlockPage;
