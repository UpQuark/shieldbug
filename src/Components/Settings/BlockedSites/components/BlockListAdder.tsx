import * as React from 'react';
import {Button, FormControl, Grid, TextField, InputAdornment, Box, Paper} from "@mui/material";
import {useState} from "react";
import {BlockList} from "../BlockedSitesTypes";
import {Block} from "@mui/icons-material";

interface IBlockListAdderProps {
	list: BlockList,
	blockUrl: (event: React.FormEvent, listId: string, inputUrl?: string) => void
}

/**
 * Form to add a new URL to a blocklist
 * @param list
 * @param blockUrl
 * @constructor
 */
const BlockListAdder: React.FC<IBlockListAdderProps> = ({list, blockUrl}) => {
	const [urlInput, setUrlInput] = useState<string>('');

	return (
		<Paper 
			elevation={0} 
			sx={{
				p: 2,
				mb: 2, 
				border: '1px solid',
				borderColor: 'divider',
				borderRadius: 1,
			}}
		>
			<form onSubmit={(event) => {
				blockUrl(event, list.id, urlInput);
				setUrlInput('');
			}}>
				<Grid container spacing={1}>
					<Grid item xs={10} md={11}>
						<FormControl
							fullWidth
						>
							<TextField
								size="medium"
								label="Enter website to block"
								value={urlInput}
								onChange={(e) => setUrlInput(e.target.value)}
								placeholder="example.com"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											https://
										</InputAdornment>
									),
								}}
								sx={{
									'& .MuiOutlinedInput-root': {
										borderTopRightRadius: 0,
										borderBottomRightRadius: 0,
									}
								}}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={2} md={1} style={{ display: "flex" }}>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							aria-label={"Block URL"}
							sx={{
								borderTopLeftRadius: 0,
								borderBottomLeftRadius: 0,
								width: "100%",
								height: "100%",
								minHeight: "56px",
								boxShadow: "none",
							}}
						>
							<Block />
						</Button>
					</Grid>
				</Grid>
			</form>
		</Paper>
	);
};

export default BlockListAdder;