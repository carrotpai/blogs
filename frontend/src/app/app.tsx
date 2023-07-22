import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routes from './router/routes';
import { createTheme, responsiveFontSizes } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const router = createBrowserRouter(routes);
let theme = createTheme({
	typography: {
		fontFamily: 'Work Sans',
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 480,
			md: 900,
			lg: 1200,
			xl: 1536,
		},
	},
});
theme = responsiveFontSizes(theme);

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<RouterProvider router={router} />
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default App;
