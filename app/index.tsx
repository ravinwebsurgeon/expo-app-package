import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/authStore";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated } = useAuthStore.getState();
  const path = isAuthenticated ? ROUTES.APP.HOME : ROUTES.AUTH.WELCOME;

  // Redirect to tabs if authenticated, otherwise to  welcome screen
  return <Redirect href={path} />;
}
