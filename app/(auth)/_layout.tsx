import { useTheme } from "@/src/theme";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: theme.colors.background.paper,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="welcome"
        options={{
          title: "Welcome",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign_up"
        options={{
          title: "Sign Up",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="forgot_password"
        options={{
          title: "Forgot Password",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="reset_password"
        options={{
          title: "Reset Password",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="verify_otp"
        options={{
          title: "Verify OTP",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
