import { Theme, useTheme } from "@/src/theme";
import { useDebounce } from "@/src/utils/hooks";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/src/utils/scale";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import ThemeView from "../primitives/ThemeView";
import { IconPosition } from "./input";

interface SearchBarProps<
  TFieldValues extends FieldValues,
> extends TextInputProps {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
  debounceMs?: number;
  onSearch?: (value: string) => void;
  showSearchIcon?: boolean;
  searchIconPosition?: IconPosition;
  showClearButton?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  iconStyle?: TextStyle;
}

export const SearchBar = <TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  debounceMs = 400,
  onSearch,
  showSearchIcon = true,
  searchIconPosition = "left",
  showClearButton = true,
  containerStyle,
  inputStyle,
  iconStyle,
  ...textInputProps
}: SearchBarProps<TFieldValues>) => {
  const [localValue, setLocalValue] = useState("");
  const debouncedValue = useDebounce(localValue, debounceMs);
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const clearValue = () => {
          setLocalValue("");
          onChange("");
          onSearch?.("");
        };

        return (
          <ThemeView
            row
            centered
            rounded
            backgroundColor={theme.colors.background.default}
            style={[
              styles.container,
              containerStyle,
              error && styles.errorContainer,
            ]}
          >
            {showSearchIcon && searchIconPosition === "left" && (
              <Ionicons
                name="search"
                size={moderateScale(18)}
                color={theme.colors.inputPlaceHolder}
                style={iconStyle}
              />
            )}

            <TextInput
              {...textInputProps}
              value={localValue}
              onChangeText={(text) => {
                setLocalValue(text);
                onChange(text);
              }}
              style={[styles.input, inputStyle]}
            />

            {showClearButton && localValue.length > 0 && (
              <Ionicons
                name="close-circle"
                size={18}
                color={theme.colors.inputPlaceHolder}
                style={iconStyle}
                onPress={clearValue}
                hitSlop={10}
              />
            )}

            {showSearchIcon && searchIconPosition === "right" && (
              <Ionicons
                name="search"
                size={moderateScale(18)}
                color={theme.colors.inputPlaceHolder}
                style={iconStyle}
                onPress={() => onSearch?.(debouncedValue)}
              />
            )}
          </ThemeView>
        );
      }}
    />
  );
};

export default SearchBar;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: moderateScale(10),
      paddingHorizontal: horizontalScale(10),
      backgroundColor: theme.colors.background.default,
    },
    errorContainer: {
      borderColor: theme.colors.error.main,
    },
    input: {
      flex: 1,
      color: theme.colors.text.primary,
      paddingVertical: verticalScale(12),
    },
  });
