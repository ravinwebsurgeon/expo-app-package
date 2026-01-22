import {
    ResetPasswordFormValues,
    resetPasswordSchema
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
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

const ResetPasswordScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const styles = useMemo(() => createStyles(theme), [theme]);

  const onSubmit = (data: ResetPasswordFormValues) => {
    console.log("Data====", data);
  };
  return (
    <ScreenLayout showBackButton>
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
