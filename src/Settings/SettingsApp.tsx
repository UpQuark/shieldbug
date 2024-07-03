import * as React from 'react';
import LeftNavigator from "./LeftNavigator/LeftNavigator";
import theme from "../../styles/MuiTheme";
import {ThemeProvider} from "@mui/material";
import {Col, Container, Nav, Row} from "react-bootstrap";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import BlockedSites from "./BlockedSites/BlockedSites";
import BlockedKeywords from "./BlockedKeywords";
import BlockedCategories from "./BlockedCategories/BlockedCategories";
import Scheduler from "./Scheduler/Scheduler";
import Commitment from "./Commitment/Commitment";
import WeirdStuff from "./WeirdStuff";
import WelcomePopover from "./WelcomePopover";

const SettingsApp: React.FC = () => {
	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Container fluid>
					<Row>

						<LeftNavigator/>

						<WelcomePopover/>

						<Col style={{boxShadow: "inset 8px 0px 16px -14px rgba(0, 0, 0, 0.25)"}}>


							<Container style={{padding: 24}}>
								<Routes>
									<Route path="*" element={<BlockedSites/>}/>
									<Route path="/blocked-keywords" element={<BlockedKeywords/>}/>
									<Route path="/blocked-categories" element={<BlockedCategories/>}/>
									<Route path="/schedule" element={<Scheduler/>}/>
									<Route path="/commitment" element={<Commitment/>}/>
									<Route path="/weird-stuff" element={<WeirdStuff/>}/>
								</Routes>
							</Container>
						</Col>
					</Row>
				</Container>
			</Router>
		</ThemeProvider>
	);
};

export default SettingsApp;
