import { LocalizedStrings } from "@/src/i18n/localizedStrings";
import { Theme, useTheme } from "@/src/theme";
import {
  CustomMediaType,
  MediaDataType,
  pickImageFromLibrary,
  takePicture,
} from "@/src/utils/media";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/src/utils/scale";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

interface MediaPickerProps {
  label?: string;
  icon?: string;
  allowedTypes?: CustomMediaType;
  placeholder?: string;
  selectMultiple?: boolean;
  onSelect?: (media: MediaDataType | MediaDataType[]) => void;
}

const MediaPicker = ({
  label,
  icon,
  onSelect,
  placeholder,
  allowedTypes,
  selectMultiple = false,
}: MediaPickerProps) => {
  const theme = useTheme();

  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const openPicker = () => {
    Alert.alert("Select Media", "", [
      {
        text: "Camera",
        onPress: handleCamera,
      },
      {
        text: "Gallery",
        onPress: handleGallery,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handleCamera = async () => {
    const uri = await takePicture();
    if (uri) {
      onSelect?.({
        uri,
        type: ImagePicker.MediaTypeOptions.Images,
      });
    }
  };

  const handleGallery = async () => {
    const media = await pickImageFromLibrary(allowedTypes, selectMultiple);
    if (media) {
      onSelect?.(media);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Pressable style={styles.box} onPress={openPicker}>
        <Feather
          name={icon ?? "image"}
          size={moderateScale(18)}
          color={theme.colors.icon}
        />

        <Text style={styles.overlayText}>
          {t(placeholder ?? LocalizedStrings.PLACEHOLDER.SELECT_MEDIA)}
        </Text>
      </Pressable>
    </View>
  );
};

export default MediaPicker;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: verticalScale(8),
    },
    label: {
      fontSize: moderateScale(14),
      fontWeight: "500",
      color: theme.colors.text.primary,
    },
    box: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: moderateScale(10),
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: moderateScale(12),
      gap: horizontalScale(10),
      minHeight: verticalScale(48),
      backgroundColor: theme.colors.background.default,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,

      alignItems: "center",
      justifyContent: "center",
    },
    overlayText: {
      color: theme.colors.text.primary,
      fontSize: moderateScale(14),
      fontWeight: "600",
    },
  });
