import { Theme, useTheme } from "@/src/theme";
import { moderateScale } from "@/src/utils/scale";
import React, { useEffect, useRef, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEvent,
  TextStyle,
  ViewStyle,
} from "react-native";
import ThemeView from "../primitives/ThemeView";

interface OTPInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  length?: number;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
}

const OTPInput = <T extends FieldValues>({
  control,
  name,
  length = 5,
  containerStyle,
  inputStyle,
  disabled = false,
}: OTPInputProps<T>) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(theme);
  const inputsRef = useRef<TextInput[]>([]);
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  useEffect(() => {
    inputsRef.current[0].focus();
  }, []);

  const focusIndex = (index: number) => {
    if (index >= 0 && index < length) inputsRef.current[index]?.focus();
  };

  const handleChange = (
    text: string,
    index: number,
    onChange: (val: string) => void,
  ) => {
    const updated = [...otp];
    if (text.length > 1) {
      // Handle paste
      const paste = text.split("").slice(0, length - index);
      paste.forEach((char, i) => (updated[index + i] = char));
      setOtp(updated);
      onChange(updated.join(""));
      focusIndex(
        index + paste.length < length ? index + paste.length : length - 1,
      );
      return;
    }

    updated[index] = text;
    setOtp(updated);
    onChange(updated.join(""));

    if (text && index < length - 1) focusIndex(index + 1);
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEvent>,
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      focusIndex(index - 1);
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState }) => {
        return (
          <>
            <ThemeView row style={containerStyle}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    if (ref) inputsRef.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index, onChange)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  editable={!disabled}
                  textAlign="center"
                  style={[
                    styles.input,
                    fieldState.error && styles.error,
                    inputStyle,
                  ]}
                />
              ))}
            </ThemeView>
            {fieldState.error?.message && (
              <Text style={styles.errorText}>
                {t(fieldState.error.message)}
              </Text>
            )}
          </>
        );
      }}
    />
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    input: {
      aspectRatio: 1,
      height: moderateScale(50),
      borderRadius: moderateScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      fontSize: moderateScale(18),
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.background.default,
    },
    error: {
      borderColor: theme.colors.error.main,
    },

    errorText: {
      fontSize: moderateScale(12),
      color: theme.colors.error.main,
      textAlign: "center",
    },
  });

export default OTPInput;
