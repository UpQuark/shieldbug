import * as React from 'react';
import UrlBlocker from "./UrlBlocker";
import { Form } from 'react-bootstrap';

const categories = [
	{ label: 'News', value: 'news' },
	{ label: 'Social Media', value: 'social_media' },
	{ label: 'Shopping', value: 'shopping' },
	// Add more categories here
];

const BlockedSites: React.FC = () => {
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
		<div>
			<h1>Blocked Categories</h1>
			<p>Block entire categories of distraction all at once!</p>

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

			<h1>Blocked Sites</h1>
			<p>
				You can block individual sites using ShieldBug.
			</p>
			<UrlBlocker />
		</div>
	);
};

export default BlockedSites;
