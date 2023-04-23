import * as React from 'react';
import UrlBlocker from '../Settings/UrlBlocker/UrlBlocker';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../styles/CustomTheme.scss'
import CategoryBlocker from "../Settings/CategoryBlocker";

const PopupApp: React.FC = () => {
	const openSettingsPage = () => {
		chrome.runtime.openOptionsPage();
	};

	return (
		<Container style={{ width: 400, padding: 12 }}>
			<Row style={{marginBottom: 12}}>
				<Col xs="auto">
					<img
						src={chrome.runtime.getURL('assets/icon-128.png')}
						alt="Shieldbug"
						style={{ height: 35 }}
						className={"flex"}
					/>
				</Col>
				<Col>
					<h3 className={"text-primary"} style={{marginLeft: -18, marginTop: 4}}>ShieldBug</h3>
				</Col>
				<Col className="d-flex justify-content-end">
					<Button
						onClick={openSettingsPage}
						variant="secondary"
						style={{
							backgroundColor: 'transparent',
							border: 'none',
							padding: 0,
						}}
					>
						<i className="bi bi-gear-fill" style={{ fontSize: '1.5rem', color: "#bbb" }}></i>
					</Button>
				</Col>
			</Row>
			<UrlBlocker />
			<div style={{marginBottom: 20}}></div>
			<CategoryBlocker />
		</Container>
	);
};

export default PopupApp;
