import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosPrivate } from '../../api/axios';
import { ISigninTokens } from '../../types/types';
import { produce } from 'immer';

interface User {
	user?: {
		id: number;
		username: string;
		rating: number;
		info: string;
		avatar?: string;
		description: string;
		role: any;
	};
	signin: (username: string, password: string) => Promise<void>;
	getUser: () => Promise<void>;
}

interface storeTokens {
	rememberMe: boolean;
	accessToken?: string;
	refreshToken?: string;
	setTokens: (accessToken: string, refreshToken: string) => void;
	changeRememberMe: () => void;
}

export const useUserStore = create<User>((set) => ({
	user: undefined,
	getUser: async () => {
		try {
			const res = (
				await axiosPrivate.post<User['user']>('auth/getAuthData')
			).data;
			set(
				produce<User>((state) => {
					state.user = res;
				})
			);
		} catch (e) {
			console.log(e);
		}
	},
	signin: async (username: string, password: string) => {
		const res = (
			await axiosPrivate.post<ISigninTokens>('auth/signin', {
				username,
				password,
			})
		).data;
		set(
			produce<User>((state) => {
				state.user = res.user;
			})
		);
		const setTokens = useTokenStore.getState().setTokens;
		setTokens(res.accessToken, res.refreshToken);
	},
}));

export const useTokenStore = create<storeTokens>()(
	persist(
		(set, get) => ({
			accessToken: '',
			refreshToken: '',
			rememberMe: false,
			setTokens: (accessToken: string, refreshToken: string) => {
				set(
					produce<storeTokens>((state) => {
						state.accessToken = accessToken;
						state.refreshToken = refreshToken;
					})
				);
			},
			changeRememberMe: () => {
				set(
					produce<storeTokens>((state) => {
						state.rememberMe = !state.rememberMe;
					})
				);
			},
		}),
		{ name: 'metablog-user' }
	)
);
