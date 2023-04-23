import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { Button, Container, Form, InputGroup, ListGroup } from 'react-bootstrap';

const KeywordBlocker: React.FC = () => {
	const [blockedKeywords, setBlockedKeywords] = useState<string[]>([]);
	const [keywordInput, setKeywordInput] = useState<string>('');

	useEffect(() => {
		chrome.storage.local.get('blockedKeywords', (data: { blockedKeywords?: string[] }) => {
			setBlockedKeywords(data.blockedKeywords || []);
		});
	}, []);

	const updateBlockedKeywordsList = (updatedBlockedKeywords: string[]) => {
		setBlockedKeywords(updatedBlockedKeywords);
	};

	const deleteKeyword = (keywordToDelete: string) => {
		const updatedBlockedKeywords = blockedKeywords.filter((keyword) => keyword !== keywordToDelete);
		chrome.storage.local.set({ blockedKeywords: updatedBlockedKeywords }, () => {
			updateBlockedKeywordsList(updatedBlockedKeywords);
		});
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		const newBlockedKeywords = [...blockedKeywords, keywordInput];

		if (!blockedKeywords.includes(keywordInput)) {
			chrome.storage.local.set({ blockedKeywords: newBlockedKeywords }, () => {
				updateBlockedKeywordsList(newBlockedKeywords);
			});
		}
		setKeywordInput('');
	};

	return (
		<Container fluid>
			<Form onSubmit={handleSubmit} className="mb-3">
				<InputGroup>
					<Form.Control
						type="text"
						value={keywordInput}
						onChange={(e) => setKeywordInput(e.target.value)}
						placeholder="Enter keyword to block"
					/>
					<Button type="submit" variant="primary" className={"text-white"}>
						Block keyword
					</Button>
				</InputGroup>
			</Form>
			<ListGroup>
				{blockedKeywords.map((keyword) => (
					<ListGroup.Item key={keyword} className="d-flex justify-content-between align-items-center">
						{keyword}
						<Button onClick={() => deleteKeyword(keyword)} variant="outline-danger" size="sm">
							Delete
						</Button>
					</ListGroup.Item>
				))}
			</ListGroup>
		</Container>
	);
};

export default KeywordBlocker;
