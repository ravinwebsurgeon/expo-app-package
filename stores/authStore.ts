import {
  forgotPasswordApi,
  loginApi,
  logoutApi,
  resendOtpApi,
  resetPasswordApi,
  signupApi,
  SignupRequest,
  User,
  verifyOtpApi,
} from "@/services/api/auth";
import { LoginFormValues } from "@/services/schema/AuthSchema";
import { LocalizedStrings } from "@/src/i18n/localizedStrings";
import { mmkvJSONStateStorage } from "@/src/services/storage/mmkvStorage";
import { t } from "i18next";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  authToken: string | null;
  refreshToken: string | null;
  loggedInUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

type AuthActions = {
  login: (request: LoginFormValues) => Promise<void>;
  signup: (request: SignupRequest) => Promise<void>;
  forgotPassword: (phoneNumber: string) => Promise<string>;
  resetPassword: (
    phoneNumber: string,
    otp: string,
    password: string,
  ) => Promise<string>;

  verifyOtp: (phoneNumber: string, otp: string) => Promise<void>;
  resendOtp: (phoneNumber: string) => Promise<string>;
  logout: () => Promise<string>;
};

const initialState: AuthState = {
  authToken: null,
  refreshToken: null,
  loggedInUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      login: async (request) => {
        set({ isLoading: true, error: null });

        try {
          const res = await loginApi(request);
          const { user, tokens } = res.data;
          const accessToken = tokens.access.token;
          if (!res?.success || !res?.data?.user) {
            throw new Error(res?.message || t(LocalizedStrings.ERROR.LOGIN));
          }

          set({
            authToken: accessToken,
            refreshToken: tokens.refresh.token,
            loggedInUser: user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          set({
            isLoading: false,
            error:
              err instanceof Error
                ? err.message
                : t(LocalizedStrings.ERROR.LOGIN),
          });
          throw err;
        }
      },
      signup: async (request) => {
        set({ isLoading: true, error: null });

        try {
          const res = await signupApi(request);
          if (!res?.success || !res.data?.user) {
            throw new Error(res?.message || t(LocalizedStrings.ERROR.SIGNUP));
          }

          const { user, tokens } = res.data;
          const accessToken = tokens.access.token;

          set({
            authToken: accessToken,
            refreshToken: tokens.refresh.token,
            loggedInUser: user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          set({
            isLoading: false,
            error:
              err instanceof Error
                ? err.message
                : t(LocalizedStrings.ERROR.SIGNUP),
          });
          throw err;
        }
      },

      forgotPassword: async (phoneNumber) => {
        set({ isLoading: true, error: null });

        try {
          const res = await forgotPasswordApi(phoneNumber);
          if (!res?.success) {
            throw new Error(
              res?.message || t(LocalizedStrings.ERROR.FORGOT_PASSWORD),
            );
          }

          set({ isLoading: false });

          return res.message;
        } catch (err) {
          set({
            isLoading: false,
            error:
              err instanceof Error
                ? err.message
                : t(LocalizedStrings.ERROR.FORGOT_PASSWORD),
          });
          throw err;
        }
      },

      resetPassword: async (phoneNumber, otp, password) => {
        set({ isLoading: true, error: null });

        try {
          const res = await resetPasswordApi(phoneNumber, otp, password);
          if (!res?.success) {
            throw new Error(
              res?.message || t(LocalizedStrings.ERROR.RESET_PASSWORD),
            );
          }

          set({ isLoading: false });

          return res.message;
        } catch (err) {
          set({
            isLoading: false,
            error:
              err instanceof Error
                ? err.message
                : t(LocalizedStrings.ERROR.RESET_PASSWORD),
          });
          throw err;
        }
      },

      verifyOtp: async (phoneNumber, otp) => {
        set({ isLoading: true, error: null });

        try {
          const res = await verifyOtpApi(phoneNumber, otp);

          if (!res?.success) {
            throw new Error(
              res?.message || t(LocalizedStrings.ERROR.VERIFY_OTP),
            );
          }

          set({ isLoading: false });
        } catch (err) {
          set({
            isLoading: false,
            error:
              err instanceof Error
                ? err.message
                : t(LocalizedStrings.ERROR.VERIFY_OTP),
          });
          throw err;
        }
      },

      resendOtp: async (phoneNumber) => {
        set({ isLoading: true, error: null });

        try {
          const res = await resendOtpApi(phoneNumber);
          if (!res?.success) {
            throw new Error(
              res?.message || t(LocalizedStrings.ERROR.RESEND_OTP),
            );
          }

          set({ isLoading: false });
          return res.message;
        } catch (err) {
          set({
            isLoading: false,
            error:
              err instanceof Error
                ? err.message
                : t(LocalizedStrings.ERROR.RESEND_OTP),
          });
          throw err;
        }
      },
      logout: async () => {
        set({ isLoading: true, error: null });

        try {
          const res = await logoutApi();
          if (!res?.success) {
            throw new Error(res?.message || t(LocalizedStrings.ERROR.LOGOUT));
          }

          set({
            authToken: null,
            loggedInUser: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          return res.message;
        } catch (err) {
          set({
            isLoading: false,
            error:
              err instanceof Error
                ? err.message
                : t(LocalizedStrings.ERROR.LOGOUT),
          });
          throw err;
        }
      },

      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: "auth-store",
      storage: mmkvJSONStateStorage,
      partialize: (state) => ({
        authToken: state.authToken,
        loggedInUser: state.loggedInUser,
        isAuthenticated: state.isAuthenticated,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
