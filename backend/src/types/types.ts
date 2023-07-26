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

export interface RequestWithUser {
  user: {
    id: number;
  };
}
