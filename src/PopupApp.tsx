import * as React from 'react';
import UrlBlocker from './UrlBlocker';

const PopupApp: React.FC = () => {
	return (
		<div style={{width: 400, padding: 12}}>
			<h1>Hello, Shieldbug Popup!</h1>
			<UrlBlocker />
		</div>
	);
};

export default PopupApp;