import * as React from 'react';
import LeftNavigator from "./LeftNavigator/LeftNavigator";
import theme from "../../styles/MuiTheme";
import {ThemeProvider} from "@mui/material";

const SettingsApp: React.FC = () => {
	return (
		<ThemeProvider theme={theme}>
			<LeftNavigator/>
		</ThemeProvider>
	);
};

export default SettingsApp;
