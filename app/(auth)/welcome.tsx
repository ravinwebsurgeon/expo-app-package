import { ROUTES } from "@/constants/routes";
import { ThemeText } from "@/src/components/primitives/ThemeText";
import ThemeView from "@/src/components/primitives/ThemeView";
import ScreenLayout from "@/src/components/shared/layout/screen_layout";
import Button from "@/src/components/ui/button";
import { LocalizedStrings } from "@/src/i18n/localizedStrings";
import { verticalScale } from "@/src/utils/scale";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

const WelcomeScreen = () => {
  const { t } = useTranslation();
  return (
    <ScreenLayout>
      <ThemeView padded style={styles.container}>
        <Button
          title={t(LocalizedStrings.SIGN_UP.CREATE_NEW_ACCOUNT)}
          onPress={() => router.replace(ROUTES.AUTH.SIGN_UP)}
        />
        <ThemeText align="center">
          {t(LocalizedStrings.SIGN_UP.ALREADY_HAVE_ACCOUNT)}
        </ThemeText>
        <Button title="Login" onPress={() => router.replace(ROUTES.AUTH.LOGIN)} />
      </ThemeView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    gap: verticalScale(10),
    flex: 1,
  },
});

export default WelcomeScreen;
