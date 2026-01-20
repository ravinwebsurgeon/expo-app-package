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
        name="auth-start"
        options={{
          title: "Auth Start",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
