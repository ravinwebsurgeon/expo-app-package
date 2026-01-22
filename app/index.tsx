import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to tabs if authenticated, otherwise to auth signup screen
  return <Redirect href={"/welcome"} />;
}
