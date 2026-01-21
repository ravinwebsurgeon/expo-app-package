import { Theme, useTheme } from "@/src/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/src/utils/scale";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import ThemeView from "../primitives/ThemeView";
import { IconPosition } from "./input";

interface CheckBoxProps {
  label?: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  position?: IconPosition;
  size?: number;
  containerStyle?: ViewStyle;
  checkedColor?: string;
  uncheckedColor?: string;
  checkIconColor?: string;
  customCheckedIcon?: React.ReactNode;
  customUncheckedIcon?: React.ReactNode;
  fullPressable?: boolean;
  checkboxStyle?: ViewStyle;
}

const CheckBox = ({
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  position = "left",
  size = moderateScale(20),
  containerStyle,
  checkedColor,
  uncheckedColor,
  checkIconColor,
  customCheckedIcon,
  customUncheckedIcon,
  fullPressable = true,
  checkboxStyle,
}: CheckBoxProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme, size);

  const toggle = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  const Box = (
    <View
      style={[
        styles.box,
        {
          backgroundColor: checked
            ? (checkedColor ?? theme.colors.primary.main)
            : "transparent",
          borderColor: checked
            ? (checkedColor ?? theme.colors.primary.main)
            : (uncheckedColor ?? theme.colors.border),
        },
        checkboxStyle,
      ]}
    >
      {checked &&
        (customCheckedIcon ?? (
          <Ionicons
            name="checkmark"
            size={size * 0.75}
            color={checkIconColor ?? theme.colors.icon}
          />
        ))}
      {!checked && customUncheckedIcon}
    </View>
  );

  return (
    <Pressable
      onPress={fullPressable ? toggle : undefined}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        pressed && fullPressable && styles.pressed,
        containerStyle,
        disabled && styles.disabled,
      ]}
    >
      <ThemeView row style={{ gap: horizontalScale(12) }}>
        {position === "left" && Box}

        {(label || description) && (
          <View style={styles.textContainer}>
            {label && <Text style={styles.label}>{label}</Text>}
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>
        )}

        {position === "right" && Box}
      </ThemeView>
    </Pressable>
  );
};

const makeStyles = (theme: Theme, size: number) =>
  StyleSheet.create({
    container: {
      paddingVertical: verticalScale(8),
    },

    box: {
      aspectRatio: 1,
      height: size,
      borderRadius: moderateScale(4),
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
    },
    textContainer: {
      flex: 1,
      gap: verticalScale(2),
    },
    label: {
      fontSize: moderateScale(15),
      color: theme.colors.text.primary,
      fontWeight: "500",
    },
    description: {
      fontSize: moderateScale(13),
      color: theme.colors.text.secondary,
    },
    pressed: {
      opacity: 0.8,
    },
    disabled: {
      opacity: 0.5,
    },
  });

export default CheckBox;
