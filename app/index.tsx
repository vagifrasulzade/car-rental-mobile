import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, ImageBackground } from "expo-image";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Pressable, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Index() {
  const w = useWindowDimensions().width;
  const h = useWindowDimensions().height;
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuthenticated = async () => {
    const isAuthenticated = await AsyncStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      setIsAuthenticated(false);
    } else if (isAuthenticated === "true") {
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <SafeAreaView className="flex-1">
      <ImageBackground
        source={require("../assets/images/First.jpg")}
        style={{ width: "100%", height: "100%" }}>
        <View className="flex-1 justify-between pb-6">
          <Text className="mt-[96px] w-[260px] text-left text-4xl font-semibold leading-tight text-white ml-6">
            Find and rent car in easy steps.
          </Text>
          <Pressable
            className="mb-6 h-14 w-[317px] flex-row items-center justify-center rounded-2xl bg-[#FF5C00] self-center"
            onPress={() => router.push("/signin")}
          >
            <Text className="text-lg font-bold text-white">Let's Go</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}