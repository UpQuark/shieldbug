import { createTheme, ThemeOptions } from '@mui/material/styles';

// Extend the Palette interface to include custom properties
declare module '@mui/material/styles' {
	interface Palette {
		custom: {
			sidebar: string;
		}
	}
	interface PaletteOptions {
		custom?: {
			sidebar?: string;
		}
	}
}

// Light mode colors
export const lightColors = {
	primary: '#ff9800',
	secondary: '#6f7478',
	success: '#28a745',
	info: '#17a2b8',
	warning: '#ffc107',
	danger: '#dc3545',
	light: '#f8f9fa',
	dark: '#343a40',
	// Custom colors for light mode
	background: '#f5f5f5',
	sidebar: '#ff9800', // Use primary color for sidebar in light mode
	paper: '#ffffff'
};

// Dark mode colors
export const darkColors = {
	primary: '#ff9800',
	secondary: '#9e9e9e',
	success: '#4caf50',
	info: '#2196f3',
	warning: '#ffc107',
	danger: '#f44336',
	light: '#424242',
	dark: '#121212',
	// Custom colors for dark mode
	background: '#121212',
	sidebar: '#1e1e1e', // Dark sidebar in dark mode
	paper: '#272727'
};

// Function to get theme options based on mode
const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => {
	const colors = mode === 'light' ? lightColors : darkColors;
	
	return {
		palette: {
			mode,
			primary: {
				main: colors.primary,
			},
			secondary: {
				main: colors.secondary,
			},
			success: {
				main: colors.success,
			},
			info: {
				main: colors.info,
			},
			warning: {
				main: colors.warning,
			},
			error: {
				main: colors.danger,
			},
			text: {
				primary: mode === 'light' ? colors.dark : '#ffffff',
				secondary: colors.secondary,
			},
			background: {
				default: colors.background,
				paper: colors.paper,
			},
			// Custom theme values that can be accessed via theme.palette.custom
			custom: {
				sidebar: colors.sidebar,
			},
		},
		typography: {
			fontFamily: 'Quicksand, sans-serif',
			h1: {
				fontWeight: 700,
				color: colors.primary,
			},
			h2: {
				fontWeight: 700,
				color: colors.primary,
			},
			h3: {
				fontWeight: 700,
				color: colors.primary,
			},
			h4: {
				fontWeight: 700,
				color: colors.primary,
			},
			h5: {
				fontWeight: 700,
				color: colors.primary,
			},
			h6: {
				fontWeight: 700,
				color: colors.primary,
			},
		},
		components: {
			MuiButton: {
				styleOverrides: {
					root: {
						textTransform: 'none',
						color: mode === 'light' ? 'white' : '#ffffff',
						fontWeight: 700,
						fontSize: 19
					},
					outlined: {
						color: colors.primary,
					},
				},
			},
			MuiContainer: {
				styleOverrides: {
					root: {
						padding: '0.5rem'
					}
				}
			},
			MuiPaper: {
				styleOverrides: {
					root: {
						backgroundColor: colors.paper,
						color: mode === 'light' ? colors.dark : '#ffffff',
					}
				}
			}
		}
	};
};

// Create a light theme by default
const theme = createTheme(getDesignTokens('light'));

// Export both the theme and the getDesignTokens function for dynamic theme creation
export { getDesignTokens };
export default theme;
