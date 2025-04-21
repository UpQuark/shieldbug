import * as React from 'react';
import { useState, useEffect, createContext, useMemo } from 'react';
import LeftNavigator from "./LeftNavigator/LeftNavigator";
import { createTheme, ThemeProvider, Box, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BlockedSites from "./BlockedSites/BlockedItemsDialog";
import BlockedKeywords from "./BlockedKeywords";
import Scheduler from "./Scheduler/Scheduler";
import Commitment from "./Commitment/Commitment";
import ExtraSettings from "./ExtraSettings";
import PasswordProtection from "./PasswordProtection/PasswordProtection";
import PasswordOverlay from "./PasswordProtection/PasswordOverlay";
import WelcomePopover from "./WelcomePopover";
import { getDesignTokens } from "../../../styles/MuiTheme";

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
	currentTheme: ThemeMode;
	setThemeMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
	currentTheme: 'system',
	setThemeMode: () => {},
});

const SettingsApp: React.FC = () => {
	const [mode, setMode] = useState<'light' | 'dark'>('light');
	const [themeMode, setThemeMode] = useState<ThemeMode>('system');

	// Function to get theme mode and update it
	const handleThemeModeChange = (newMode: ThemeMode) => {
		// Save to storage and context
		setThemeMode(newMode);
		chrome.storage.sync.set({ themeMode: newMode });
		
		// Apply to localStorage for other components
		if (newMode === 'system') {
			localStorage.removeItem('themeMode');
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			setMode(prefersDark ? 'dark' : 'light');
		} else {
			localStorage.setItem('themeMode', newMode);
			setMode(newMode as 'light' | 'dark');
		}
	};

	// Load theme preference on mount
	useEffect(() => {
		chrome.storage.sync.get(['themeMode'], (data) => {
			const savedThemeMode = (data.themeMode as ThemeMode) || 'system';
			setThemeMode(savedThemeMode);
			
			if (savedThemeMode === 'system') {
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				setMode(prefersDark ? 'dark' : 'light');
			} else {
				setMode(savedThemeMode as 'light' | 'dark');
			}
		});
		
		// Listen for system theme changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = (e: MediaQueryListEvent) => {
			if (themeMode === 'system') {
				setMode(e.matches ? 'dark' : 'light');
			}
		};
		
		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [themeMode]);
	
	// Create the theme context value
	const themeContextValue = useMemo(() => ({
		currentTheme: themeMode,
		setThemeMode: handleThemeModeChange
	}), [themeMode]);

	// Apply the current mode to the theme
	const theme = useMemo(() => 
		createTheme(getDesignTokens(mode)),
		[mode]
	);

	return (
		<ThemeContext.Provider value={themeContextValue}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Box sx={{ 
					bgcolor: 'background.default',
					minHeight: '100vh',
					color: 'text.primary'
				}}>
					<Router>
						<Box sx={{ 
							display: 'flex', 
							width: '100%',
							boxSizing: 'border-box',
							position: 'relative'
						}}>
							<LeftNavigator/>
							<WelcomePopover/>
							<Box sx={{ 
								width: 'calc(100% - 261px)', 
								marginLeft: '261px', 
								padding: 3,
								boxSizing: 'border-box',
								position: 'relative'
							}}>
								<PasswordOverlay>
									<Routes>
										<Route path="*" element={<BlockedSites/>}/>
										<Route path="/blocked-keywords" element={<BlockedKeywords/>}/>
										<Route path="/schedule" element={<Scheduler/>}/>
										<Route path="/commitment" element={<Commitment/>}/>
										<Route path="/extra-settings" element={<ExtraSettings/>}/>
										<Route path="/password-protection" element={<PasswordProtection/>}/>
									</Routes>
								</PasswordOverlay>
							</Box>
						</Box>
					</Router>
				</Box>
			</ThemeProvider>
		</ThemeContext.Provider>
	);
};

export default SettingsApp;
