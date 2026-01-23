import { endpoints } from "@/constants/endpoints";
import { LoginFormValues } from "../schema/AuthSchema";
import { apiClient } from "./client";

export type BaseReponse = {
  success: boolean;
  message: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  dob: string;
  phoneNumber: string;
};

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
}

export interface LoginData {
  user: User;
  token: string;
  tokens: Tokens;
}

export interface Tokens {
  access: TokenInfo;
  refresh: TokenInfo;
}

export interface TokenInfo {
  token: string;
  expires: string;
}

export interface User {
  id: string;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  name: string;
  image: string | null;
  roles: string[];
  organizer: Organizer;
  userInformation: UserInformation;
}

export interface UserInformation {
  id: number;
  userId: string;
  googlePlaceId: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
}

export type Organizer = {
  id: string;
  organizerCode: string;
  userId: string;
  businessName: string;
  businessDescription: string;
  businessType: string;
  logoUrl: string | null;
  websiteUrl: string;
  contactEmail: string;
  contactPhone: string;
  businessAddress: string;
  taxId: string | null;
  stripeAccountId: string | null;
  bankAccountInfo: string | null;
  isVerified: boolean;
  rating: string;
  totalEvents: number;
  createdAt: string;
  updatedAt: string;
};

export type CSRFTokenResponse = {
  success: boolean;
  csrfToken: string;
};

export interface RefreshTokensResponse {
  tokens: Tokens;
}

export const loginApi = async (
  request: LoginFormValues,
): Promise<LoginResponse> => {
  return apiClient.post(endpoints.auth.login, {
    identifier: request.email,
    password: request.password,
  });
};

export const signupApi = (request: SignupRequest) => {
  return apiClient.post(endpoints.auth.signup, request);
};

export const refreshTokenApi = async (
  refreshToken: string,
): Promise<RefreshTokensResponse> => {
  return apiClient.post(endpoints.auth.refreshToken, { refreshToken });
};

export const getCsrfToken = async (): Promise<CSRFTokenResponse> => {
  return apiClient.get(endpoints.auth.csrfToken);
};

export const forgotPasswordApi = (
  phoneNumber: string,
): Promise<BaseReponse> => {
  return apiClient.post(endpoints.auth.forgotPassword, {
    identifier: phoneNumber,
  });
};

export const resetPasswordApi = (
  phone: string,
  otp: string,
  password: string,
) => {
  return apiClient.post(endpoints.auth.resetPassword, {
    identifier: phone,
    otp,
    password,
  });
};

export const verifyOtpApi = (phone: string, otp: string) => {
  return apiClient.post(endpoints.auth.verify_otp, { identifier: phone, otp });
};

export const resendOtpApi = (phoneNumber: string) => {
  return apiClient.post(endpoints.auth.resendOtp, {
    identifier: phoneNumber,
  });
};

export const logoutApi = (): Promise<BaseReponse> => {
  return apiClient.post(endpoints.auth.logout);
};
