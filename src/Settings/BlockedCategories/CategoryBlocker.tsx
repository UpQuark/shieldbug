import * as React from "react";
import { Form } from 'react-bootstrap';
import {BiNews, BiNetworkChart, BiShoppingBag, BiVideo} from "react-icons/all";
import {CategoryTypes} from "./CategoryTypes";



const CategoryBlocker: React.FC = () => {
	const [blockedCategories, setBlockedCategories] = React.useState<string[]>([]);

	React.useEffect(() => {
		chrome.storage.local.get('blockedCategories', (data: { blockedCategories?: string[] }) => {
			setBlockedCategories(data.blockedCategories || []);
		});
	}, []);

	const handleCategoryToggle = (category: string, checked: boolean) => {
		let updatedBlockedCategories: any;

		if (checked) {
			updatedBlockedCategories = [...blockedCategories, category];
		} else {
			updatedBlockedCategories = blockedCategories.filter((c) => c !== category);
		}

		chrome.storage.local.set({ blockedCategories: updatedBlockedCategories }, () => {
			setBlockedCategories(updatedBlockedCategories);
		});
	};

	return (
		<Form>
			{CategoryTypes.map((category) => (
				<Form.Check
					key={category.value}
					type="switch"
					id={`category-${category.value}`}
					label={<>
						<span style={{fontWeight: "500"}} className={"text-primary"}>{category.icon} </span>
						<span style={{fontWeight: "500"}} className={"text-secondary"}>{category.name}</span>
					</>}
					checked={blockedCategories.includes(category.value)}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						handleCategoryToggle(category.value, e.target.checked)
					}
					style={{marginBottom: "1rem"}}
				/>
			))}
		</Form>
	);
};

export default CategoryBlocker;
