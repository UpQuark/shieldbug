import * as React from 'react';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { CategoryTypes } from './CategoryTypes';

const CategoryBlocker: React.FC = () => {
	const [blockedCategories, setBlockedCategories] = React.useState<string[]>([]);

	React.useEffect(() => {
		chrome.storage.sync.get('blockedCategories', (data: { blockedCategories?: string[] }) => {
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

		chrome.storage.sync.set({ blockedCategories: updatedBlockedCategories }, () => {
			setBlockedCategories(updatedBlockedCategories);
		});
	};

	return (
		<FormGroup>
			{CategoryTypes.map((category) => (
				<FormControlLabel
					key={category.value}
					control={
						<Switch
							checked={blockedCategories.includes(category.value)}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								handleCategoryToggle(category.value, e.target.checked)
							}
						/>
					}
					label={
						<>
              <span style={{ fontWeight: '500' }} className={'text-primary'}>
                {category.icon}{' '}
              </span>
							<span style={{ fontWeight: '500' }} className={'text-secondary'}>
                {category.label}
              </span>
						</>
					}
					style={{ marginBottom: '1rem' }}
				/>
			))}
		</FormGroup>
	);
};

export default CategoryBlocker;
