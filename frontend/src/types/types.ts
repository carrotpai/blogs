export interface createPostFormData {
	title: string;
	description: string;
	tags: (number | undefined)[];
}

export interface ISigninTokens {
	user: {
		id: number;
		username: string;
		rating: number;
		info: string;
		description: string;
		role: any;
	};
	accessToken: string;
	refreshToken: string;
}
