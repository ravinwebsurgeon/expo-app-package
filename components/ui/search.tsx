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
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import ThemeView from "../primitives/ThemeView";
import { IconPosition } from "./input";

interface SearchBarProps extends TextInputProps {
  debounceMs?: number;
  onSearch?: (value: string) => void;
  showSearchIcon?: boolean;
  searchIconPosition?: IconPosition;
  showClearButton?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  iconStyle?: TextStyle;
  error?: boolean;
}

export const SearchBar = ({
  debounceMs = 400,
  onSearch,
  showSearchIcon = true,
  searchIconPosition = "left",
  showClearButton = true,
  containerStyle,
  inputStyle,
  iconStyle,
  error,
  ...textInputProps
}: SearchBarProps) => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, debounceMs);
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    onSearch?.(debouncedValue);
  }, [debouncedValue, onSearch]);

  const clearValue = () => {
    setValue("");
    onSearch?.("");
  };

  return (
    <ThemeView
      row
      centered
      rounded
      backgroundColor={theme.colors.background.default}
      style={[styles.container, containerStyle, error && styles.errorContainer]}
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
        value={value}
        onChangeText={setValue}
        style={[styles.input, inputStyle]}
      />

      {showClearButton && value.length > 0 && (
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
          onPress={() => onSearch?.(value)}
        />
      )}
    </ThemeView>
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
