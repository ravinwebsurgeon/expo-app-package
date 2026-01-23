import { getCsrfToken } from "@/services/api/auth";
import { setCSRFToken } from "@/services/api/tokens";
import { LanguageProvider } from "@/src/context/language";
import { ThemeProvider } from "@/src/context/theme";
import { useThemeStore } from "@/stores/themeStore";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as ThemeProviderNative,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect, useMemo } from "react";
import "react-native-reanimated";

export default function RootLayout() {
  const { mode: themeMode, systemPrefersDark } = useThemeStore();
  const activeTheme =
    themeMode === "system" ? (systemPrefersDark ? "dark" : "light") : themeMode;

  useEffect(() => {
    // Fetch CSRF token once at startup
    const fetchCSRF = async () => {
      try {
        const response = await getCsrfToken();
        if (response.success) {
          setCSRFToken(response.csrfToken);
        }

        console.log("CSRFTOKEN ======", response.csrfToken);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "CSRF fetch failed";
        console.error("Error fetching CSRF", errorMessage);
      }
    };

    fetchCSRF();
  }, []);

  // Memoize theme value to prevent unnecessary re-renders
  const themeValue = useMemo(
    () => (activeTheme === "dark" ? DarkTheme : DefaultTheme),
    [activeTheme],
  );

  return (
    <ThemeProviderNative value={themeValue}>
      <LanguageProvider>
        <ThemeProvider>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </LanguageProvider>
    </ThemeProviderNative>
  );
}
