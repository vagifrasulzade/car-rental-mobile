import { View, Text, ScrollView, TouchableOpacity, Image, Switch } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import useTheme from "@/hooks/use-theme";
import { useAvatarStore } from "@/store/use-avatar.state";
import { useCallback } from "react";

const menuItems = [
  { id: 1, icon: "person-outline", title: "Personal Information", type: "ionicons", route: "/(tabs)/profile/personal-information", hasToggle: false },
  { id: 2, icon: "card-outline", title: "Driver License", type: "ionicons", route: "/(tabs)/profile/driver-license", hasToggle: false },
  { id: 3, icon: "settings-outline", title: "Settings", type: "ionicons", route: "/(tabs)/settings", hasToggle: false },
  { id: 4, icon: "log-out-outline", title: "Log Out", type: "ionicons", isLogout: true, hasToggle: false },
];

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [personalInfo, setPersonalInfo] = useState({ name: "Guest User", email: "Not provided", membership: "Regular" });
  const { colorScheme, toggleTheme, theme } = useTheme();
  const { avatar, loadAvatar } = useAvatarStore();
  const isDark = colorScheme === "dark";

  const loadPersonalInfo = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("personalInformation");
      if (data) {
        const parsedData = JSON.parse(data);
        setPersonalInfo({
          name: parsedData.name || "Guest User",
          email: parsedData.email || "Not provided",
          membership: parsedData.membership || "Regular"
        });
      }
    } catch (error) {
      console.error("Error loading personal info:", error);
    }
  }, []);

  useEffect(() => {
    loadPersonalInfo();
    loadAvatar();
  }, [loadAvatar, loadPersonalInfo]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadPersonalInfo();
      loadAvatar();
    }, [loadPersonalInfo, loadAvatar])
  );

  const handleThemeToggle = () => {
    toggleTheme(isDark ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("isAuthenticated");
      router.replace("/signin");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Profile</Text>
        </View>

        {/* Profile Info Card */}
        <View className="mx-5 mb-6">
          <View className="rounded-3xl p-5 flex-row items-center" style={{backgroundColor: isDark ? "#1F2937" : "#FDB74B"}}>
            <Image
              source={{ uri: avatar || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" }}
              className={`w-16 h-16 rounded-full border-2 ${isDark ? "border-yellow-400" : "border-white"}`}
            />
            <View className="ml-4 flex-1">
              <Text className="text-white text-lg font-bold">{personalInfo.name}</Text>
              <Text className={`text-xs mt-0.5 ${isDark ? "text-gray-300" : "text-white/90"}`}>{personalInfo.email}</Text>
              <View className={`mt-2 px-3 py-1.5 rounded-full self-start ${isDark ? "bg-yellow-500/20 border border-yellow-500/30" : "bg-white/20"}`}>
                <Text className={`text-xs font-semibold ${isDark ? "text-yellow-400" : "text-white"}`}>{personalInfo.membership} Member</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-5">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              className={`flex-row items-center justify-between py-4 ${
                index !== menuItems.length - 1 ? `border-b ${isDark ? "border-gray-700" : "border-gray-100"}` : ""
              }`}
              onPress={item.isLogout ? handleLogout : (item.route ? () => router.push(item.route as any) : undefined)}
            >
              <View className="flex-row items-center flex-1">
                <View className={`w-10 h-10 rounded-full items-center justify-center ${
                  item.isLogout 
                    ? (isDark ? "bg-red-900/30" : "bg-red-50")
                    : (isDark ? "bg-gray-800" : "bg-gray-50")
                }`}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={22} 
                    color={item.isLogout ? "#EF4444" : (isDark ? "#FDB74B" : "#6B7280")} 
                  />
                </View>
                <Text className={`ml-4 text-base ${
                  item.isLogout 
                    ? "text-red-500 font-semibold" 
                    : (isDark ? "text-white" : "text-gray-900")
                }`}>
                  {item.title}
                </Text>
              </View>
              {item.hasToggle ? (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: isDark ? "#404040" : "#D1D5DB", true: "#FDB74B" }}
                  thumbColor="#ffffff"
                />
              ) : (
                <Ionicons name="chevron-forward" size={20} color={isDark ? "#6B7280" : "#9CA3AF"} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <View className="items-center py-8">
          <Text className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>App Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
