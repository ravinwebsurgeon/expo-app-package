import { Theme, useTheme } from "@/src/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/src/utils/scale";
import Slider from "@react-native-community/slider";
import React, { useMemo } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ThemeView from "../primitives/ThemeView";

type SliderType = "single" | "range" | "singleWithInput" | "rangeWithInputs";

interface SliderProps {
  label?: string;
  type?: SliderType;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  rangeValue?: [number, number];

  onChange?: (value: number) => void;
  onRangeChange?: (value: [number, number]) => void;
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const CustomSlider = ({
  label,
  type = "single",
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  rangeValue = [20, 80],
  onChange,
  onRangeChange,
}: SliderProps) => {
  const [width, setWidth] = React.useState(0);
  const percent = (v: number) => (v - min) / (max - min);
  const bubbleLeft = (v: number) => percent(v) * (width - 28); // thumb size offset
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const normalizeRange = (
    next: [number, number],
    minLimit: number,
    maxLimit: number,
  ): [number, number] => {
    let [minVal, maxVal] = next;

    minVal = clamp(minVal, minLimit, maxLimit);
    maxVal = clamp(maxVal, minLimit, maxLimit);

    // 🚨 HARD RULES
    if (minVal > maxVal) minVal = maxVal;
    if (maxVal < minVal) maxVal = minVal;

    return [minVal, maxVal];
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={styles.label}>
          {label}: {value}
        </Text>
      )}

      {/* SINGLE */}
      {(type === "single" || type === "singleWithInput") && (
        <ThemeView row style={{ alignItems: "center", gap: 12 }}>
          <View
            style={{ flex: 1 }}
            onLayout={(e: LayoutChangeEvent) =>
              setWidth(e.nativeEvent.layout.width)
            }
          >
            <View style={[styles.bubble, { left: bubbleLeft(value) }]}>
              <Text style={styles.bubbleText}>{value}</Text>
            </View>

            <Slider
              minimumValue={min}
              maximumValue={max}
              step={step}
              value={value}
              minimumTrackTintColor={theme.colors.primary.main}
              maximumTrackTintColor={theme.colors.gray[200]}
              thumbTintColor={theme.colors.white}
              onValueChange={(v) => onChange?.(v)}
            />
          </View>

          {type === "singleWithInput" && (
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(value)}
              onChangeText={(v) => onChange?.(clamp(Number(v), min, max))}
            />
          )}
        </ThemeView>
      )}

      {/* RANGE */}
      {(type === "range" || type === "rangeWithInputs") && (
        <ThemeView row style={{ alignItems: "center", gap: 12 }}>
          {/* LEFT INPUT */}
          {type === "rangeWithInputs" && (
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(rangeValue[0])}
              onChangeText={(v) =>
                onRangeChange?.([
                  clamp(Number(v), min, rangeValue[1]),
                  rangeValue[1],
                ])
              }
            />
          )}

          {/* SLIDER AREA */}
          <View
            style={{ flex: 1 }}
            onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
          >
            {/* LEFT BUBBLE */}
            <View style={[styles.bubble, { left: bubbleLeft(rangeValue[0]) }]}>
              <Text style={styles.bubbleText}>{rangeValue[0]}</Text>
            </View>

            {/* RIGHT BUBBLE */}
            <View style={[styles.bubble, { left: bubbleLeft(rangeValue[1]) }]}>
              <Text style={styles.bubbleText}>{rangeValue[1]}</Text>
            </View>

            {/* LOWER SLIDER */}
            <Slider
              minimumValue={min}
              maximumValue={rangeValue[1]}
              step={step}
              minimumTrackTintColor={theme.colors.primary.main}
              maximumTrackTintColor={theme.colors.gray[200]}
              value={rangeValue[0]}
              onValueChange={(v) =>
                onRangeChange?.(normalizeRange([v, rangeValue[1]], min, max))
              }
            />

            {/* UPPER SLIDER */}
            <Slider
            inverted
              minimumValue={rangeValue[0]}
              maximumValue={max}
              step={step}
              minimumTrackTintColor={theme.colors.primary.main}
              maximumTrackTintColor={theme.colors.gray[200]}
              value={rangeValue[1]}
              onValueChange={(v) =>
                onRangeChange?.(normalizeRange([rangeValue[0], v], min, max))
              }
            />
          </View>

          {/* RIGHT INPUT */}
          {type === "rangeWithInputs" && (
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(rangeValue[1])}
              onChangeText={(v) =>
                onRangeChange?.([
                  rangeValue[0],
                  clamp(Number(v), rangeValue[0], max),
                ])
              }
            />
          )}
        </ThemeView>
      )}
    </View>
  );
};
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {
      gap: verticalScale(16),
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    sliderWrap: {
      position: "relative",
    },
    bubble: {
      position: "absolute",
      top: -verticalScale(36),
      backgroundColor: theme.colors.background.default,
      paddingHorizontal: horizontalScale(10),
      paddingVertical: verticalScale(6),
      borderRadius: moderateScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      elevation: 2,
      zIndex: 10,
    },
    bubbleText: {
      fontSize: moderateScale(14),
      fontWeight: "500",
      color: theme.colors.text.primary,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: moderateScale(10),
      padding: moderateScale(10),
      width: horizontalScale(50),
      textAlign: "center",
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.background.default,
    },
    inputsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: horizontalScale(12),
    },
  });

export default CustomSlider;
