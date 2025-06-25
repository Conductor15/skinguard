import { UserType } from '../constants/auth.constants';

export interface JwtPayload {
  sub: string;
  email: string;
  userType: UserType;
}

export interface TokenResponse {
  statusCode: number;
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    userType?: UserType;
  };
}

export interface UserInfo {
  id: string;
  email: string;
  fullName: string;
  userType: UserType;
}
