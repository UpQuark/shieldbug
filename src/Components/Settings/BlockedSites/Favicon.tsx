import * as React from 'react';

interface FaviconProps {
	url: string;
}

const Favicon: React.FC<FaviconProps> = ({ url }) => {
	const getFaviconUrl = (url: string) => {
		try {
			const {protocol, hostname} = new URL(`https://${url}`)
			const mainDomain = hostname.split('.').slice(-2).join('.');
			return `${protocol}//${mainDomain}/favicon.ico`;
		} catch (error) {
			console.error('Error getting favicon URL:', error);
			return '';
		}
	};

	const src = getFaviconUrl(url);

	return (
		<img
			src={src}
			alt={`Favicon for ${url}`}
			width="16"
			height="16"
			className="me-2"
		/>
	);
};

export default Favicon;
