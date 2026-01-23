import { LocalizedStrings } from "@/src/i18n/localizedStrings";
import { Theme, useTheme } from "@/src/theme";
import {
    horizontalScale,
    moderateScale,
    verticalScale,
} from "@/src/utils/scale";
import React, { useMemo, useRef, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export interface TagOption<T = string> {
  label: string;
  value: T;
}

interface TagSelectProps<TFieldValues extends FieldValues, TValue = string> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  options: TagOption<TValue>[];
  selectMultiple?: boolean;
  placeholder?: string;
  emptyText?: string;
}

const TagSelect = <TFieldValues extends FieldValues, TValue = string>({
  name,
  control,
  label,
  options,
  selectMultiple = true,
  placeholder,
  emptyText = "No results found",
}: TagSelectProps<TFieldValues, TValue>) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { t } = useTranslation();

  const inputRef = useRef<View>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const filteredOptions = useMemo(() => {
    if (!query) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, options]);

  const openDropdown = () => {
    inputRef.current?.measureInWindow((x, y, width) => {
      setPosition({ left: x, top: y, width });
      setOpen(query.length > 0);
    });
  };

  const closeDropdown = () => setOpen(false);

  /* =======================
     Helpers (outside Controller)
     ======================= */

  const getSelected = (value: any): TagOption<TValue>[] => {
    if (selectMultiple) {
      return Array.isArray(value) ? value : [];
    }
    return value && typeof value === "object" ? [value] : [];
  };

  const isSelected = (selected: TagOption<TValue>[], opt: TagOption<TValue>) =>
    selected.some((s) => s.value === opt.value);

  const handleSelect = (
    selected: TagOption<TValue>[],
    opt: TagOption<TValue>,
    onChange: (val: any) => void,
  ) => {
    if (selectMultiple) {
      if (isSelected(selected, opt)) {
        onChange(selected.filter((s) => s.value !== opt.value));
      } else {
        onChange([...selected, opt]);
      }
    } else {
      onChange(opt);
    }
    setQuery("");
  };

  const handleRemove = (
    selected: TagOption<TValue>[],
    opt: TagOption<TValue>,
    onChange: (val: any) => void,
  ) => {
    if (selectMultiple) {
      onChange(selected.filter((s) => s.value !== opt.value));
    } else {
      onChange(null);
      setQuery("");
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => {
        const selected = getSelected(value);

        return (
          <View style={styles.container}>
            {!!label && <Text style={styles.label}>{label}</Text>}

            {/* Input */}
            <Pressable
              ref={inputRef}
              style={styles.inputWrapper}
              onPress={openDropdown}
            >
              <TextInput
                value={query}
                onChangeText={(text) => {
                  setQuery(text);
                  openDropdown();
                }}
                onBlur={closeDropdown}
                placeholder={t(
                  placeholder ?? LocalizedStrings.PLACEHOLDER.SELECT,
                )}
                style={styles.input}
              />
            </Pressable>

            {/* Selected Tags */}
            <View style={styles.tags}>
              {selected.map((opt) => (
                <View key={String(opt.value)} style={styles.tag}>
                  <Text style={styles.tagText}>{opt.label}</Text>
                  <Pressable
                    onPress={() => handleRemove(selected, opt, onChange)}
                  >
                    <Text style={styles.tagRemove}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>

            {/* Dropdown */}
            {open && query.length > 0 && (
              <View
                style={[
                  styles.dropdown,
                  theme.shadows[2],
                  {
                    top: position.top,
                    left: position.left,
                    width: position.width,
                  },
                ]}
              >
                {filteredOptions.length === 0 ? (
                  <View style={styles.empty}>
                    <Text style={styles.emptyText}>{t(emptyText)}</Text>
                  </View>
                ) : (
                  <FlatList
                    keyboardShouldPersistTaps="handled"
                    data={filteredOptions}
                    keyExtractor={(item) => String(item.value)}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => handleSelect(selected, item, onChange)}
                        style={[
                          styles.option,
                          isSelected(selected, item) && styles.optionSelected,
                        ]}
                      >
                        <Text>{item.label}</Text>
                      </Pressable>
                    )}
                  />
                )}
              </View>
            )}
          </View>
        );
      }}
    />
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { gap: verticalScale(10) },
    label: { fontSize: moderateScale(14), fontWeight: "600" },
    inputWrapper: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: moderateScale(10),
      paddingHorizontal: horizontalScale(10),
      paddingVertical: verticalScale(16),
    },
    input: { color: theme.colors.text.primary },
    tags: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: horizontalScale(6),
    },
    tag: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.info.main + "20",
      borderRadius: moderateScale(10),
      paddingHorizontal: horizontalScale(10),
      paddingVertical: verticalScale(8),
      gap: horizontalScale(6),
    },
    tagText: {
      color: theme.colors.info.main,
      fontWeight: "500",
    },
    tagRemove: {
      fontSize: moderateScale(16),
      color: theme.colors.info.main,
    },
    dropdown: {
      position: "absolute",
      backgroundColor: theme.colors.background.default,
      borderRadius: moderateScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      maxHeight: verticalScale(220),
      zIndex: 999,
    },
    option: { padding: moderateScale(12) },
    optionSelected: {
      backgroundColor: theme.colors.info.main + "20",
    },
    empty: { padding: moderateScale(16), alignItems: "center" },
    emptyText: {
      color: theme.colors.text.secondary,
      fontSize: moderateScale(14),
    },
  });

export default TagSelect;
