import * as React from 'react';
import LeftNavigator from "./LeftNavigator/LeftNavigator";
import theme from "../../../styles/MuiTheme";
import {ThemeProvider} from "@mui/material";
import {Col, Container, Nav, Row} from "react-bootstrap";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
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
				<Container fluid style={{ paddingLeft: '261px', width: '100%' }}>
					<Row>
						<LeftNavigator/>
						<WelcomePopover/>
						<Col style={{boxShadow: "inset 8px 0px 16px -8px rgba(0, 0, 0, 0.25)", width: 'calc(100% - 261px)'}}>
							<Container style={{padding: 24}}>
								<Routes>
									<Route path="*" element={<BlockedSites/>}/>
									<Route path="/blocked-keywords" element={<BlockedKeywords/>}/>
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
