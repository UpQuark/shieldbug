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
import theme, {colors} from "../../styles/MuiTheme";

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
			<Container maxWidth={false} sx={{ width: 400, padding: 0}}>
				<Toolbar className={classes.toolbar} style={{backgroundColor: colors.primary}}>
					<img
						src={chrome.runtime.getURL('assets/icon-128.png')}
						alt="Shieldbug"
						className={`${classes.icon}`}
						style={{
							filter: "drop-shadow(0px 0px 7px rgba(0, 0, 0, 0.6))",
							marginRight: 8
					}}
					/>
					<Typography variant="h5" className={classes.title} style={{color: "white"}}>
						ShieldBug
					</Typography>
					<IconButton
						onClick={openSettingsPage}
						color="inherit"
						style={{color: "white"}}
					>
						<MdSettings/>
					</IconButton>
				</Toolbar>
				<Grid container spacing={1} className={"p-1"}>
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
