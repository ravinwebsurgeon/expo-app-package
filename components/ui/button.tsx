import { Theme, useTheme } from "@/src/theme";
import { FontWeight } from "@/src/theme/tokens/typography";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/src/utils/scale";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import ThemeView from "../primitives/ThemeView";

type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "destructive"
  | "success"
  | "warning";

type ButtonSize = "small" | "medium" | "large" | "extra_large";

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  fontSize?: number;
  textColor?: string;
  showShadow?: boolean;
  fontWeight?: FontWeight;
}

const Button = ({
  title,
  onPress,
  variant = "default",
  size = "medium",
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  fontSize,
  textColor,
  fontWeight,
  showShadow = false,
}: ButtonProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const containerStyles: ViewStyle[] = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    showShadow && {
      ...styles.shadow,
      ...(variant === "ghost" || variant === "link"
        ? { backgroundColor: theme.colors.background.default }
        : {}),
    },
    disabled && styles.disabled,
    style,
  ];

  const textStyles: TextStyle[] = [
    styles[`${variant}Text`],
    {
      fontSize: fontSize ?? moderateScale(18),
      fontWeight: fontWeight ?? "600",
    },
    textColor && { color: textColor },
    disabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={onPress}
      style={containerStyles}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "link" || variant === "ghost"
              ? theme.colors.text.primary
              : theme.colors.white
          }
        />
      ) : (
        <ThemeView row>
          {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
          {title && <Text style={textStyles}>{title}</Text>}
          {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
        </ThemeView>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      borderRadius: moderateScale(10),
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: horizontalScale(20),
      flexDirection: "row",
    },

    /* Sizes */
    small: { paddingVertical: horizontalScale(8) },
    medium: { paddingVertical: horizontalScale(12) },
    large: { paddingVertical: horizontalScale(16) },
    extra_large: {
      paddingVertical: horizontalScale(20),
      borderRadius: moderateScale(14),
    },

    fullWidth: { width: "100%" },

    /* Variants */
    default: {
      backgroundColor: theme.colors.primary.main,
      shadowColor: theme.colors.primary.main,
    },
    secondary: {
      backgroundColor: theme.colors.gray[200],
      shadowColor: theme.colors.gray[200],
    },
    success: {
      backgroundColor: theme.colors.success.main,
      shadowColor: theme.colors.success.main,
    },
    destructive: {
      backgroundColor: theme.colors.error.main,
      shadowColor: theme.colors.error.main,
    },
    warning: {
      backgroundColor: theme.colors.warning.main,
      shadowColor: theme.colors.warning.main,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    ghost: {
      backgroundColor: "transparent",
      shadowColor: theme.colors.text.primary,
    },

    link: {
      backgroundColor: "transparent",
      paddingHorizontal: 0,
    },

    /* Text */
    text: {
      fontWeight: "100",
    },

    defaultText: { color: theme.colors.white },
    secondaryText: { color: theme.colors.text.primary },
    outlineText: { color: theme.colors.text.primary },
    ghostText: { color: theme.colors.text.primary },
    destructiveText: {
      color: theme.colors.white,
    },
    linkText: {
      color: theme.colors.primary.main,
      textDecorationLine: "underline",
    },
    warningText: {
      color: theme.colors.white,
    },
    successText: {
      color: theme.colors.white,
    },

    /* States */
    disabled: { opacity: 0.5 },
    disabledText: { opacity: 0.7 },

    /* Layout */
    icon: {
      alignItems: "center",
      justifyContent: "center",
    },

    shadow: {
      shadowOffset: { width: 0, height: verticalScale(4) },
      shadowOpacity: 0.15,
      shadowRadius: moderateScale(4),
      elevation: moderateScale(3),
    },
  });

export default Button;
