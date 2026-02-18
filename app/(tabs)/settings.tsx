import useTheme from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, Switch, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
    const { colorScheme, toggleTheme } = useTheme();
    const isDark = colorScheme === "dark";

    const handleToggleTheme = () => {
        toggleTheme(isDark ? "light" : "dark")
    }

    return (
        <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}>
            <ScrollView className="flex-1">
                {/* Header */}
                <View className="px-5 pt-4 pb-6 flex-row items-center">
                    <TouchableOpacity onPress={() => router.push("/(tabs)/profile")} className="mr-4">
                        <Ionicons name="chevron-back" size={24} color={isDark ? "white" : "#111827"} />
                    </TouchableOpacity>
                    <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Settings</Text>
                </View>

                {/* Settings Card */}
                <View className="mx-5 mt-4">
                    <View className={`rounded-2xl p-5 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                        <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Preferences</Text>
                        
                        {/* Theme Toggle */}
                        <View className="flex-row items-center justify-between py-3">
                            <View className="flex-row items-center flex-1">
                                <View className={`w-12 h-12 rounded-full items-center justify-center ${isDark ? "bg-gray-700" : "bg-white"}`}>
                                    <Ionicons 
                                        name={isDark ? "moon" : "sunny"} 
                                        size={24} 
                                        color="#FDB74B"
                                    />
                                </View>
                                <View className="ml-4 flex-1">
                                    <Text className={`text-base font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                                        Dark Mode
                                    </Text>
                                    <Text className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                        {isDark ? "Dark theme is enabled" : "Light theme is enabled"}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={isDark}
                                onValueChange={handleToggleTheme}
                                trackColor={{ false: "#D1D5DB", true: "#FDB74B" }}
                                thumbColor="#ffffff"
                                ios_backgroundColor="#D1D5DB"
                            />
                        </View>
                    </View>
                </View>

                {/* Info Section */}
                <View className="px-5 mt-8">
                    <Text className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        Customize your app experience by switching between light and dark themes.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
