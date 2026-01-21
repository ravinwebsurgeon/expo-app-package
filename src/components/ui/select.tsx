import { Theme, useTheme } from "@/src/theme";
import {
    horizontalScale,
    moderateScale,
    verticalScale,
} from "@/src/utils/scale";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    Control,
    Controller,
    FieldValues,
    Path,
    RegisterOptions,
} from "react-hook-form";
import {
    FlatList,
    LayoutRectangle,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacityProps,
    View,
    ViewStyle,
} from "react-native";
import ThemeView from "../primitives/ThemeView";

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

interface SelectProps<TFieldValues extends FieldValues, TValue = string> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: SelectOption<TValue>[];
  required?: boolean;
  selectMultiple?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  style?: ViewStyle;
  inputStyle?: ViewStyle;
  dropdownStyle?: ViewStyle;
  optionStyle?: ViewStyle;
  searchInputStyle?: TextStyle;
  labelStyle?: TextStyle;
  textStyle?: TextStyle;
  placeholderStyle?: TextStyle;
  errorStyle?: TextStyle;
  optionTextStyle?: TextStyle;
}

export const Select = <TFieldValues extends FieldValues, TValue = string>({
  control,
  name,
  label,
  placeholder = "Select option",
  options,
  rules,
  selectMultiple = false,
  disabled = false,
  searchable = true,
  searchPlaceholder = "Search...",
  style,
  inputStyle,
  dropdownStyle,
  optionStyle,
  searchInputStyle,
  labelStyle,
  textStyle,
  placeholderStyle,
  errorStyle,
  optionTextStyle,
}: SelectProps<TFieldValues, TValue>) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownLayout, setDropdownLayout] = useState<LayoutRectangle | null>(
    null,
  );
  const buttonRef = useRef<TouchableOpacityProps>(null);

  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, options]);

  const isSelected = (value: any, selected: any) => {
    if (selectMultiple) {
      return Array.isArray(selected) && selected.includes(value);
    }
    return value === selected;
  };

  const handleOpen = useCallback(() => {
    if (disabled) return;

    (buttonRef.current as any)?.measure(
      (
        _x: number,
        _y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number,
      ) => {
        setDropdownLayout({ x: pageX, y: pageY, width, height });
        setOpen(true);
      },
    );
  }, [disabled]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={[styles.container, style]}>
          {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

          {/* Input */}
          <Pressable
            style={[styles.input, inputStyle, disabled && styles.disabled]}
            onPress={handleOpen}
            ref={buttonRef}
          >
            <ThemeView row>
              <Text
                style={
                  value
                    ? [styles.text, textStyle]
                    : [styles.placeholder, placeholderStyle]
                }
              >
                {value
                  ? selectMultiple
                    ? options
                        .filter((o) => value.includes(o.value))
                        .map((o) => o.label)
                        .join(", ")
                    : options.find((o) => o.value === value)?.label
                  : placeholder}
              </Text>

              <Ionicons
                name="chevron-down"
                size={14}
                style={{ marginRight: -2 }}
                color={theme.colors.text.secondary}
              />
            </ThemeView>
          </Pressable>

          {/* Dropdown */}
          {dropdownLayout && (
            <Modal
              visible={open}
              transparent
              animationType="fade"
              onRequestClose={handleClose}
            >
              <Pressable style={{ marginVertical: 10 }} onPress={handleClose} />

              <View
                style={[
                  styles.dropdown,
                  dropdownStyle,
                  {
                    top: dropdownLayout?.y + dropdownLayout.height,
                    left: dropdownLayout.x,
                    width: dropdownLayout.width,
                  },
                ]}
              >
                {searchable && (
                  <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder={searchPlaceholder}
                    style={[styles.searchInput, searchInputStyle]}
                  />
                )}

                <FlatList
                  keyboardShouldPersistTaps="handled"
                  data={filteredOptions}
                  keyExtractor={(_, i) => i.toString()}
                  renderItem={({ item }) => {
                    const selected = isSelected(item.value, value);

                    return (
                      <Pressable
                        style={[
                          styles.row,
                          optionStyle,
                          selected && styles.selectedOption,
                        ]}
                        onPress={() => {
                          if (selectMultiple) {
                            const newValue = selected
                              ? value.filter((v: any) => v !== item.value)
                              : [...(value || []), item.value];
                            onChange(newValue);
                          } else {
                            onChange(item.value);
                            handleClose();
                          }
                        }}
                      >
                        <Ionicons
                          name="checkmark"
                          size={moderateScale(14)}
                          color={
                            selected
                              ? theme.colors.text.primary
                              : theme.colors.transparent
                          }
                        />
                        <Text
                          style={[
                            styles.optionText,
                            optionTextStyle,
                            selected && styles.selectedText,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  }}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>No results found</Text>
                  }
                />
              </View>
            </Modal>
          )}
          {/* Error */}
          {error && (
            <Text style={[styles.error, errorStyle]}>
              {error.message || "This field is required"}
            </Text>
          )}
        </View>
      )}
    />
  );
};

export default Select;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: verticalScale(6),
    },
    label: {
      fontWeight: "500",
      color: theme.colors.text.primary,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: moderateScale(12),
      borderRadius: moderateScale(10),
      backgroundColor: theme.colors.background.default,
    },
    disabled: {
      opacity: 0.5,
    },
    placeholder: {
      color: theme.colors.inputPlaceHolder,
    },
    text: {
      color: theme.colors.text.primary,
    },
    dropdown: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: moderateScale(10),
      backgroundColor: theme.colors.background.default,
      maxHeight: verticalScale(260),
      position: "absolute",
    },
    searchInput: {
      borderBottomWidth: 1,
      color: theme.colors.text.primary,
      borderColor: theme.colors.border,
      padding: moderateScale(12),
    },

    selectedOption: {
      gap: horizontalScale(5),
      backgroundColor: theme.colors.gray[200],
    },
    optionText: {
      color: theme.colors.text.primary,
      paddingVertical: verticalScale(10),
    },
    selectedText: {
      fontWeight: "600",
    },
    emptyText: {
      textAlign: "center",
      color: theme.colors.text.secondary,
    },
    error: {
      color: theme.colors.error.main,
      fontSize: moderateScale(12),
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: horizontalScale(5),
    },
  });
