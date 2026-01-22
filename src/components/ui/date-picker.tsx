import { Theme, useTheme } from "@/src/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/src/utils/scale";
import Feather from "@expo/vector-icons/Feather";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import ThemeView from "../primitives/ThemeView";
import { IconPosition } from "./input";

export type DatePickerMode = "date" | "time" | "datetime";

interface DatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T>;
  label?: string;
  placeholder?: string;
  mode?: DatePickerMode;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  errorStyle?: ViewStyle;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
}

const DatePickerComponent = <T extends FieldValues>({
  control,
  name,
  rules,
  label,
  placeholder = "Select date",
  mode = "date",
  minDate,
  maxDate,
  disabled = false,
  containerStyle,
  inputStyle,
  icon,
  iconPosition = "left",
}: DatePickerProps<T>) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [open, setOpen] = useState(false);

  const formatValue = (value?: Date) => {
    if (!value) return placeholder;

    if (mode === "time") {
      return value.toLocaleTimeString();
    }

    if (mode === "datetime") {
      return value.toLocaleString();
    }

    return value.toLocaleDateString();
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState }) => (
        <View style={[styles.container, containerStyle]}>
          {label && <Text style={styles.label}>{label}</Text>}

          <Pressable
            disabled={disabled}
            onPress={() => setOpen((prev) => !prev)}
            style={[
              styles.input,
              inputStyle,
              disabled && styles.disabled,
              fieldState.error && styles.errorBorder,
            ]}
          >
            <ThemeView row>
              {iconPosition === "left"
                ? (icon ?? (
                    <Feather
                      name={mode === "time" ? "clock" : "calendar"}
                      size={moderateScale(18)}
                      color={theme.colors.text.secondary}
                    />
                  ))
                : null}
              <Text style={[styles.text, !value && styles.placeholder]}>
                {formatValue(value)}
              </Text>
            </ThemeView>

            {iconPosition === "right"
              ? (icon ?? (
                  <Feather
                    name={mode === "time" ? "clock" : "calendar"}
                    size={moderateScale(18)}
                    color={theme.colors.text.secondary}
                  />
                ))
              : null}
          </Pressable>

          <Modal
            visible={open}
            transparent
            animationType="fade"
            onRequestClose={() => setOpen(false)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setOpen(false)}
            >
              <Pressable style={styles.modalContent}>
                <DateTimePicker
                  value={value ?? new Date()}
                  mode={mode === "datetime" ? "date" : mode}
                  display={mode === "time" ? "spinner" : "inline"}
                  minimumDate={minDate}
                  maximumDate={maxDate}
                  onChange={(
                    event: DateTimePickerEvent,
                    selectedDate?: Date,
                  ) => {
                    if (event.type === "set" && selectedDate) {
                      onChange(selectedDate);
                    }
                    setOpen(false);
                  }}
                />
              </Pressable>
            </Pressable>
          </Modal>

          {fieldState.error?.message && (
            <Text style={styles.errorText}>{fieldState.error.message}</Text>
          )}
        </View>
      )}
    />
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: verticalScale(6),
    },
    label: {
      fontSize: moderateScale(14),
      fontWeight: "500",
      color: theme.colors.text.primary,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: moderateScale(10),
      paddingHorizontal: horizontalScale(12),
      minHeight: verticalScale(48),
      backgroundColor: theme.colors.background.default,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: horizontalScale(10),
    },
    text: {
      fontSize: moderateScale(16),
      color: theme.colors.text.primary,
    },
    placeholder: {
      color: theme.colors.inputPlaceHolder,
    },
    errorBorder: {
      borderColor: theme.colors.error.main,
    },
    errorText: {
      fontSize: moderateScale(12),
      color: theme.colors.error.main,
    },
    disabled: {
      opacity: 0.5,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
    },

    modalContent: {
      backgroundColor: theme.colors.background.default,
      borderRadius: moderateScale(12),
      padding: moderateScale(16),
    },
  });

export default DatePickerComponent;
