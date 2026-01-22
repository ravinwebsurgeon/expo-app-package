import { ROUTES } from "@/constants/routes";
import { SignupFormValues, signupSchema } from "@/services/schema/AuthSchema";
import { ThemeText } from "@/src/components/primitives/ThemeText";
import ThemeView from "@/src/components/primitives/ThemeView";
import ScreenLayout from "@/src/components/shared/layout/screen_layout";
import Button from "@/src/components/ui/button";
import DatePickerComponent from "@/src/components/ui/date-picker";
import Input from "@/src/components/ui/input";
import { LocalizedStrings } from "@/src/i18n/localizedStrings";
import { Theme, useTheme } from "@/src/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/src/utils/scale";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

const SignupScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { control, handleSubmit } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      birthday: undefined,
    },
  });

  const styles = useMemo(() => createStyles(theme), [theme]);

  const onSubmit = (data: SignupFormValues) => {};

  return (
    <ScreenLayout>
      <ThemeText align="center" variant="h4">
        {t(LocalizedStrings.SIGN_UP.TITLE)}
      </ThemeText>

      <ThemeView padded style={styles.contentContainer}>
        <ThemeView style={styles.form}>
          <Input
            control={control}
            name="name"
            label={t(LocalizedStrings.FORM.NAME)}
            placeholder={t(LocalizedStrings.PLACEHOLDER.NAME)}
          />
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

          <Input
            control={control}
            name="confirmPassword"
            secureTextEntry
            label={t(LocalizedStrings.FORM.CONFIRM_PASSWORD)}
            placeholder={t(LocalizedStrings.PLACEHOLDER.CONFIRM_PASSWORD)}
          />

          <Input
            control={control}
            name="username"
            label={t(LocalizedStrings.FORM.USERNAME)}
            placeholder={t(LocalizedStrings.PLACEHOLDER.USERNAME)}
          />

          <DatePickerComponent
            control={control}
            name="birthday"
            label={t(LocalizedStrings.FORM.BIRTHDAY)}
          />

          <Button
            title={t(LocalizedStrings.SIGN_UP.TITLE)}
            onPress={handleSubmit(onSubmit)}
          />
        </ThemeView>
        <ThemeView row centered padded>
          <View style={styles.divider} />
          <ThemeText>{t(LocalizedStrings.EXTRAS.OR)}</ThemeText>
          <View style={styles.divider} />
        </ThemeView>
        <ThemeView row centered style={styles.btnContainer}>
          <Button
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
        <ThemeText>
          {t(LocalizedStrings.SIGN_UP.ALREADY_HAVE_ACCOUNT)}
        </ThemeText>
        <Button
          title={t(LocalizedStrings.LOGIN.TITLE)}
          fullWidth={false}
          onPress={() => router.replace(ROUTES.LOGIN)}
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

export default SignupScreen;
