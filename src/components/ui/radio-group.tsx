import { Theme, useTheme } from "@/src/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/src/utils/scale";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import ThemeView from "../primitives/ThemeView";
import { IconPosition } from "./input";
import RadioButton from "./radio-button";

export interface RadioOption<T = string> {
  label?: string;
  description?: string;
  value: T;
  disabled?: boolean;
}

interface RadioGroupProps<T> {
  label?: string;
  value?: T;
  onChange?: (value: T) => void;
  options: RadioOption<T>[];
  row?: boolean;
  disabled?: boolean;
  radioPosition?: IconPosition;
  radioSize?: number;
  containerStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  selectedColor?: string;
  unselectedColor?: string;
  innerDotColor?: string;
  fullPressable?: boolean;

  /** Advanced */
  renderItem?: (
    option: RadioOption<T>,
    selected: boolean,
    onSelect: () => void,
  ) => React.ReactNode;
}

const RadioGroup = <T,>({
  label,
  value,
  onChange,
  options,
  row = true,
  disabled = false,
  radioPosition = "left",
  radioSize,
  containerStyle,
  itemStyle,
  selectedColor,
  unselectedColor,
  innerDotColor,
  fullPressable = true,
  renderItem,
}: RadioGroupProps<T>) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View>
      <Text style={styles.label}>{t(label)}</Text>
      <ThemeView
        row={row}
        style={[
          {
            gap: row ? horizontalScale(16) : verticalScale(5),
            justifyContent: "flex-start",
            alignItems: "flex-start",
          },
          containerStyle,
        ]}
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;

          const onSelect = () => {
            if (disabled || option.disabled) return;
            onChange?.(option.value);
          };

          if (renderItem) {
            return (
              <View key={index} style={itemStyle}>
                {renderItem(option, isSelected, onSelect)}
              </View>
            );
          }

          return (
            <ThemeView key={index} style={itemStyle}>
              <RadioButton
                selected={isSelected}
                label={option.label}
                description={option.description}
                onChange={onSelect}
                disabled={disabled || option.disabled}
                position={radioPosition}
                size={radioSize}
                selectedColor={selectedColor}
                unselectedColor={unselectedColor}
                innerDotColor={innerDotColor}
                fullPressable={fullPressable}
              />
            </ThemeView>
          );
        })}
      </ThemeView>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    label: {
      color: theme.colors.text.primary,
      fontSize: moderateScale(14),
      fontWeight: "500",
    },
  });

export default RadioGroup;
