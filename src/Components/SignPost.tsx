import * as React from 'react';
import { makeStyles } from '@mui/styles';
import {colors} from "../../styles/MuiTheme";

const useStyles = makeStyles((theme) => ({
	signpost: {
		backgroundColor: colors.info,
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

	return (
		<div className={classes.signpost}>
			{children}
		</div>
	);
};

export default SignPost;