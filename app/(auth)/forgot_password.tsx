import { ROUTES } from "@/constants/routes";
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
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
import { router } from "expo-router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet } from "react-native";

const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { forgotPassword, isLoading, error } = useAuthStore();
  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      phoneNumber: "",
    },
  });

  const styles = useMemo(() => createStyles(theme), [theme]);

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const responseMsg = await forgotPassword(data.phoneNumber);
      if (responseMsg) Alert.alert(responseMsg);
      router.push({
        pathname: ROUTES.AUTH.VERIFY_OTP,
        params: { phoneNumber: data.phoneNumber },
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <ScreenLayout showBackButton showLoader={isLoading}>
      <ThemeText align="center" variant="h4">
        {t(LocalizedStrings.FORGOT_PASSWORD.TITLE)}
      </ThemeText>

      <ThemeView padded style={styles.form}>
        <Input
          control={control}
          name="phoneNumber"
          label={t(LocalizedStrings.FORM.PHONE)}
          placeholder={t(LocalizedStrings.PLACEHOLDER.PHONE)}
          keyboardType="phone-pad"
        />
        <Button
          title={t(LocalizedStrings.FORGOT_PASSWORD.SEND_CODE)}
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
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

export default ForgotPasswordScreen;
