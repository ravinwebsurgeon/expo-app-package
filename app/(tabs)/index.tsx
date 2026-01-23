import ScreenLayout from "@/components/shared/layout/screen_layout";
import Button from "@/components/ui/button";
import { LocalizedStrings } from "@/src/i18n/localizedStrings";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

const HomeScreen = () => {
  const { t } = useTranslation();
  const { logout, isLoading } = useAuthStore();

  const handleLogout = async () => {
    try {
      const responseMsg = await logout();
      Alert.alert(responseMsg);
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <ScreenLayout showLoader={isLoading}>
      <Button
        title={t(LocalizedStrings.EXTRAS.LOGOUT)}
        onPress={handleLogout}
      />
    </ScreenLayout>
  );
};

export default HomeScreen;
