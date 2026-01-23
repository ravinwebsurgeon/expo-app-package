import { Theme, useTheme } from "@/src/theme";
import { horizontalScale, verticalScale } from "@/src/utils/scale";
import { router } from "expo-router";
import React, { ReactNode, useMemo } from "react";
import {
  ImageBackground,
  ImageResizeMode,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ViewStyle
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../ui/back-button";
import Loader from "../../ui/loader";

interface ScreenLayoutProps {
  children: ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  keyboardVerticalOffset?: number;
  scrollEnabled?: boolean;
  backgroundImage?: ImageSourcePropType;
  backgroundImageResizeMode?: ImageResizeMode;
  backgroundColor?: string;
  showBackButton?: boolean;
  showLoader?: boolean;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  style,
  contentContainerStyle,
  keyboardVerticalOffset = 80,
  scrollEnabled = true,
  backgroundImage,
  backgroundImageResizeMode = "cover",
  backgroundColor,
  showBackButton = false,
  showLoader = false,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={[styles.container, style]}
      >
        {backgroundImage && (
          <ImageBackground
            source={backgroundImage}
            resizeMode={backgroundImageResizeMode}
            style={styles.background}
          />
        )}
        {showBackButton && (
          <BackButton onPress={router.back} style={styles.backButton} />
        )}
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={scrollEnabled}
          style={
            !backgroundImage && {
              backgroundColor:
                backgroundColor ?? theme.colors.background.default,
            }
          } // make ScrollView transparent
        >
          <SafeAreaView style={{ backgroundColor: "transparent", flex: 1 }}>
            {children}
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
      {showLoader && <Loader />}
    </>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.default,
    },
    background: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    scrollContent: {
      flexGrow: 1,
    },
    backButton: {
      top: verticalScale(50),
      marginHorizontal: horizontalScale(10),
      zIndex: 1,
    },
  });

export default ScreenLayout;
