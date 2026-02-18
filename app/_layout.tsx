import ThemeProvider from "@/context/theme-provider";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
