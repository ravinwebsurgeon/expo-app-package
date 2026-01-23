import { ThemeText } from "@/components/primitives/ThemeText";
import ThemeView from "@/components/primitives/ThemeView";
import ScreenLayout from "@/components/shared/layout/screen_layout";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { LoginFormValues, loginSchema } from "@/services/schema/AuthSchema";
import { LocalizedStrings } from "@/src/i18n/localizedStrings";
import { Theme, useTheme } from "@/src/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/src/utils/scale";
import { useAuthStore } from "@/stores/authStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, Platform, StyleSheet, View } from "react-native";

const LoginScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login, isLoading } = useAuthStore();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      router.navigate(ROUTES.APP.HOME);
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <ScreenLayout showLoader={isLoading}>
      <ThemeText align="center" variant="h4">
        {t(LocalizedStrings.LOGIN.TITLE)}
      </ThemeText>

      <ThemeView padded style={styles.contentContainer}>
        <ThemeView style={styles.form}>
          <Input
            control={control}
            name="email"
            label={t(LocalizedStrings.FORM.EMAIL)}
            placeholder={t(LocalizedStrings.PLACEHOLDER.EMAIL)}
            keyboardType="email-address"
          />

          <Input
            control={control}
            name="password"
            secureTextEntry
            label={t(LocalizedStrings.FORM.PASSWORD)}
            placeholder={t(LocalizedStrings.PLACEHOLDER.PASSWORD)}
          />

          <Button
            title={t(LocalizedStrings.LOGIN.FORGOT_PASSWORD)}
            fullWidth={false}
            onPress={() => router.navigate(ROUTES.AUTH.FORGOT_PASSWORD)}
            variant="link"
            size="small"
            fontSize={moderateScale(14)}
            style={{ alignSelf: "flex-end" }}
          />
          <Button
            title={t(LocalizedStrings.LOGIN.TITLE)}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
          />
        </ThemeView>
        <ThemeView row centered padded>
          <View style={styles.divider} />
          <ThemeText>{t(LocalizedStrings.EXTRAS.OR)}</ThemeText>
          <View style={styles.divider} />
        </ThemeView>
        <ThemeView style={styles.btnContainer}>
          <Button
            title="Login with Google"
            variant="ghost"
            size="large"
            showShadow
            leftIcon={
              <Ionicons
                name="logo-google"
                size={moderateScale(18)}
                color={theme.colors.icon}
              />
            }
            onPress={() => {}}
            fontWeight={300}
            fontSize={moderateScale(16)}
          />
          <Button
            title="Login with Facebook"
            variant="ghost"
            size="large"
            showShadow
            leftIcon={
              <Ionicons
                name="logo-facebook"
                size={moderateScale(18)}
                color={theme.colors.info.dark}
              />
            }
            onPress={() => {}}
            fontWeight={300}
            fontSize={moderateScale(16)}
          />
          {Platform.OS === "ios" && (
            <Button
              title="Login with Apple"
              size="large"
              variant="ghost"
              showShadow
              leftIcon={
                <Ionicons
                  name="logo-apple"
                  size={moderateScale(18)}
                  color={theme.colors.icon}
                />
              }
              onPress={() => {}}
              fontWeight={300}
              fontSize={moderateScale(16)}
            />
          )}
        </ThemeView>
      </ThemeView>
      <ThemeView row centered>
        <ThemeText>{t(LocalizedStrings.LOGIN.NEED_ACCOUNT)}</ThemeText>
        <Button
          title={t(LocalizedStrings.SIGN_UP.TITLE)}
          fullWidth={false}
          onPress={() => router.replace(ROUTES.AUTH.SIGN_UP)}
          variant="link"
          size="small"
          fontSize={moderateScale(14)}
        />
      </ThemeView>
    </ScreenLayout>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    form: {
      gap: verticalScale(15),
    },
    btnContainer: {
      gap: verticalScale(15),
    },
    divider: {
      backgroundColor: theme.colors.border,
      height: verticalScale(1),
      width: horizontalScale(120),
    },
    contentContainer: {
      flex: 1,
      gap: verticalScale(20),
    },
  });

export default LoginScreen;
