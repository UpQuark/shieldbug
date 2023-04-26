import { createTheme } from '@mui/material/styles';

const colors = {
	primary: '#ff9800',
	secondary: '#6c757d',
	success: '#28a745',
	info: '#17a2b8',
	warning: '#ffc107',
	danger: '#dc3545'
};

const theme = createTheme({
	palette: {
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
		}
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
});

export default theme;
