import * as React from 'react';
import { FormControlLabel, FormGroup, Switch, Paper, Typography, Box } from '@mui/material';
import { CategoryTypes } from './CategoryTypes';

interface CategoryBlockerProps {
	blockedCategories: string[];
	onCategoryToggle: (category: string, checked: boolean) => void;
	showPaper?: boolean;
	showTitle?: boolean;
	title?: string;
}

const CategoryBlocker: React.FC<CategoryBlockerProps> = ({ 
	blockedCategories, 
	onCategoryToggle, 
	showPaper = true, 
	showTitle = true,
	title = "Blocked Categories"
}) => {
	const content = (
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
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
								{category.icon}
							</Box>
							<Typography variant="body1">
								{category.label}
							</Typography>
						</Box>
					}
					sx={{ 
						marginBottom: '1rem',
						alignItems: 'center',
						'& .MuiSwitch-root': {
							marginRight: 1
						}
					}}
				/>
			))}
		</FormGroup>
	);

	if (!showPaper) {
		return (
			<>
				{showTitle && (
					<Typography variant="h5" gutterBottom>
						{title}
					</Typography>
				)}
				{content}
			</>
		);
	}

	return (
		<Paper elevation={3} sx={{ p: 3 }}>
			{showTitle && (
				<Typography variant="h5" gutterBottom>
					{title}
				</Typography>
			)}
			{content}
		</Paper>
	);
};

export default CategoryBlocker;
