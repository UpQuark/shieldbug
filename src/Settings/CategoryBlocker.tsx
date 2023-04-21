import * as React from "react";
import { Form } from 'react-bootstrap';
import {BiNews, BiNetworkChart, BiShoppingBag} from "react-icons/all";

const categories = [
	{ label: 'News', value: 'news', icon: <BiNews/>},
	{ label: 'Social Media', value: 'social_media', icon: <BiNetworkChart/>},
	{ label: 'Shopping', value: 'shopping', icon: <BiShoppingBag/>},
	// Add more categories here
];

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
			{categories.map((category) => (
				<Form.Check
					key={category.value}
					type="switch"
					id={`category-${category.value}`}
					label={<span style={{fontWeight: "600"}} className={"text-secondary"}>{category.icon} {category.label}</span>}
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
