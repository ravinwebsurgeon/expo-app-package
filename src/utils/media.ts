import * as ImagePicker from "expo-image-picker";
import { t } from "i18next";
import { Alert, Platform } from "react-native";

export type CustomMediaType =
  | ImagePicker.MediaTypeOptions
  | ImagePicker.MediaType
  | ImagePicker.MediaType[];

export type MediaDataType = {
  uri: string;
  type?: CustomMediaType;
};
const requestCameraPermissions = async () => {
  if (Platform.OS !== "web") {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("auth.uploadPhoto.permissionRequired", {
          defaultValue: "Permission Required",
        }),
        t("auth.uploadPhoto.cameraPermissionMessage", {
          defaultValue: "Sorry, we need camera permissions to take photos!",
        }),
      );
      return false;
    }
  }
  return true;
};

export const takePicture = async () => {
  const hasPermission = await requestCameraPermissions();
  if (!hasPermission) return;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) return result.assets[0].uri;
  return null;
};
export const requestMediaLibraryPermissions = async () => {
  if (Platform.OS !== "web") {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("auth.uploadPhoto.permissionRequired", {
          defaultValue: "Permission Required",
        }),
        t("auth.uploadPhoto.libraryPermissionMessage", {
          defaultValue:
            "Sorry, we need photo library permissions to select photos!",
        }),
      );
      return false;
    }
  }
  return true;
};

export const pickImageFromLibrary = async (
  allowedTypes?: CustomMediaType,
  selectMultiple?: boolean,
): Promise<MediaDataType[] | null> => {
  const hasPermission = await requestMediaLibraryPermissions();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: allowedTypes ?? ImagePicker.MediaTypeOptions.Images,
    allowsEditing: !selectMultiple,
    allowsMultipleSelection: selectMultiple ?? false,
    quality: 0.8,
  });

  if (result.canceled) return null;

  return result.assets.map((asset) => ({
    uri: asset.uri,
    type: allowedTypes,
  }));
};
