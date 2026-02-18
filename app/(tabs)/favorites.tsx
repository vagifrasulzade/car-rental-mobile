import { View, Text } from "react-native";
import useTheme from "@/hooks/use-theme";


export default function FavoritesScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  return (
    <View className={`flex-1 justify-center items-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Favorites</Text>
      <Text className={`${isDark ? "text-gray-400" : "text-gray-500"} mt-2`}>Your favorite cars will appear here</Text>
    </View>
  );
}
