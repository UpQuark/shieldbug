import * as React from 'react';
import {Row, Col, Container, Nav} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import WeirdStuff from './WeirdStuff';
import BlockedSites from "./BlockedSites";
import BlockedKeywords from "./BlockedKeywords";
import BlockedCategories from "./BlockedCategories";

import './LeftNavigator.scss';
import FeatureFlags from "../FeatureFlags";

interface LeftNavigatorProps {
	initialRoute?: string;
}

const LeftNavigator: React.FC<LeftNavigatorProps> = ({ initialRoute = '/blocked-sites' }) => {
	return (
		<Router>
			<Container fluid>
				<Row>
					<Col xs={3} md={2} className="left-sidebar">
						<Link to="/" className="navbar-brand">
							<img style={{ height: 40 }} src="../assets/icon-128.png" />
							<span className="brand-name text-primary">ShieldBug</span>
						</Link>
						<Nav className="flex-column">
							<Nav.Link as={Link} to="/">Block sites</Nav.Link>
							{FeatureFlags.BlockKeywords && <Nav.Link as={Link} to="/blocked-keywords">Block keywords</Nav.Link>}
							{FeatureFlags.BlockCategories && <Nav.Link as={Link} to="/blocked-categories">Block categories</Nav.Link>}
							{FeatureFlags.WeirdStuff && <Nav.Link as={Link} to="/weird-stuff">Weird stuff</Nav.Link>}
						</Nav>
					</Col>
					<Col xs={9} md={10}>
						<Container style={{padding: 24}}>
							<Routes>
								<Route path="*" element={<BlockedSites />} />
								<Route path="/blocked-keywords" element={<BlockedKeywords />} />
								<Route path="/blocked-categories" element={<BlockedCategories />} />
								<Route path="/weird-stuff" element={<WeirdStuff />} />
							</Routes>
						</Container>
					</Col>
				</Row>
			</Container>
		</Router>
	);
};

export default LeftNavigator;
