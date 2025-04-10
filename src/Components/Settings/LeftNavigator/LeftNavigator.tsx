import * as React from 'react';
import {Row, Col, Container, Nav} from 'react-bootstrap';
import {BrowserRouter as Router, Route, Routes, Link, useNavigate} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import './LeftNavigator.scss';
import DeveloperFeatureFlags from "../../../Flags/DeveloperFeatureFlags";
import {Schedule, Block, CalendarViewWeek, Lightbulb, Search, Lock, LockClock} from "@mui/icons-material";

interface LeftNavigatorProps {
	initialRoute?: string;
}

const LeftNavigator: React.FC<LeftNavigatorProps> = ({initialRoute = '/blocked-sites'}) => {
	return (
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
					{DeveloperFeatureFlags.BlockKeywords &&
						<Nav.Link as={Link} to="/blocked-keywords"><Search style={{marginRight: 12}}/>Block keywords</Nav.Link>}
					{DeveloperFeatureFlags.BlockCategories &&
						<Nav.Link as={Link} to="/blocked-categories"><CalendarViewWeek style={{marginRight: 12}}/>Block categories</Nav.Link>}
					{DeveloperFeatureFlags.Schedule &&
						<Nav.Link as={Link} to="/schedule"><LockClock style={{marginRight: 12}}/>Schedule (beta)</Nav.Link>}
					{DeveloperFeatureFlags.Commitment &&
						<Nav.Link as={Link} to="/commitment"><Lock style={{marginRight: 12}}/>Commitment (beta)</Nav.Link>}

				</Nav>
			</div>
			<div className="about-link">
				{DeveloperFeatureFlags.WeirdStuff &&
					<Link to="/weird-stuff" className="nav-link"><Lightbulb style={{marginRight: 12}}/>Ideas</Link>
				}
				<a href="https://shieldbug.app" target="_blank" rel="noopener noreferrer" className="nav-link">
					About
				</a>
				<a href="mailto:info@shieldbug.com?subject=Shieldbug feedback" className="nav-link">
					Feedback
				</a>
			</div>
		</Col>
	);
};

export default LeftNavigator;
