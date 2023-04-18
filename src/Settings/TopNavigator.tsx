// TopNavigator.tsx
import * as React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import WeirdStuff from './WeirdStuff';
import BlockedSites from "./BlockedSites";

interface TopNavigatorProps {
	initialRoute?: string;
}

const RootRedirect: React.FC<{ to: string }> = ({ to }) => {
	const navigate = useNavigate();
	React.useEffect(() => {
		navigate(to);
	}, [navigate, to]);

	return null;
};

const TopNavigator: React.FC<TopNavigatorProps> = ({ initialRoute = '/blocked-sites' }) => {
	return (
		<Router>
			<Navbar bg="light" expand="lg">
				<Container>
					<Navbar.Brand as={Link} to="/" style={{height: 40}}>
						<img style={{height: 40}} src="../assets/icon-128.png"/>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto">
							<Nav.Link as={Link} to="/">Blocked Sites</Nav.Link>
							<Nav.Link as={Link} to="/weird-stuff">Weird Stuff</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>

			<Container>
				<Routes>
					<Route path="*" element={<BlockedSites />} />
					<Route path="/weird-stuff" element={<WeirdStuff />} />
				</Routes>
			</Container>
		</Router>
	);
};

export default TopNavigator;
