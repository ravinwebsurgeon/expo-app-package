import { Theme, useTheme } from "@/src/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/src/utils/scale";
import React, { useMemo, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { ThemeText } from "../primitives/ThemeText";

interface CountryPickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  icon?: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
}

const CountryPickerComponent = <T extends FieldValues>({
  control,
  name,
  label,
  containerStyle,
  inputStyle,
}: CountryPickerProps<T>) => {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState }) => {
        const country: Country | undefined = value;

        return (
          <View style={[styles.container, containerStyle]}>
            {label && <ThemeText style={styles.label}>{label}</ThemeText>}

            <TouchableOpacity
              style={[styles.input, inputStyle]}
              onPress={() => setVisible(true)}
            >
              <CountryPicker
                withFlagButton={false}
                visible={visible}
                withFlag
                withCallingCode
                withFilter
                withEmoji
                countryCode={(country?.cca2 as CountryCode) || "IN"}
                onSelect={(selectedCountry) => {
                  onChange({
                    cca2: selectedCountry.cca2,
                    callingCode: selectedCountry.callingCode[0],
                  });
                  setVisible(false);
                }}
                onClose={() => setVisible(false)}
              />

              <ThemeText style={styles.text}>
                {country?.callingCode ? `+${country.callingCode}` : "+91"}
              </ThemeText>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: verticalScale(8),
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: moderateScale(10),
      borderColor: theme.colors.border,
      maxHeight: verticalScale(48),
    },
    label: {
      fontSize: moderateScale(14),
      fontWeight: "500",
    },
    input: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: moderateScale(10),

      maxWidth: horizontalScale(70),
      minHeight: verticalScale(48),
    },
    text: {
      fontSize: moderateScale(14),
    },
  });

export default CountryPickerComponent;
