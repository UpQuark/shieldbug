import * as React from "react";

import { Edit } from "@mui/icons-material";
import { BlockList } from "../BlockedSitesTypes";
import {IconButton, TextField} from "@mui/material";

interface IEditableBlockListNameProps {
	blockLists: BlockList[];
	setBlockLists: React.Dispatch<React.SetStateAction<BlockList[]>>;
	list: BlockList;
	index: number;
}

/**
 * Editable block list name on click
 * @param blockLists
 * @param setBlockLists
 * @param list
 * @param index
 * @constructor
 */
const BlockListEditableName: React.FC<IEditableBlockListNameProps> = ({
	                                                                      blockLists,
	                                                                      setBlockLists,
	                                                                      list,
	                                                                      index,
                                                                      }) => {
	const [editingListName, setEditingListName] = React.useState<number | null>(
		null
	);

	return (
		<>
			{editingListName === index ? (
				<TextField
					type="text"

					variant={"filled"}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						const updatedBlockLists = [...blockLists];
						updatedBlockLists[index].name = e.target?.value;
						setBlockLists(updatedBlockLists);
					}}
					onBlur={() => setEditingListName(null)}
					autoFocus
					fullWidth
				/>
			) : (
				<div
					style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
					onClick={(e: React.MouseEvent<HTMLDivElement>) => setEditingListName(index)}
				>
					<IconButton
						className="me-2 text-primary"
						size="small"
					>
						<Edit />
					</IconButton>
					{list.name}
				</div>
			)}
		</>
	);
};

export default BlockListEditableName;
