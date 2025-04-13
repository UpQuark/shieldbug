import * as React from 'react';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { CategoryTypes } from './CategoryTypes';

interface CategoryBlockerProps {
	blockedCategories: string[];
	onCategoryToggle: (category: string, checked: boolean) => void;
}

const CategoryBlocker: React.FC<CategoryBlockerProps> = ({ blockedCategories, onCategoryToggle }) => {
	return (
		<FormGroup>
			{CategoryTypes.map((category) => (
				<FormControlLabel
					key={category.value}
					control={
						<Switch
							checked={blockedCategories.includes(category.value)}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								onCategoryToggle(category.value, e.target.checked)
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
