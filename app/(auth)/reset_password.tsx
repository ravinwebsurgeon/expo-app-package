import { ROUTES } from "@/constants/routes";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/services/schema/AuthSchema";
import { ThemeText } from "@/src/components/primitives/ThemeText";
import ThemeView from "@/src/components/primitives/ThemeView";
import ScreenLayout from "@/src/components/shared/layout/screen_layout";
import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";
import { LocalizedStrings } from "@/src/i18n/localizedStrings";
import { Theme, useTheme } from "@/src/theme";
import { horizontalScale, verticalScale } from "@/src/utils/scale";
import { useAuthStore } from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet } from "react-native";

const ResetPasswordScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { phoneNumber, otp } = useLocalSearchParams<{
    phoneNumber?: string;
    otp?: string;
  }>();
  const { resetPassword, isLoading } = useAuthStore();
  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const styles = useMemo(() => createStyles(theme), [theme]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      const responseMsg = await resetPassword(
        "8950142325",
        "111111",
        data.password,
      );
      Alert.alert(responseMsg);
      router.replace(ROUTES.AUTH.LOGIN);
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <ScreenLayout showBackButton showLoader={isLoading}>
      <ThemeText align="center" variant="h4">
        {t(LocalizedStrings.FORGOT_PASSWORD.RESET_PASSWORD)}
      </ThemeText>

      <ThemeView padded style={styles.form}>
        <Input
          control={control}
          name="password"
          secureTextEntry
          label={t(LocalizedStrings.FORM.PASSWORD)}
          placeholder={t(LocalizedStrings.PLACEHOLDER.PASSWORD)}
          keyboardType="email-address"
        />
        <Input
          control={control}
          name="confirmPassword"
          secureTextEntry
          label={t(LocalizedStrings.FORM.CONFIRM_PASSWORD)}
          placeholder={t(LocalizedStrings.PLACEHOLDER.CONFIRM_PASSWORD)}
          keyboardType="email-address"
        />
        <Button
          title={t(LocalizedStrings.FORGOT_PASSWORD.RESET_PASSWORD)}
          loading={isLoading}
          onPress={handleSubmit(onSubmit)}
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

export default ResetPasswordScreen;
