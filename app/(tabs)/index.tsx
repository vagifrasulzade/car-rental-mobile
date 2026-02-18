import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "@/hooks/use-theme";
import BrandLogo from "@/components/screens/main/brand-logo";
import CarBrands from "@/components/screens/main/car-brands";
import { useAvatarStore } from "@/store/use-avatar.state";
import { useEffect } from "react";



export default function HomeScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const { avatar, loadAvatar } = useAvatarStore();

  useEffect(() => {
    loadAvatar();
  }, [loadAvatar]);

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className={`${isDark ? "bg-gray-900" : "bg-white"} px-5 pt-2 pb-5`}>
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="bg-yellow-400 p-2.5 rounded-full mr-3">
                <Ionicons name="location" size={18} color="white" />
              </View>
              <View>
                <Text className={`${isDark ? "text-gray-400" : "text-gray-500"} text-xs`}>Your location</Text>
                <View className="flex-row items-center">
                  <Text className={`${isDark ? "text-white" : "text-black"} font-bold text-base`}>Ngangphaf,Selman</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={20} color={isDark ? "white" : "black"} />
                </View>
              </View>
            </View>
            <Image
              key={avatar || 'default'}
              source={avatar ? { uri: avatar } : require("@/assets/images/profile.png")}
              className="w-20 h-20 rounded-full"
              contentFit="cover"
              cachePolicy="none"
            />
          </View>
        </View>

        <View className="px-5">
          {/* Title */}
          <Text className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"} mt-6 leading-tight`}>
            Find your favourite{"\n"}vechicle.
          </Text>

          {/* Search Bar */}
          <View className={`${isDark ? "bg-gray-800" : "bg-gray-50"} flex-row items-center px-5 py-4 rounded-full mt-6`} style={{shadowColor: "#000", shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1}}>
            <Ionicons name="search" size={22} color="#6B7280" />
            <TextInput
              placeholder="Search vechicle"
              placeholderTextColor="#9CA3AF"
              className={`flex-1 ml-3 text-base ${isDark ? "text-gray-200" : "text-gray-700"}`}
            />
          </View>

          {/* Top Brands */}
          <BrandLogo />

          {/* Available Near You */}
          <CarBrands />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
