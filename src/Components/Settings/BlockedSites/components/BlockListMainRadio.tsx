import {FormCheck, OverlayTrigger, Tooltip} from "react-bootstrap";
import * as React from "react";
import {BlockList} from "../BlockedSitesTypes";

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
	)
}

export default BlockListMainRadio;