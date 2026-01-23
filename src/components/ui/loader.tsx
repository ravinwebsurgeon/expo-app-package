import { Theme, useTheme } from "@/src/theme";
import { useMemo } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import ThemeView from "../primitives/ThemeView";

type LoaderProps = {
  fullScreen?: boolean;
  color?: string;
  backgroundColor?: string;
  size?: number | "small" | "large";
};
const Loader = ({
  fullScreen = true,
  color,
  backgroundColor,
  size = "small",
}: LoaderProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <ThemeView
      style={[
        styles.container,
        fullScreen ? styles.fullscreen : styles.center,
        { backgroundColor: backgroundColor ?? theme.colors.backdrop },
      ]}
    >
      <ActivityIndicator size={size} color={color} />
    </ThemeView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    fullscreen: {
      flex: 1,
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
    },

    container: {
      zIndex: 999,
    },
  });

export default Loader;
