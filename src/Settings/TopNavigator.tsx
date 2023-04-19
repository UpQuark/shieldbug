import * as React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import WeirdStuff from './WeirdStuff';
import BlockedSites from "./BlockedSites";
import BlockedKeywords from "./BlockedKeywords";
import BlockedCategories from "./BlockedCategories";

import { Lock, Book, MessageSquare, Zap } from 'react-feather';

import './TopNavigator.scss';
import FeatureFlags from "../FeatureFlags";

interface TopNavigatorProps {
	initialRoute?: string;
}

const TopNavigator: React.FC<TopNavigatorProps> = ({ initialRoute = '/blocked-sites' }) => {
	return (
		<Router>
			<Navbar expand="md">
				<Container>
					<Navbar.Brand as={Link} to="/" style={{height: 40}} className={"me-5"}>
						<img style={{height: 40}} src="../assets/icon-128.png"/>
						<span className="brand-name text-primary">ShieldBug</span>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto">
							<Nav.Link as={Link} to="/">Block sites</Nav.Link>
							{FeatureFlags.BlockKeywords && <Nav.Link as={Link} to="/blocked-keywords">Block keywords</Nav.Link>}
							{FeatureFlags.BlockCategories && <Nav.Link as={Link} to="/blocked-categories">Block categories</Nav.Link>}
							{FeatureFlags.WeirdStuff && <Nav.Link as={Link} to="/weird-stuff">Weird stuff</Nav.Link>}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>

			<Container>
				<Routes>
					<Route path="*" element={<BlockedSites />} />
					<Route path="/blocked-keywords" element={<BlockedKeywords/>} />
					<Route path="/blocked-categories" element={<BlockedCategories />} />
					<Route path="/weird-stuff" element={<WeirdStuff />} />
				</Routes>
			</Container>
		</Router>
	);
};

export default TopNavigator;
