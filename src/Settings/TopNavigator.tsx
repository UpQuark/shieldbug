// TopNavigator.tsx
import * as React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import WeirdStuff from './WeirdStuff';
import BlockedSites from "./BlockedSites";

const TopNavigator: React.FC = () => {
	return (
		<Router>
			<Navbar bg="light" expand="lg">
				<Container>
					<Navbar.Brand as={Link} to="/" style={{height: 60}}><img style={{height: 60}} src="../assets/icon-128.png"/></Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto">
							<Nav.Link as={Link} to="/blocked-sites">Blocked Sites</Nav.Link>
							<Nav.Link as={Link} to="/weird-stuff">Weird Stuff</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>

			<Container>
				<Routes>
					{/*<Route path="/blocked-sites" element={<BlockedSites />} />*/}
					{/*<Route path="/settings" element={<Settings />} />*/}
					<Route path="/weird-stuff" element={<WeirdStuff />} />
					<Route path="/blocked-sites" element={<BlockedSites />} />
					{/*<Route path="/account" element={<Account />} />*/}
				</Routes>
			</Container>
		</Router>
	);
};

export default TopNavigator;