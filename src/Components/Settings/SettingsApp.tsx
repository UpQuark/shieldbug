import * as React from 'react';
import LeftNavigator from "./LeftNavigator/LeftNavigator";
import theme from "../../../styles/MuiTheme";
import { ThemeProvider, Box, Container } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BlockedSites from "./BlockedSites/BlockedItemsDialog";
import BlockedKeywords from "./BlockedKeywords";
import Scheduler from "./Scheduler/Scheduler";
import Commitment from "./Commitment/Commitment";
import WeirdStuff from "./WeirdStuff";
import WelcomePopover from "./WelcomePopover";

const SettingsApp: React.FC = () => {
	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Box sx={{ 
					display: 'flex', 
					width: '100%',
					boxSizing: 'border-box',
					position: 'relative'
				}}>
					<LeftNavigator/>
					<WelcomePopover/>
					<Box sx={{ 
						width: 'calc(100% - 261px)', 
						marginLeft: '261px', 
						padding: 3,
						boxSizing: 'border-box'
					}}>
						<Routes>
							<Route path="*" element={<BlockedSites/>}/>
							<Route path="/blocked-keywords" element={<BlockedKeywords/>}/>
							<Route path="/schedule" element={<Scheduler/>}/>
							<Route path="/commitment" element={<Commitment/>}/>
							<Route path="/weird-stuff" element={<WeirdStuff/>}/>
						</Routes>
					</Box>
				</Box>
			</Router>
		</ThemeProvider>
	);
};

export default SettingsApp;
