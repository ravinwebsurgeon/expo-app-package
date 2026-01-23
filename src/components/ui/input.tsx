import { LocalizedStrings } from "@/src/i18n/localizedStrings";
import { Theme, useTheme } from "@/src/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/src/utils/scale";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useMemo, useRef, useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export type IconPosition = "left" | "right";
interface InputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T>;
  label?: string;
  multiline?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  labelIcon?: React.ReactNode;
  labelIconPosition?: IconPosition;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  placeholder?: string;
  placeholderColor?: string;
  showShadow?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

const Input = <T extends FieldValues>({
  control,
  name,
  rules,
  label,
  multiline = false,
  labelIcon,
  labelIconPosition = "left",
  required,
  icon,
  iconPosition = "left",
  secureTextEntry,
  containerStyle,
  placeholder,
  placeholderColor,
  inputStyle,
  showShadow = false,
  editable = true,
  autoCapitalize = "none",
  ...props
}: InputProps<T>) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const inputRef = useRef<TextInput>(null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <View style={[styles.container, containerStyle]}>
          <View style={styles.row}>
            {labelIcon && labelIconPosition === "left" && (
              <View style={styles.center}>{labelIcon}</View>
            )}

            {labelIcon && labelIconPosition === "right" && (
              <View style={styles.center}>{labelIcon}</View>
            )}

            <Text style={styles.label}>
              {t(label)} {required && <Text style={styles.required}>*</Text>}
            </Text>
          </View>

          <View
            style={[
              styles.row,
              { justifyContent: "space-between" },
              styles.inputContainer,
              fieldState.error && styles.errorBorder,
              !editable && styles.disabled,
            ]}
          >
            <View
              style={[styles.row, showShadow && theme.shadows[2]]}
              onTouchStart={() => inputRef.current?.focus()}
            >
              {icon && iconPosition === "left" && (
                <View style={styles.center}>{icon}</View>
              )}

              <TextInput
                ref={inputRef}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                editable={editable}
                multiline={multiline}
            
                secureTextEntry={secureTextEntry && !showPassword}
                style={[
                  styles.input,
                  inputStyle,
                  multiline && styles.multiline,
                ]}
                placeholder={t(
                  placeholder ?? LocalizedStrings.PLACEHOLDER.TEXT,
                )}
                placeholderTextColor={
                  placeholderColor ?? theme.colors.inputPlaceHolder
                }
                autoCapitalize={autoCapitalize}
                {...props}
              />
            </View>
            {secureTextEntry ? (
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={8}
                style={styles.center}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={theme.colors.icon}
                />
              </TouchableOpacity>
            ) : (
              icon &&
              iconPosition === "right" && (
                <View style={styles.center}>{icon}</View>
              )
            )}
          </View>

          {fieldState.error?.message && (
            <Text style={styles.errorText}>{t(fieldState.error.message)}</Text>
          )}
        </View>
      )}
    />
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: verticalScale(8),
    },
    label: {
      color: theme.colors.text.primary,
      fontSize: moderateScale(14),
      fontWeight: "500",
    },
    required: {
      color: theme.colors.error.main,
    },

    inputContainer: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: moderateScale(10),
      paddingHorizontal: horizontalScale(12),
      backgroundColor: theme.colors.background.default,
      minHeight: verticalScale(48),
    },

    input: {
      fontSize: moderateScale(16),
      color: theme.colors.text.primary,
      paddingVertical: verticalScale(10),
      maxWidth: "90%",
      flex: 1,
    },

    center: {
      justifyContent: "center",
      alignItems: "center",
    },

    errorBorder: {
      borderColor: theme.colors.error.main,
    },

    errorText: {
      fontSize: moderateScale(12),
      color: theme.colors.error.main,
    },

    disabled: {
      opacity: 0.6,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: horizontalScale(5),
    },
    multiline: {
      height: verticalScale(100),
      alignItems: "flex-start",
      maxWidth: "100%",
    },
  });

export default Input;
