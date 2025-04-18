import * as React from 'react';
import { Link } from 'react-router-dom';
import { 
	Box, 
	List, 
	ListItem, 
	ListItemButton, 
	ListItemIcon, 
	ListItemText, 
	Typography, 
	useTheme,
	Divider
} from '@mui/material';
import { 
	Schedule, 
	Block, 
	Lightbulb, 
	Search, 
	Lock, 
	LockClock,
	Info,
	Feedback,
	VpnKey
} from "@mui/icons-material";

import DeveloperFeatureFlags from "../../../Flags/DeveloperFeatureFlags";

interface LeftNavigatorProps {
	initialRoute?: string;
}

const LeftNavigator: React.FC<LeftNavigatorProps> = ({initialRoute = '/blocked-sites'}) => {
	const theme = useTheme();

	return (
		<Box 
			sx={{
				backgroundColor: theme.palette.custom.sidebar,
				height: '100vh',
				borderRight: 1,
				borderColor: 'divider',
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
				boxSizing: 'border-box'
			}}
		>
			<List component="nav" disablePadding>
				{/* Logo & Title as a list item for consistent styling */}
				<ListItem 
					component={Link} 
					to="/" 
					disablePadding
					sx={{ 
						textDecoration: 'none',
						'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
					}}
				>
					<ListItemButton>
						<ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
							<img
								style={{
									height: 30,
									width: 30,
									filter: "drop-shadow(0px 0px 7px rgba(0, 0, 0, 0.6))"
								}}
								src="../../assets/icon-128.png"
								alt="ShieldBug Logo"
							/>
						</ListItemIcon>
						<ListItemText 
							primary="ShieldBug" 
							primaryTypographyProps={{ 
								sx: { 
									fontSize: '1.5rem',
									fontWeight: 700,
									color: theme.palette.mode === 'dark' ? 'primary.main' : 'white'
								}
							}} 
						/>
					</ListItemButton>
				</ListItem>
				
				<Divider sx={{ my: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
				
				{/* Main Navigation Items */}
				<ListItem disablePadding>
					<ListItemButton 
						component={Link} 
						to="/"
						sx={{ 
							'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
						}}
					>
						<ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
							<Block />
						</ListItemIcon>
						<ListItemText 
							primary="Block sites" 
							primaryTypographyProps={{ 
								sx: { 
									fontSize: '1.1rem',
									fontWeight: 500,
									color: 'white'
								}
							}} 
						/>
					</ListItemButton>
				</ListItem>
				
				{DeveloperFeatureFlags.BlockKeywords && (
					<ListItem disablePadding>
						<ListItemButton 
							component={Link} 
							to="/blocked-keywords"
							sx={{ 
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
							}}
						>
							<ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
								<Search />
							</ListItemIcon>
							<ListItemText 
								primary="Block keywords" 
								primaryTypographyProps={{ 
									sx: { 
										fontSize: '1.1rem',
										fontWeight: 500,
										color: 'white'
									}
								}} 
							/>
						</ListItemButton>
					</ListItem>
				)}
				
				{DeveloperFeatureFlags.Schedule && (
					<ListItem disablePadding>
						<ListItemButton 
							component={Link} 
							to="/schedule"
							sx={{ 
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
							}}
						>
							<ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
								<LockClock />
							</ListItemIcon>
							<ListItemText 
								primary="Schedule" 
								primaryTypographyProps={{ 
									sx: { 
										fontSize: '1.1rem',
										fontWeight: 500,
										color: 'white'
									}
								}} 
							/>
						</ListItemButton>
					</ListItem>
				)}
				
				{DeveloperFeatureFlags.Commitment && (
					<ListItem disablePadding>
						<ListItemButton 
							component={Link} 
							to="/commitment"
							sx={{ 
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
							}}
						>
							<ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
								<Lock />
							</ListItemIcon>
							<ListItemText 
								primary="Commitment" 
								primaryTypographyProps={{ 
									sx: { 
										fontSize: '1.1rem',
										fontWeight: 500,
										color: 'white'
									}
								}} 
							/>
						</ListItemButton>
					</ListItem>
				)}
				
				{DeveloperFeatureFlags.PasswordProtection && (
					<ListItem disablePadding>
						<ListItemButton 
							component={Link} 
							to="/password-protection"
							sx={{ 
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
							}}
						>
							<ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
								<VpnKey />
							</ListItemIcon>
							<ListItemText 
								primary="Password Protection" 
								primaryTypographyProps={{ 
									sx: { 
										fontSize: '1.1rem',
										fontWeight: 500,
										color: 'white'
									}
								}} 
							/>
						</ListItemButton>
					</ListItem>
				)}
				
				{/* Push remaining items to bottom with flexible space */}
				<Box sx={{ flexGrow: 1 }} />
				
				<Divider sx={{ my: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
				
				{/* Footer Navigation Items */}
				{DeveloperFeatureFlags.ExtraSettings && (
					<ListItem disablePadding>
						<ListItemButton 
							component={Link} 
							to="/extra-settings"
							sx={{ 
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
							}}
						>
							<ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
								<Lightbulb />
							</ListItemIcon>
							<ListItemText 
								primary="Extra Settings" 
								primaryTypographyProps={{ 
									sx: { 
										fontSize: '1.1rem',
										fontWeight: 500,
										color: 'white'
									}
								}} 
							/>
						</ListItemButton>
					</ListItem>
				)}
				
				<ListItem disablePadding>
					<ListItemButton 
						component="a" 
						href="https://shieldbug.app" 
						target="_blank"
						rel="noopener noreferrer"
						sx={{ 
							'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
						}}
					>
						<ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
							<Info />
						</ListItemIcon>
						<ListItemText 
							primary="About" 
							primaryTypographyProps={{ 
								sx: { 
									fontSize: '1.1rem',
									fontWeight: 500,
									color: 'white'
								}
							}} 
						/>
					</ListItemButton>
				</ListItem>
				
				<ListItem disablePadding>
					<ListItemButton 
						component="a" 
						href="mailto:info@shieldbug.app?subject=Shieldbug feedback"
						sx={{ 
							'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
						}}
					>
						<ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
							<Feedback />
						</ListItemIcon>
						<ListItemText 
							primary="Feedback" 
							primaryTypographyProps={{ 
								sx: { 
									fontSize: '1.1rem',
									fontWeight: 500,
									color: 'white'
								}
							}} 
						/>
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);
};

export default LeftNavigator;
