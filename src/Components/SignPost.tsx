import * as React from 'react';
import { makeStyles, useTheme } from '@mui/styles';
import { Theme } from '@mui/material/styles';

const useStyles = makeStyles(() => ({
	signpost: {
		borderRadius: '0 16px 16px 0',
		marginLeft: '-2.3rem',
		padding: '0.8rem',
		paddingLeft: '2.3rem'
	},
}));

interface SignPostProps {
	children: any;
}

const SignPost: React.FC<SignPostProps> = ({ children }) => {
	const classes = useStyles();
	const theme = useTheme<Theme>();

	return (
		<div className={classes.signpost} style={{ backgroundColor: theme.palette.info.main }}>
			{children}
		</div>
	);
};

export default SignPost;