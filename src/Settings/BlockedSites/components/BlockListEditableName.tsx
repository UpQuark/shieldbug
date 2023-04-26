import * as React from "react";
import {FormControl, InputGroup} from "react-bootstrap";
import {BiPencil} from "react-icons/all";
import {BlockList} from "../BlockedSitesTypes";

interface IEditableBlockListNameProps {
	blockLists: BlockList[],
	setBlockLists: React.Dispatch<React.SetStateAction<BlockList[]>>,
	list: BlockList,
	index: number
}

/**
 * Editable block list name on click
 * @param blockLists
 * @param setBlockLists
 * @param list
 * @param index
 * @constructor
 */
const BlockListEditableName: React.FC<IEditableBlockListNameProps> = ({blockLists, setBlockLists, list, index}) => {
	const [editingListName, setEditingListName] = React.useState<number | null>(null);

	return (
				<>
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
				</>
		)
}

export default BlockListEditableName;