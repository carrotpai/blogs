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

export type ProfileFormData = {
	username: string;
	info: string;
	description: string;
	password: string;
	newPassword: string;
	newPasswordRepeat: string;
};

export interface PostData {
	previewImageCover?: string;
	title: string;
	shortDescription: string;
	rating: number;
	authorId: number;
	author: {
		username: string;
		avatar?: string;
	};
	postContent: {
		content: string;
	};
	categories: Array<{ category: { name: string } }>;
	createdAt: string;
	status?: number;
}
