import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useCallback, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Alert, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import {
    personalInformationSchema,
    PersonalInformationSchemaInput,
    PersonalInformationSchemaType,
} from "./personal-information.schema";
import { useAvatarStore } from "@/store/use-avatar.state";


export default function PersonalInformationForm() {
    const {avatar, setAvatar, loadAvatar} = useAvatarStore();

    const { control, setValue, handleSubmit, formState: { errors } } = useForm<PersonalInformationSchemaInput, any, PersonalInformationSchemaType>(
        {
            resolver: zodResolver(personalInformationSchema),
            defaultValues: {
                avatar: avatar || "",
                name: "",
                email: "",
                phone: "",
                address: "",
                membership: "Regular",
            },
        }
    );
    const onSubmit: SubmitHandler<PersonalInformationSchemaType> = async (data) => {
        try {
            // Save avatar to store (which will automatically save to AsyncStorage)
            if (data.avatar) {
                await setAvatar(data.avatar);
            }

            const previousData = JSON.parse(await AsyncStorage.getItem("personalInformation") || "{}");
            const payload = {
                ...previousData,
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address || "",
                membership: data.membership,
                avatar: data.avatar || previousData.avatar || "",
            };

            await AsyncStorage.setItem("personalInformation", JSON.stringify(payload));
            Alert.alert("Success", "Personal information updated successfully",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            router.push("/(tabs)/profile");
                        }
                    }
                ]
            );
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Failed to update personal information");
        }
    }

    const getPersonalInformationData = useCallback(async () => {
        // Load avatar from AsyncStorage first
        await loadAvatar();
        
        const personalInformation = JSON.parse(await AsyncStorage.getItem("personalInformation") || "{}");
        if (personalInformation) {
            setValue("avatar", personalInformation.avatar || "");
            setValue("name", personalInformation.name || "");
            setValue("email", personalInformation.email || "");
            setValue("phone", personalInformation.phone || "");
            setValue("address", personalInformation.address || "");
            setValue("membership", personalInformation.membership || "Regular");
        }
    }, [loadAvatar, setValue]);

    useEffect(() => {
        getPersonalInformationData();
    }, [getPersonalInformationData]);

    return (
        <View className="flex-1">
            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                <View className="gap-6 pb-6">
                    {/* Full Name */}
                    <Controller name="name" control={control} render={({ field: { value, onChange, onBlur } }) => (
                        <View className="gap-3">
                            <Text className="text-base font-semibold text-gray-900 dark:text-white">Full Name</Text>
                            <View className="bg-white dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 shadow-sm">
                                <TextInput
                                    className="text-base text-gray-900 dark:text-white"
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#9CA3AF"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                />
                            </View>
                            {errors.name && <Text className="text-red-500 text-sm mt-1">{errors.name.message}</Text>}
                        </View>
                    )} />

                    {/* Email */}
                    <Controller name="email" control={control} render={({ field: { value, onChange, onBlur } }) => (
                        <View className="gap-3">
                            <Text className="text-base font-semibold text-gray-900 dark:text-white">Email</Text>
                            <View className="bg-white dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 shadow-sm">
                                <TextInput
                                    className="text-base text-gray-900 dark:text-white"
                                    placeholder="Enter your email"
                                    placeholderTextColor="#9CA3AF"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                            {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>}
                        </View>
                    )} />

                    {/* Phone */}
                    <Controller name="phone" control={control} render={({ field: { value, onChange, onBlur } }) => (
                        <View className="gap-3">
                            <Text className="text-base font-semibold text-gray-900 dark:text-white">Phone</Text>
                            <View className="bg-white dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 shadow-sm">
                                <TextInput
                                    className="text-base text-gray-900 dark:text-white"
                                    placeholder="Enter your phone number"
                                    placeholderTextColor="#9CA3AF"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    keyboardType="phone-pad"
                                />
                            </View>
                            {errors.phone && <Text className="text-red-500 text-sm mt-1">{errors.phone.message}</Text>}
                        </View>
                    )} />

                    {/* Address */}
                    <Controller name="address" control={control} render={({ field: { value, onChange, onBlur } }) => (
                        <View className="gap-3">
                            <Text className="text-base font-semibold text-gray-900 dark:text-white">Address</Text>
                            <View className="bg-white dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 shadow-sm">
                                <TextInput
                                    className="text-base text-gray-900 dark:text-white"
                                    placeholder="Enter your address"
                                    placeholderTextColor="#9CA3AF"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                />
                            </View>
                            {errors.address && <Text className="text-red-500 text-sm mt-1">{errors.address.message}</Text>}
                        </View>
                    )} />

                    {/* Membership */}
                    <Controller name="membership" control={control} render={({ field: { value, onChange } }) => (
                        <View className="gap-3">
                            <Text className="text-base font-semibold text-gray-900 dark:text-white">Membership</Text>
                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    onPress={() => onChange("Regular")}
                                    className={`flex-1 py-4 rounded-2xl border-2 ${value === "Regular" ? "bg-[#FDB74B] border-[#FDB74B]" : "bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"}`}
                                    activeOpacity={0.7}
                                >
                                    <Text className={`text-center font-semibold ${value === "Regular" ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
                                        Regular
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => onChange("Premium")}
                                    className={`flex-1 py-4 rounded-2xl border-2 ${value === "Premium" ? "bg-[#FDB74B] border-[#FDB74B]" : "bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"}`}
                                    activeOpacity={0.7}
                                >
                                    <Text className={`text-center font-semibold ${value === "Premium" ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
                                        Premium
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )} />
                </View>
            </ScrollView>
            
            {/* Submit Button */}
            <View className="px-5 pb-6 pt-4">
                <TouchableOpacity 
                    onPress={handleSubmit(onSubmit)}
                    className="w-full bg-[#FDB74B] rounded-2xl py-4 shadow-lg active:bg-[#FCA61B]"
                    activeOpacity={0.8}
                >
                    <Text className="text-white text-center text-lg font-bold">Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}