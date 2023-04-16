import React from 'react';
import UrlBlocker from './UrlBlocker';

const PopupApp: React.FC = () => {
	return (
		<div>
			<h1>Hello, Shieldbug Popup!</h1>
			<UrlBlocker />
		</div>
	);
};

export default PopupApp;