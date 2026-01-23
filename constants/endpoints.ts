export const endpoints = {
  auth: {
    login: "api/auth/login",
    signup: "api/auth/register",
    refreshToken: "api/auth/refresh-token",
    forgotPassword: "api/auth/forgot-password",
    resetPassword: "api/auth/reset-password",
    resendOtp: "api/auth/resend-otp",
    verify_otp: "api/auth/verify-otp",
    csrfToken: "api/auth/csrf-token",
    googleSignin: "api/auth/google/mobile",
    fbSignin: "api/auth/facebook/mobile",
    appleSignin: "api/auth/apple/mobile",
    logout: "api/auth/logout",
  },
};
