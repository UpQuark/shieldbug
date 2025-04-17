import * as React from 'react';
import {Button, FormControl, Grid, TextField} from "@mui/material";
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
		<form onSubmit={(event) => {
			blockUrl(event, list.id, urlInput);
			setUrlInput('');
		}}>
			<Grid container spacing={0}>
				<Grid item xs={10} md={11}>
					<FormControl
						fullWidth
						className={"no-right-border-rounding"}
					>
						<TextField
							size="small"
							label="Enter website to block"
							value={urlInput}
							onChange={(e) => setUrlInput(e.target.value)}
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
							height: 40,
							left: -1,
							boxShadow: "none",
					}}
					>
						<Block/>
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};


export default BlockListAdder;