import * as React from "react";
import { Radio, FormControlLabel, Tooltip } from "@mui/material";
import { BlockList } from "../BlockedSitesTypes";

interface IBlockListMainRadioProps {
	list: BlockList
	blockLists: BlockList[],
	updateBlockLists: (updatedBlockLists: any[]) => void
}

/**
 * Radio button for selecting the main block list
 * @param list
 * @param blockLists
 * @param updateBlockLists
 * @constructor
 */
const BlockListMainRadio: React.FC<IBlockListMainRadioProps> = ({list, blockLists, updateBlockLists}) => {

	const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const updatedBlockLists = blockLists.map((list) => ({
			...list,
			active: list.id === event.target.value,
		}));
		updateBlockLists(updatedBlockLists);
	};

	return (
		<Tooltip title="Some example text" placement="top">
			<FormControlLabel
				control={
					<Radio
						checked={list.active}
						value={list.id}
						onChange={handleRadioChange}
						name="mainList"
						size="small"
					/>
				}
				label="Main"
			/>
		</Tooltip>
	)
}

export default BlockListMainRadio;