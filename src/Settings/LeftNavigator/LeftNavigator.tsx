import * as React from 'react';
import {Row, Col, Container, Nav} from 'react-bootstrap';
import {BrowserRouter as Router, Route, Routes, Link, useNavigate} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import WeirdStuff from '../WeirdStuff';
import BlockedSites from "../BlockedSites/BlockedSites";
import BlockedKeywords from "../BlockedKeywords";
import BlockedCategories from "../BlockedCategories/BlockedCategories";

import './LeftNavigator.scss';
import FeatureFlags from "../../FeatureFlags";
import Scheduler from "../Scheduler/Scheduler";
import {Schedule, Block, CalendarViewWeek, Lightbulb, Search} from "@mui/icons-material";

interface LeftNavigatorProps {
	initialRoute?: string;
}

const LeftNavigator: React.FC<LeftNavigatorProps> = ({initialRoute = '/blocked-sites'}) => {
	return (
		<Router>
			<Container fluid>
				<Row>
					<Col xs={3} md={2} className="left-sidebar">
						<Link to="/" className="navbar-brand">
							<img
								style={{
									height: 40,
									filter: "drop-shadow(0px 0px 7px rgba(0, 0, 0, 0.6))"
								}}
								src="../../assets/icon-128.png"
							/>
							<span className="brand-name">ShieldBug</span>
						</Link>
						<div className="nav-links">
							<Nav className="flex-column">
								<Nav.Link as={Link} to="/"><Block style={{marginRight: 12}}/> Block sites</Nav.Link>
								{FeatureFlags.BlockKeywords &&
                  <Nav.Link as={Link} to="/blocked-keywords"><Search style={{marginRight: 12}}/>Block keywords</Nav.Link>}
								{FeatureFlags.BlockCategories &&
                  <Nav.Link as={Link} to="/blocked-categories"><CalendarViewWeek style={{marginRight: 12}}/>Block categories</Nav.Link>}
								{FeatureFlags.Schedule &&
                  <Nav.Link as={Link} to="/schedule"><Schedule style={{marginRight: 12}}/>Schedule</Nav.Link>}

							</Nav>
						</div>
						<div className="about-link">
							{FeatureFlags.WeirdStuff &&
                <Link to="/weird-stuff" className="nav-link"><Lightbulb style={{marginRight: 12}}/>Ideas</Link>
							}
							<a href="https://shieldbug.app" target="_blank" rel="noopener noreferrer" className="nav-link">
								About
							</a>
							{/*<a href="mailto:info@shieldbug.com?subject=Shieldbug feedback" className="nav-link">*/}
							{/*	Feedback*/}
							{/*</a>*/}
						</div>
					</Col>
					<Col style={{boxShadow: "inset 8px 0px 16px -14px rgba(0, 0, 0, 0.25)"}}>
						<Container style={{padding: 24}}>
							<Routes>
								<Route path="*" element={<BlockedSites/>}/>
								<Route path="/blocked-keywords" element={<BlockedKeywords/>}/>
								<Route path="/blocked-categories" element={<BlockedCategories/>}/>
								<Route path="/schedule" element={<Scheduler/>}/>
								<Route path="/weird-stuff" element={<WeirdStuff/>}/>
							</Routes>
						</Container>
					</Col>
				</Row>
			</Container>
		</Router>
	);
};

export default LeftNavigator;
