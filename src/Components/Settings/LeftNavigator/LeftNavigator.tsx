import * as React from 'react';
import { Link } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material';
import { Schedule, Block, CalendarViewWeek, Lightbulb, Search, Lock, LockClock } from "@mui/icons-material";

import DeveloperFeatureFlags from "../../../Flags/DeveloperFeatureFlags";

interface LeftNavigatorProps {
	initialRoute?: string;
}

const LeftNavigator: React.FC<LeftNavigatorProps> = ({initialRoute = '/blocked-sites'}) => {
	const theme = useTheme();
	
	// Common styles as objects
	const listItemButtonStyles = {
		padding: '10px 15px',
		'&:hover': {
			backgroundColor: 'rgba(255, 255, 255, 0.08)'
		}
	};
	
	const listItemIconStyles = {
		minWidth: 40,
		color: 'white'
	};
	
	const listItemTextStyles = {
		fontSize: '1.1rem',
		fontWeight: 500,
		color: 'white'
	};

	return (
		<Box 
			sx={{
				backgroundColor: theme.palette.mode === 'light' ? 'primary.main' : 'background.paper',
				height: '100vh',
				borderRight: 1,
				borderColor: 'divider',
				paddingTop: 2.5,
				display: 'flex',
				flexDirection: 'column',
				width: 261,
				minWidth: 261,
				maxWidth: 261,
				position: 'fixed',
				top: 0,
				left: 0,
				overflowY: 'auto',
				zIndex: 1000,
				flex: '0 0 261px',
				boxSizing: 'border-box'
			}}
		>
			<Link to="/" style={{ textDecoration: 'none' }}>
				<Box sx={{ display: 'flex', alignItems: 'center', padding: 0 }}>
					<img
						style={{
							height: 40,
							filter: "drop-shadow(0px 0px 7px rgba(0, 0, 0, 0.6))"
						}}
						src="../../assets/icon-128.png"
						alt="ShieldBug Logo"
					/>
					<Typography 
						sx={{
							marginLeft: 1.25,
							fontSize: '1.5rem',
							color: 'white',
							fontFamily: 'Quicksand',
							fontWeight: 700
						}}
					>
						ShieldBug
					</Typography>
				</Box>
			</Link>
			
			<Box sx={{ flexGrow: 1, mt: 2 }}>
				<List sx={{ padding: 0 }}>
					<ListItem disablePadding>
						<ListItemButton 
							component={Link} 
							to="/"
							sx={listItemButtonStyles}
						>
							<ListItemIcon sx={listItemIconStyles}>
								<Block />
							</ListItemIcon>
							<ListItemText 
								primary="Block sites" 
								primaryTypographyProps={{ sx: listItemTextStyles }} 
							/>
						</ListItemButton>
					</ListItem>
					
					{DeveloperFeatureFlags.BlockKeywords && (
						<ListItem disablePadding>
							<ListItemButton 
								component={Link} 
								to="/blocked-keywords"
								sx={listItemButtonStyles}
							>
								<ListItemIcon sx={listItemIconStyles}>
									<Search />
								</ListItemIcon>
								<ListItemText 
									primary="Block keywords" 
									primaryTypographyProps={{ sx: listItemTextStyles }} 
								/>
							</ListItemButton>
						</ListItem>
					)}
					
					{DeveloperFeatureFlags.Schedule && (
						<ListItem disablePadding>
							<ListItemButton 
								component={Link} 
								to="/schedule"
								sx={listItemButtonStyles}
							>
								<ListItemIcon sx={listItemIconStyles}>
									<LockClock />
								</ListItemIcon>
								<ListItemText 
									primary="Schedule" 
									primaryTypographyProps={{ sx: listItemTextStyles }} 
								/>
							</ListItemButton>
						</ListItem>
					)}
					
					{DeveloperFeatureFlags.Commitment && (
						<ListItem disablePadding>
							<ListItemButton 
								component={Link} 
								to="/commitment"
								sx={listItemButtonStyles}
							>
								<ListItemIcon sx={listItemIconStyles}>
									<Lock />
								</ListItemIcon>
								<ListItemText 
									primary="Commitment" 
									primaryTypographyProps={{ sx: listItemTextStyles }} 
								/>
							</ListItemButton>
						</ListItem>
					)}
				</List>
			</Box>
			
			<Box sx={{ mb: 2.5, display: 'flex', flexDirection: 'column' }}>
				{DeveloperFeatureFlags.WeirdStuff && (
					<ListItem disablePadding>
						<ListItemButton 
							component={Link} 
							to="/weird-stuff"
							sx={listItemButtonStyles}
						>
							<ListItemIcon sx={listItemIconStyles}>
								<Lightbulb />
							</ListItemIcon>
							<ListItemText 
								primary="Extra Settings" 
								primaryTypographyProps={{ sx: listItemTextStyles }} 
							/>
						</ListItemButton>
					</ListItem>
				)}
				
				<ListItem disablePadding>
					<ListItemButton 
						component="a" 
						href="https://shieldbug.app" 
						target="_blank"
						sx={listItemButtonStyles}
					>
						<ListItemText 
							primary="About" 
							primaryTypographyProps={{ sx: listItemTextStyles }} 
						/>
					</ListItemButton>
				</ListItem>
				
				<ListItem disablePadding>
					<ListItemButton 
						component="a" 
						href="mailto:info@shieldbug.com?subject=Shieldbug feedback"
						sx={listItemButtonStyles}
					>
						<ListItemText 
							primary="Feedback" 
							primaryTypographyProps={{ sx: listItemTextStyles }} 
						/>
					</ListItemButton>
				</ListItem>
			</Box>
		</Box>
	);
};

export default LeftNavigator;
