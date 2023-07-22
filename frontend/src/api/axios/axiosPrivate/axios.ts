import axios from 'axios';

import('../../../store/store').then(({ useTokenStore }) => {
	sub = useTokenStore.subscribe((state) => {
		tokens = {
			accessToken: state.accessToken,
			refreshToken: state.refreshToken,
		};
		console.log(state);
	});
});

interface Tokens {
	accessToken?: string;
	refreshToken?: string;
}

const axiosPrivate = axios.create({
	baseURL: 'http://localhost:3000/api/',
});

let tokens: Tokens = {};
let sub = undefined;

axiosPrivate.interceptors.request.use(
	(config) => {
		config.headers.Authorization = `Bearer ${tokens.accessToken}`;
		return config;
	},
	(error) => Promise.reject(error)
);

export default axiosPrivate;
