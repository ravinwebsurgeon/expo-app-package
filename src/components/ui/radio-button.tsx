import { Theme, useTheme } from "@/src/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/src/utils/scale";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import ThemeView from "../primitives/ThemeView";

export type RadioPosition = "left" | "right";

interface RadioButtonProps {
  selected?: boolean;
  label?: string;
  description?: string;
  onChange?: (selected: boolean) => void;
  row?: boolean;
  disabled?: boolean;
  position?: RadioPosition;
  size?: number;
  containerStyle?: ViewStyle;
  selectedColor?: string;
  unselectedColor?: string;
  innerDotColor?: string;
  fullPressable?: boolean;
}

const RadioButton = ({
  selected = false,
  row = true,
  label,
  description,
  onChange,
  disabled = false,
  position = "left",
  size = moderateScale(20),
  containerStyle,
  selectedColor,
  unselectedColor,
  innerDotColor,
  fullPressable = true,
}: RadioButtonProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme, size);

  const toggle = () => {
    if (!disabled) {
      onChange?.(!selected);
    }
  };

  const Circle = (
    <View
      style={[
        styles.outerCircle,
        {
          borderColor: selected
            ? (selectedColor ?? theme.colors.primary.main)
            : (unselectedColor ?? theme.colors.border),
        },
      ]}
    >
      {selected && (
        <View
          style={[
            styles.innerDot,
            {
              backgroundColor: innerDotColor ?? theme.colors.primary.main,
            },
          ]}
        />
      )}
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
      <ThemeView
        row={row}
        style={{ gap: horizontalScale(12), alignItems: "center" }}
      >
        {position === "left" && Circle}

        {(label || description) && (
          <View style={styles.textContainer}>
            {label && (
              <Text style={[styles.label, !row && styles.textCenter]}>
                {label}
              </Text>
            )}
            {description && (
              <Text style={[styles.description, !row && styles.textCenter]}>
                {description}
              </Text>
            )}
          </View>
        )}

        {position === "right" && row && Circle}
      </ThemeView>
    </Pressable>
  );
};

const makeStyles = (theme: Theme, size: number) =>
  StyleSheet.create({
    container: {
      paddingVertical: verticalScale(8),
    },

    outerCircle: {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: horizontalScale(2),
      justifyContent: "center",
      alignItems: "center",
    },
    innerDot: {
      aspectRatio: 1,
      height: size * 0.55,
      borderRadius: (size * 0.55) / 2,
    },
    textContainer: {
      gap: verticalScale(2),
    },
    label: {
      fontSize: moderateScale(13),
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
      opacity: 0.5,
    },
    textCenter: {
      textAlign: "center",
    },
  });

export default RadioButton;
