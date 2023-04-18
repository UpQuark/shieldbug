import * as React from "react";
import { Form } from 'react-bootstrap';

const categories = [
	{ label: 'News', value: 'news' },
	{ label: 'Social Media', value: 'social_media' },
	{ label: 'Shopping', value: 'shopping' },
	// Add more categories here
];

const CategoryBlocker: React.FC = () => {
	const [blockedCategories, setBlockedCategories] = React.useState<string[]>([]);

	const handleCategoryToggle = (category: string, checked: boolean) => {
		let updatedBlockedCategories;

		if (checked) {
			updatedBlockedCategories = [...blockedCategories, category];
		} else {
			updatedBlockedCategories = blockedCategories.filter((c) => c !== category);
		}

		setBlockedCategories(updatedBlockedCategories);
	};

	return (
		<Form>
			{categories.map((category) => (
				<Form.Check
					key={category.value}
					type="switch"
					id={`category-${category.value}`}
					label={category.label}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						handleCategoryToggle(category.value, e.target.checked)
					}
				/>
			))}
		</Form>
	);
};

export default CategoryBlocker;