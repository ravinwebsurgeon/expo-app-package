import { Dimensions, PixelRatio } from "react-native";

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base guideline sizes are from a standard mobile screen (e.g. iPhone 11)
const BASE_HEIGHT = 812;
const BASE_WIDTH = 430; // your Figma frame width

export const scaleFont = (px: number) => {
  const calpx = (px * SCREEN_WIDTH) / BASE_WIDTH;
  return calpx;
};

export const verticalScale = (size: number) => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};
export const horizontalScale = (size: number) => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

export const moderateScale = (size: number, factor: number = 0.5) => {
  return size + (horizontalScale(size) - size) * factor;
};

export const fontScale = (size: number) => {
  return size / PixelRatio.getFontScale();
};
