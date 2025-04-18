import * as React from 'react';
import {Button, FormControl, Grid, TextField, InputAdornment, Box, Typography, Divider} from "@mui/material";
import {useState} from "react";
import {BlockList} from "../BlockedSitesTypes";
import {Block, Add} from "@mui/icons-material";

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
		<Box sx={{ mb: 3 }}>
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
				<Typography 
					variant="h6" 
					color="secondary.main" 
					sx={{ 
						fontSize: '0.95rem', 
						fontWeight: 600,
						textTransform: 'uppercase',
						letterSpacing: '0.5px'
					}}
				>
					Add a website to block
				</Typography>
				<Divider sx={{ flexGrow: 1, ml: 2 }} />
			</Box>
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
								size="small"
								placeholder="example.com"
								value={urlInput}
								onChange={(e) => setUrlInput(e.target.value)}
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
										backgroundColor: theme => theme.palette.background.paper,
										boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
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
							aria-label="Add URL to block list"
							sx={{
								borderTopLeftRadius: 0,
								borderBottomLeftRadius: 0,
								width: "100%",
								boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
							}}
						>
							<Add />
						</Button>
					</Grid>
				</Grid>
			</form>
		</Box>
	);
};

export default BlockListAdder;