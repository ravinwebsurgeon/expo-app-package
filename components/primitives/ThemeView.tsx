import { Theme, useTheme } from "@/src/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/src/utils/scale";
import React from "react";
import { StyleSheet, View, ViewProps, ViewStyle } from "react-native";

export type ThemeViewProps = ViewProps & {
  backgroundColor?: string;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  padded?: boolean | "xs" | "sm" | "md" | "lg" | "xl";
  margin?: boolean | "xs" | "sm" | "md" | "lg" | "xl";
  rounded?: boolean | "sm" | "md" | "lg" | "full";
  centered?: boolean;
  row?: boolean;
};

const ThemeView: React.FC<ThemeViewProps> = ({
  backgroundColor,
  elevation = 0,
  padded,
  margin,
  rounded,
  centered,
  row,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  /* Helpers */
  const getSpacingStyle = (
    type: "padding" | "margin",
    value: ThemeViewProps["padded"],
  ) => {
    if (value === true) return `${type}_md`;
    return `${type}_${value}`;
  };

  const getRadiusStyle = (value: ThemeViewProps["rounded"]) => {
    if (value === true) return "radius_md";
    return `radius_${value}`;
  };
  const containerStyles: ViewStyle[] = [
    row && styles.row,
    centered && styles.centered,
    padded && styles[getSpacingStyle("padding", padded)],
    margin && styles[getSpacingStyle("margin", margin)],
    rounded && styles[getRadiusStyle(rounded)],
    elevation > 0 && styles[`elevation${elevation}`],
    backgroundColor && {
      backgroundColor:
        theme.colors?.[backgroundColor as keyof Theme["colors"]] ??
        backgroundColor,
    },
    style,
  ];

  return (
    <View style={containerStyles} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: horizontalScale(10),
    alignItems: "center",
  },

  centered: {
    alignItems: "center",
    justifyContent: "center",
  },

  /* Padding */
  padding_xs: { padding: horizontalScale(6) },
  padding_sm: { padding: horizontalScale(10) },
  padding_md: { padding: horizontalScale(14) },
  padding_lg: { padding: horizontalScale(18) },
  padding_xl: { padding: horizontalScale(24) },

  /* Margin */
  margin_xs: { margin: horizontalScale(6) },
  margin_sm: { margin: horizontalScale(10) },
  margin_md: { margin: horizontalScale(14) },
  margin_lg: { margin: horizontalScale(18) },
  margin_xl: { margin: horizontalScale(24) },

  /* Radius */
  radius_sm: { borderRadius: moderateScale(6) },
  radius_md: { borderRadius: moderateScale(10) },
  radius_lg: { borderRadius: moderateScale(16) },
  radius_full: { borderRadius: 9999 },

  /* Elevation */
  elevation1: {
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: moderateScale(2),
    shadowOffset: { width: 0, height: verticalScale(1) },
  },
  elevation2: {
    elevation: 2,
    shadowOpacity: 0.12,
    shadowRadius: moderateScale(4),
    shadowOffset: { width: 0, height: verticalScale(2) },
  },
  elevation3: {
    elevation: 3,
    shadowOpacity: 0.16,
    shadowRadius: moderateScale(6),
    shadowOffset: { width: 0, height: verticalScale(3) },
  },
  elevation4: {
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(8),
    shadowOffset: { width: 0, height: verticalScale(4) },
  },
  elevation5: {
    elevation: 6,
    shadowOpacity: 0.24,
    shadowRadius: moderateScale(12),
    shadowOffset: { width: 0, height: verticalScale(6) },
  },
});

export default ThemeView;
