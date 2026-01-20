import ThemeView from "@/src/components/primitives/ThemeView";
import Button from "@/src/components/shared/button";
import Input from "@/src/components/shared/input";
import { useLanguage } from "@/src/context/language";
import { LocalizedStrings } from "@/src/i18n/localizedStrings";
import { useThemeStore } from "@/src/store/themeStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

function AuthStart() {
  const { t } = useTranslation();
  const { setThemeMode, toggleTheme } = useThemeStore();
  const {setLanguage} = useLanguage()
  const { control } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });
  return (
    <SafeAreaView>
      <ThemeView>
        <Input
          control={control}
          name="name"
          label={t(LocalizedStrings.APP.WELCOME)}
          keyboardType="default"
        />
        <Button
          title={t(LocalizedStrings.APP.WELCOME)}
          onPress={() => setLanguage("en")}
        />
        <Button title="Click Me" onPress={() => setThemeMode("system")} />
        <Button title="Click Me" onPress={() => setLanguage("es")} />
      </ThemeView>
    </SafeAreaView>
  );
}

export default AuthStart;
