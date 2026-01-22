import { useTheme } from "@/src/theme";
import {
    horizontalScale,
    moderateScale,
    verticalScale,
} from "@/src/utils/scale";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    type StyleProp,
    type ViewStyle,
} from "react-native";

export interface BackButtonProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  iconColor?: string;
  iconSize?: number;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  style,
  iconColor,
  iconSize,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: theme.colors.primary.main },
        style,
      ]}
      hitSlop={styles.hitSlop}
    >
      <Ionicons
        name="arrow-back-sharp"
        size={iconSize ?? moderateScale(16)}
        color={iconColor || theme.colors.white}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    aspectRatio: 1,
    height: verticalScale(36),
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  hitSlop: {
    top: verticalScale(10),
    bottom: verticalScale(10),
    left: horizontalScale(1),
    right: horizontalScale(1),
  },
});

export default BackButton;
