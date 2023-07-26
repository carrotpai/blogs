import axios from 'axios';
import axiosDefault from '../axiosDefault/axios';

interface Tokens {
	accessToken?: string;
	refreshToken?: string;
}

let tokens: Tokens = {};
let setTokens:
	| ((accessToken: string, refreshToken: string) => void)
	| undefined = undefined;
let sub = undefined;

const storageHydration = import('../../../store/store').then(
	({ useTokenStore }) => {
		tokens.accessToken = useTokenStore.getState().accessToken;
		tokens.refreshToken = useTokenStore.getState().refreshToken;
		setTokens = useTokenStore.getState().setTokens;
		console.log(
			`persisted state: ${JSON.stringify(useTokenStore.getState())}`
		);
		sub = useTokenStore.subscribe((state, prevState) => {
			tokens = {
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
			};
			setTokens = state.setTokens;
			console.log(JSON.stringify(state));
		});
	}
);

const axiosPrivate = axios.create({
	baseURL: 'http://localhost:3000/api/',
});

const refreshTokens = async () => {
	await storageHydration;
	const newTokens = (
		await axiosDefault.post<Tokens>(
			'auth/refresh',
			{},
			{
				headers: {
					Authorization: `Bearer ${tokens.refreshToken}`,
				},
			}
		)
	).data;
	if (setTokens && newTokens.accessToken && newTokens.refreshToken) {
		setTokens(newTokens.accessToken, newTokens.refreshToken);
	}
};

axiosPrivate.interceptors.request.use(
	async (config) => {
		await storageHydration;
		config.headers.Authorization = `Bearer ${tokens.accessToken}`;
		return config;
	},
	(error) => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
	(response) => response,
	async (error) => {
		const prevRequest = error.config;
		if (error.response.status === 401 && !prevRequest.sent) {
			prevRequest.sent = true;
			await refreshTokens();
			return axiosPrivate(prevRequest);
		}
		return Promise.reject(error);
	}
);

export default axiosPrivate;
