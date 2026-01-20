import { LanguageProvider } from "@/src/context/language";
import { ThemeProvider } from "@/src/context/theme";
import { useThemeStore } from "@/src/store/themeStore";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as ThemeProviderNative,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useMemo } from "react";
import "react-native-reanimated";

export default function RootLayout() {
  const { mode: themeMode, systemPrefersDark } = useThemeStore();
  const activeTheme =
    themeMode === "system" ? (systemPrefersDark ? "dark" : "light") : themeMode;
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
