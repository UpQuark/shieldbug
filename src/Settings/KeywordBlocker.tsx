import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, FormControl, Grid, TextField, List, ListItem, ListItemSecondaryAction, IconButton, ListItemText } from '@mui/material';
import { Delete, Block } from '@mui/icons-material';

const KeywordBlocker: React.FC = () => {
	const [blockedKeywords, setBlockedKeywords] = useState<string[]>([]);
	const [keywordInput, setKeywordInput] = useState<string>('');

	useEffect(() => {
		chrome.storage.sync.get('blockedKeywords', (data: { blockedKeywords?: string[] }) => {
			setBlockedKeywords(data.blockedKeywords || []);
		});
	}, []);

	const updateBlockedKeywordsList = (updatedBlockedKeywords: string[]) => {
		setBlockedKeywords(updatedBlockedKeywords);
	};

	const deleteKeyword = (keywordToDelete: string) => {
		const updatedBlockedKeywords = blockedKeywords.filter((keyword) => keyword !== keywordToDelete);
		chrome.storage.sync.set({ blockedKeywords: updatedBlockedKeywords }, () => {
			updateBlockedKeywordsList(updatedBlockedKeywords);
		});
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const newBlockedKeywords = [...blockedKeywords, keywordInput].filter((kw, idx, arr) => arr.indexOf(kw) === idx);

		if (!blockedKeywords.includes(keywordInput)) {
			chrome.storage.sync.set({ blockedKeywords: newBlockedKeywords }, () => {
				updateBlockedKeywordsList(newBlockedKeywords);
			});
		}
		setKeywordInput('');
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<Grid container spacing={0}>
					<Grid item xs={10} md={11}>
						<FormControl fullWidth className={"no-right-border-rounding"}>
							<TextField
								size="small"
								label="Enter keyword to block"
								value={keywordInput}
								onChange={(e) => setKeywordInput(e.target.value)}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={2} md={1} style={{ display: "flex" }}>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							aria-label="Block keyword"
							sx={{
								borderTopLeftRadius: 0,
								borderBottomLeftRadius: 0,
								width: "100%",
								height: 40,
								left: -1,
								boxShadow: "none",
							}}
						>
							<Block />
						</Button>
					</Grid>
				</Grid>
			</form>
			<List>
				{blockedKeywords.map((keyword, index) => (
					<ListItem key={keyword + index} dense>
						<ListItemText primary={keyword} />
						<ListItemSecondaryAction>
							<IconButton edge="end" aria-label="delete" onClick={() => deleteKeyword(keyword)}>
								<Delete />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
			</List>
		</>
	);
};

export default KeywordBlocker;
