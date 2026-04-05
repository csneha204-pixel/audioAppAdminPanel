export interface ProfileResponse {
  message: string;
  accessToken: string;
  user: UserData;
}
export interface UserData {
    id: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    twoFactorEnabled: boolean;
}
export interface SignInFormErrors {
  email?: string;
  password?: string;
}