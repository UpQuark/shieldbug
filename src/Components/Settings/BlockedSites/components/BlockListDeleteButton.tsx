import * as React from "react";
import {Button} from "react-bootstrap";
import {Delete} from"@mui/icons-material";
import {useState} from "react";
import {BlockList} from "../BlockedSitesTypes";

interface IBlockListDeleteButtonProps {
	list: BlockList
	blockLists: BlockList[],
	updateBlockLists: (updatedBlockLists: any[]) => void
}

/**
 * Button to delete a blocklist
 * @param list
 * @param blockLists
 * @param updateBlockLists
 * @constructor
 */
const BlockListDeleteButton: React.FC<IBlockListDeleteButtonProps> = ({list, blockLists, updateBlockLists}) => {
	const [listToDelete, setListToDelete] = useState<string | null>(null);

	const deleteList = (listId: string, confirm: boolean) => {
		if (confirm) {
			const updatedBlockLists = blockLists.filter(list => list.id !== listId);
			updateBlockLists(updatedBlockLists);
			setListToDelete(null);
		} else {
			setListToDelete(listId);
		}
	};

	return (
		<>
			{listToDelete === list.id ? (
				<Button
					variant="danger"
					size="sm"
					className="ms-2"
					onClick={() => deleteList(list.id, true)}
				>
					Confirm
				</Button>
			) : (
				<Button
					variant="outline-danger"
					size="sm"
					className="ms-2"
					onClick={() => deleteList(list.id, false)}
				>
					<Delete />
				</Button>
			)}
		</>
	)
}

export default BlockListDeleteButton;