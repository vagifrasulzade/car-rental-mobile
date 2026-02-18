import PersonalInformationForm from "@/components/screens/profile/personal-information/personal-information.form";
import useTheme from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAvatarStore } from "@/store/use-avatar.state";
import * as ImagePicker from "expo-image-picker";
import { useEffect } from "react";
import { ur } from "zod/v4/locales";

export default function PersonalInformation() {
    const { colorScheme } = useTheme();
    const isDark = colorScheme === "dark";

    const {avatar, setAvatar, loadAvatar} = useAvatarStore();

    useEffect(() => {
        loadAvatar();
    }, [loadAvatar]);

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permission.granted === false) {
            Alert.alert("Permission Required",
                "Please grant permission to access your media library"
            );
            return
        }

        Alert.alert("Upload Avatar", "Choose an option",
            [
                {
                    text: "Take a photo",
                    onPress: async () => {
                        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync()
                        if (cameraPermission.granted) {
                            const result = await ImagePicker.launchCameraAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                aspect: [4, 3],
                                quality: 1,
                            });
                            if (!result.canceled) {
                                await setAvatar(result.assets[0].uri);
                            }
                        }
                    }
                },
                {
                    text: "Choose from library",
                    onPress: async () => {
                        const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (libraryPermission.granted) {
                            const result = await ImagePicker.launchImageLibraryAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                aspect: [4, 3],
                                quality: 1,
                            });
                            if (!result.canceled) {
                                await setAvatar(result.assets[0].uri);
                            }
                        }
                    }
                },
                {
                    text: "Cancel",
                    onPress: () => {
                        console.log("Cancel");
                    }
                }
            ],
            { cancelable: true }
        );
    }


    return (
        <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}>
            {/* Header */}
            <View className="px-5 pt-4 pb-6 flex-row items-center">
                <TouchableOpacity onPress={() => router.push("/(tabs)/profile")} className="mr-4">
                    <Ionicons name="chevron-back" size={24} color={isDark ? "white" : "#111827"} />
                </TouchableOpacity>
                <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Personal Information</Text>
            </View>
            
            {/* Avatar Section */}
            <View className="px-5 pb-6 items-center">
                <View className="relative">
                    <View className={`w-32 h-32 rounded-full overflow-hidden border-4 ${isDark ? "border-gray-700" : "border-gray-200"} shadow-lg`}>
                        <Image 
                            key={avatar || 'default'}
                            source={avatar ? { uri: avatar } : require('@/assets/images/profile.png')} 
                            className="w-full h-full"
                            contentFit="cover"
                            cachePolicy="none"
                        />
                    </View>
                    <TouchableOpacity 
                        className="absolute bottom-0 right-0 bg-[#FDB74B] rounded-full p-2.5 shadow-lg"
                        onPress={pickImage}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="camera" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <PersonalInformationForm />
        </SafeAreaView>
    )
}