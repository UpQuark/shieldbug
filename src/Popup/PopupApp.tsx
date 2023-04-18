import * as React from 'react';
import UrlBlocker from '../Settings/UrlBlocker';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PopupApp: React.FC = () => {
	const openSettingsPage = () => {
		chrome.runtime.openOptionsPage();
	};

	return (
		<Container style={{ width: 400, padding: 12 }}>
			<Row>
				<Col xs="auto">
					<img
						src={chrome.runtime.getURL('assets/icon-128.png')}
						alt="Shieldbug"
						style={{ height: 35 }}
					/>
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
		</Container>
	);
};

export default PopupApp;
