import { Theme, useTheme } from "@/src/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/src/utils/scale";
import React from "react";
import { Pressable, StyleSheet, Switch, Text, ViewStyle } from "react-native";
import ThemeView from "../primitives/ThemeView";

export type SwitchPosition = "left" | "right";

interface SwitchControlProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;

  label?: string;
  description?: string;

  disabled?: boolean;
  switchPosition?: SwitchPosition;

  containerStyle?: ViewStyle;
  labelStyle?: any;
  descriptionStyle?: any;

  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;

  fullPressable?: boolean;
}

const SwitchControl = ({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
  switchPosition = "left",
  containerStyle,
  labelStyle,
  descriptionStyle,
  activeColor,
  inactiveColor,
  thumbColor,
  fullPressable = true,
}: SwitchControlProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const toggle = () => {
    if (!disabled) {
      onValueChange?.(!value);
    }
  };

  const SwitchNode = (
    <Switch
      value={value}
      disabled={disabled}
      onValueChange={onValueChange}
      trackColor={{
        false: inactiveColor ?? theme.colors.border,
        true: activeColor ?? theme.colors.primary.main,
      }}
      thumbColor={thumbColor}
    />
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
        {switchPosition === "left" && SwitchNode}

        <ThemeView style={styles.textContainer}>
          {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
          {description && (
            <Text style={[styles.description, descriptionStyle]}>
              {description}
            </Text>
          )}
        </ThemeView>

        {switchPosition === "right" && SwitchNode}
      </ThemeView>
    </Pressable>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: verticalScale(10),
    },

    textContainer: {
      flex: 1,
      gap: verticalScale(2),
    },
    label: {
      fontSize: moderateScale(16),
      color: theme.colors.text.primary,
      fontWeight: "500",
    },
    description: {
      fontSize: moderateScale(12),
      color: theme.colors.text.secondary,
    },
    pressed: {
      opacity: 0.8,
    },
    disabled: {
      opacity: 0.6,
    },
  });

export default SwitchControl;
