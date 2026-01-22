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
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const styles = useMemo(() => createStyles(theme), [theme]);

  const onSubmit = (data: ForgotPasswordFormValues) => {
    console.log("Data====", data);
    router.push({
      pathname: ROUTES.VERIFY_OTP,
      params: { email: data.email },
    });
  };
  return (
    <ScreenLayout showBackButton>
      <ThemeText align="center" variant="h4">
        {t(LocalizedStrings.FORGOT_PASSWORD.TITLE)}
      </ThemeText>

      <ThemeView padded style={styles.form}>
        <Input
          control={control}
          name="email"
          label={t(LocalizedStrings.FORM.EMAIL)}
          placeholder={t(LocalizedStrings.PLACEHOLDER.EMAIL)}
          keyboardType="email-address"
        />
        <Button
          title={t(LocalizedStrings.FORGOT_PASSWORD.SEND_CODE)}
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

export default ForgotPasswordScreen;
