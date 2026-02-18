import useTheme from "@/hooks/use-theme";
import { View, Text } from "react-native";

export default function NotificationsScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  return (
    <View className={`flex-1 justify-center items-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Notifications</Text>
      <Text className={`${isDark ? "text-gray-400" : "text-gray-500"} mt-2`}>You have no new notifications</Text>
    </View>
  );
}
