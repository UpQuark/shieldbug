import * as React from 'react';
import UrlBlocker from '../Settings/BlockedSites/UrlBlocker';
import CategoryBlocker from '../Settings/BlockedCategories/CategoryBlocker';
import {
	Container,
	Grid,
	IconButton, ThemeProvider,
	Toolbar,
	Typography,
} from '@mui/material';
import { MdSettings } from 'react-icons/all';
import { makeStyles } from '@mui/styles';
import theme from "../../styles/MuiTheme";

const useStyles = makeStyles((theme) => ({
	icon: {
		height: 35,
		marginRight: 0
	},
	title: {
		marginTop: 0,
		flexGrow: 1,
		fontWeight: 'bold',
	},
	toolbar: {
		paddingRight: 0,
	},
}));

const PopupApp = () => {
	const classes = useStyles();

	const openSettingsPage = () => {
		chrome.runtime.openOptionsPage();
	};

	return (
		<ThemeProvider theme={theme}>
			<Container maxWidth={false} sx={{ width: 400, padding: 2 }}>
				<Toolbar className={classes.toolbar}>
					<img
						src={chrome.runtime.getURL('assets/icon-128.png')}
						alt="Shieldbug"
						className={classes.icon}
					/>
					<Typography variant="h6" className={classes.title}>
						ShieldBug
					</Typography>
					<IconButton
						onClick={openSettingsPage}
						color="inherit"
						sx={{ p: 1 }}
					>
						<MdSettings/>
					</IconButton>
				</Toolbar>
				<Grid container spacing={2} sx={{ mt: 2 }}>
					<Grid item xs={12}>
						<UrlBlocker />
					</Grid>
					<Grid item xs={12}>
						<CategoryBlocker />
					</Grid>
				</Grid>
			</Container>
		</ThemeProvider>
	);
};

export default PopupApp;
