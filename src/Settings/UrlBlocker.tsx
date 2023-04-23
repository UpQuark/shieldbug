import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
	Button,
	Container,
	Form,
	InputGroup,
	ListGroup,
	Row,
	Col,
	FormControl,
	FormCheck, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import {useEffect, useState} from "react";
import { BiPencil } from 'react-icons/all';


interface BlockList {
	id: string;
	name: string;
	urls: string[];
	active: boolean;
}

const UrlBlocker: React.FC = () => {
	const [blockLists, setBlockLists] = useState<BlockList[]>([
		{ id: 'main', name: 'Main', urls: [], active: true },
	]);
	const [urlInput, setUrlInput] = useState<string>('');
	const [canBlockCurrentSite, setCanBlockCurrentSite] = useState<boolean>(false);
	const [currentSite, setCurrentSite] = useState<string>('');
	const [editingListName, setEditingListName] = useState<number | null>(null);

	useEffect(() => {
		chrome.storage.local.get('blockLists', (data: { blockLists?: any[] }) => {
			setBlockLists(data.blockLists || [{ id: 'main', name: 'Main', urls: [], active: true }]);
		});
	}, []);

	const getFaviconUrl = (url: string) => {
		try {
			const { protocol, hostname } = new URL(`https://${url}`);
			return `${protocol}//${hostname}/favicon.ico`;
		} catch (error) {
			console.error('Error getting favicon URL:', error);
			return '';
		}
	};

	const updateBlockLists = (updatedBlockLists: any[]) => {
		chrome.storage.local.set({ blockLists: updatedBlockLists }, () => {
			setBlockLists(updatedBlockLists);
		});
	};

	const deleteUrl = (listId: string, urlToDelete: string) => {
		const updatedBlockLists = blockLists.map((list) => {
			if (list.id === listId) {
				return { ...list, urls: list.urls.filter((url: string) => url !== urlToDelete) };
			}
			return list;
		});
		updateBlockLists(updatedBlockLists);
	};

	const handleSubmit = (event: React.FormEvent, listId: string) => {
		event.preventDefault();

		let url = urlInput;
		if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
		const mainDomain = new URL(url).hostname.split('.').slice(-2).join('.');
		const updatedBlockLists = blockLists.map((list) => {
			if (list.id === listId && !list.urls.includes(mainDomain)) {
				return { ...list, urls: [...list.urls, mainDomain] };
			}
			return list;
		});

		updateBlockLists(updatedBlockLists);
		setUrlInput('');
	};

	const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const updatedBlockLists = blockLists.map((list) => ({
			...list,
			active: list.id === event.target.value,
		}));
		updateBlockLists(updatedBlockLists);
	};

	const addNewBlockList = () => {
		const newListId = `list-${new Date().getTime()}`;
		const updatedBlockLists = [
			...blockLists,
			{ id: newListId, name: `List ${blockLists.length + 1}`, urls: [], active: false },
		];
		setBlockLists(updatedBlockLists);
	};

	useEffect(() => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const currentTab = tabs[0];
			const pageUrl = currentTab.url;
			if (pageUrl?.startsWith('http')) {
				setCanBlockCurrentSite(true);
				setCurrentSite(pageUrl);
			}
			console.log('Current page URL:', pageUrl);
		});
	}, []);

	return (
		<Container style={{ paddingLeft: 0 }}>
			{canBlockCurrentSite && (
				<Button className={'text-white w-100 my-2'} onClick={(event) => handleSubmit(event, 'main')}>
					Block current site
				</Button>
			)}
			{blockLists.map((list, index) => (
				<div key={list.id} className="mb-5">
					<Row className="mb-2">
						<Col>
							{editingListName === index ? (
								<InputGroup>
									<FormControl
										type="text"
										value={list.name}
										onChange={(e) => {
											const updatedBlockLists = [...blockLists];
											updatedBlockLists[index].name = e.target.value;
											setBlockLists(updatedBlockLists);
										}}
										onBlur={() => setEditingListName(null)}
										autoFocus
									/>
								</InputGroup>
							) : (
								<div
									style={{ cursor: 'pointer' }}
									onClick={() => setEditingListName(index)}
								>
									<BiPencil className="me-2 text-primary" />
									{list.name}
								</div>
							)}
						</Col>
						<Col xs="auto">
							<OverlayTrigger
								key="main-tooltip"
								placement="top"
								overlay={
									<Tooltip id={`tooltip-main`}>
										Some example text
									</Tooltip>
								}
							>
								<FormCheck
									type="radio"
									name="mainList"
									checked={list.active}
									value={list.id}
									onChange={handleRadioChange}
									label="Main"
								/>
							</OverlayTrigger>
						</Col>
					</Row>
					<Form onSubmit={(event) => handleSubmit(event, list.id)} className="mb-3">
						<InputGroup>
							<Form.Control
								type="text"
								value={urlInput}
								onChange={(e) => setUrlInput(e.target.value)}
								placeholder="Enter URL to block"
							/>
							<Button type="submit" variant="primary" className={'text-white'}>
								Block website
							</Button>
						</InputGroup>
					</Form>
					<ListGroup>
						{list.urls.map((url) => (
							<ListGroup.Item key={url} className="d-flex justify-content-between align-items-center">
								<img
									src={getFaviconUrl(url)}
									alt={`Favicon for ${url}`}
									width="16"
									height="16"
									className="me-2"
								/>
								{url}
								<Button onClick={() => deleteUrl(list.id, url)} variant="outline-danger" size="sm">
									Delete
								</Button>
							</ListGroup.Item>
						))}
					</ListGroup>
				</div>
			))}
			<Button className="w-100 my-2 text-white" onClick={addNewBlockList}>
				Add New Block List
			</Button>
		</Container>
	);
};

export default UrlBlocker;

