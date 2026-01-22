import { ROUTES } from "@/constants/routes";
import {
    VerifyOtpFormValues,
    verifyOtpSchema,
} from "@/services/schema/AuthSchema";
import { ThemeText } from "@/src/components/primitives/ThemeText";
import ThemeView from "@/src/components/primitives/ThemeView";
import ScreenLayout from "@/src/components/shared/layout/screen_layout";
import Button from "@/src/components/ui/button";
import OTPInput from "@/src/components/ui/otp_input";
import { LocalizedStrings } from "@/src/i18n/localizedStrings";
import { Theme, useTheme } from "@/src/theme";
import {
    horizontalScale,
    moderateScale,
    verticalScale,
} from "@/src/utils/scale";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

const VerifyOtpScreen = () => {
  const RESEND_OTP_TIME = 30;
  const { email } = useLocalSearchParams<{ email: string }>();

  const { t } = useTranslation();
  const theme = useTheme();
  const [timer, setTimer] = useState(RESEND_OTP_TIME);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const { control, handleSubmit } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (timer <= 0) {
      setIsResendDisabled(false);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleResend = () => {
    console.log("Resend OTP to:", email);
    // Call API to resend OTP here
    setTimer(RESEND_OTP_TIME);
    setIsResendDisabled(true);
  };

  const onSubmit = (data: any) => {
    console.log("Data====", data);
    router.navigate(ROUTES.RESET_PASSWORD);
  };
  return (
    <ScreenLayout showBackButton>
      <ThemeText align="center" variant="h4">
        {t(LocalizedStrings.VERIFY_OTP.TITLE)}
      </ThemeText>

      <ThemeView padded style={styles.form}>
        <OTPInput control={control} name="otp" />
        <Button
          title={t(LocalizedStrings.FORGOT_PASSWORD.SEND_CODE)}
          onPress={handleSubmit(onSubmit)}
        />
      </ThemeView>
      <ThemeView row centered style={{ marginTop: verticalScale(10) }}>
        <ThemeText>{t(LocalizedStrings.VERIFY_OTP.OTP_NOT_RECEIVED)}</ThemeText>
        {!isResendDisabled ? (
          <Button
            title={t(LocalizedStrings.VERIFY_OTP.RESEND)}
            fullWidth={false}
            onPress={handleResend}
            variant="link"
            size="small"
            fontSize={moderateScale(14)}
            disabled={isResendDisabled}
          />
        ) : (
          <ThemeText color={theme.colors.text.disabled}>
            {" "}
            {`resend in (${timer}s)`}
          </ThemeText>
        )}
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

export default VerifyOtpScreen;
