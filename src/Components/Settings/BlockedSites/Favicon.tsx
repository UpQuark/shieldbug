import * as React from 'react';
import { Box } from '@mui/material';

interface FaviconProps {
	url: string;
	size?: number;
}

const Favicon: React.FC<FaviconProps> = ({ url, size = 24 }) => {
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
		<Box 
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: size,
				height: size,
				borderRadius: '4px',
				overflow: 'hidden',
				flexShrink: 0,
				mr: 2,
				boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
			}}
		>
			<img
				src={src}
				alt={`Favicon for ${url}`}
				width={size}
				height={size}
				style={{
					objectFit: 'contain'
				}}
			/>
		</Box>
	);
};

export default Favicon;
