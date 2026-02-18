import useTheme from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import DriverLisenceForm from "@/components/screens/profile/driver-lisence/driver-lisence.form";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";

export default function DriverLicense() {
    const { colorScheme } = useTheme()
    const isDark = colorScheme === "dark";
    const [showForm, setShowForm] = useState(false);
    const [licenseData, setLicenseData] = useState<any>(null);

    const loadLicenseData = useCallback(async () => {
        try {
            const data = await AsyncStorage.getItem("driverLicense");
            if (data) {
                setLicenseData(JSON.parse(data));
                setShowForm(false);
            } else {
                setShowForm(false);
            }
        } catch (error) {
            console.error("Error loading license data:", error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadLicenseData();
        }, [loadLicenseData])
    );

    const handleFormSuccess = () => {
        loadLicenseData();
        setShowForm(false);
    };

    return (
        <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}>
            <View className="px-5 pt-4 pb-6 flex-row items-center">
                <TouchableOpacity onPress={() => router.push("/profile")} className="mr-4">
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={isDark ? "white" : "#111827"}
                    />
                </TouchableOpacity>
                <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Driver License</Text>
            </View>
            
            {showForm ? (
                <DriverLisenceForm onSuccess={handleFormSuccess} />
            ) : licenseData ? (
                <ScrollView className="flex-1 px-5">
                    {/* License Info Card */}
                    <View className={`rounded-3xl p-6 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                        {/* License Image */}
                        {licenseData.driverLicenseImage && (
                            <View className="mb-5">
                                <Image
                                    key={licenseData.driverLicenseImage}
                                    source={{ uri: licenseData.driverLicenseImage }}
                                    className="w-full h-48 rounded-2xl"
                                    contentFit="cover"
                                    cachePolicy="none"
                                />
                            </View>
                        )}

                        {/* License Details */}
                        <View className="gap-4">
                            <View>
                                <Text className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>License Number</Text>
                                <Text className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{licenseData.driverLicenseNumber}</Text>
                            </View>

                            <View>
                                <Text className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Expiry Date</Text>
                                <Text className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{licenseData.driverLicenseExpiryDate}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Edit Button */}
                    <TouchableOpacity
                        onPress={() => setShowForm(true)}
                        className="mt-5 py-4 rounded-2xl items-center flex-row justify-center"
                        style={{ backgroundColor: "#FDB74B" }}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="create-outline" size={20} color="white" />
                        <Text className="text-white font-bold text-base ml-2">Edit License</Text>
                    </TouchableOpacity>
                </ScrollView>
            ) : (
                <View className="flex-1 px-5 justify-center items-center">
                    <View className={`w-24 h-24 rounded-full items-center justify-center mb-6 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                        <Ionicons name="card-outline" size={48} color="#FDB74B" />
                    </View>
                    <Text className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>No License Added</Text>
                    <Text className={`text-center mb-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Add your driver license information to continue</Text>
                    <TouchableOpacity
                        onPress={() => setShowForm(true)}
                        className="py-4 px-8 rounded-2xl items-center"
                        style={{ backgroundColor: "#FDB74B" }}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-base">Add Driver License</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}
