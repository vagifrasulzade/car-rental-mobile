import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { driverLicenseSchema, DriverLicenseSchemaType } from "./driver-license.schema";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

interface DriverLisenceFormProps {
    onSuccess?: () => void;
}

export default function DriverLisenceForm({ onSuccess }: DriverLisenceFormProps = {}) {
    const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<DriverLicenseSchemaType>({
        resolver: zodResolver(driverLicenseSchema),
        defaultValues: {
            driverLicenseNumber: "",
            driverLicenseExpiryDate: "",
            driverLicenseImage: "",
        }
    })

    // Format Date logic

    const formatDate = (text: string) => {
        const clean = text.replace(/\D/g, '')
        let format = clean
        if (clean.length >= 2) {
            format = clean.slice(0, 2)
            if (clean.length >= 2) {
                format = `${format}/${clean.slice(2, 4)}`
                if (clean.length >= 4) {
                    format = `${format}/${clean.slice(4, 8)}`
                }
            }
        }
        return format
    }


    // License Image logic
    const [licenseImage, setLicenseImage] = useState<string | null>(null)

    const chooseFromLibrary = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (permission.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            })
            if (!result.canceled) {
                setLicenseImage(result.assets[0].uri)
                setValue("driverLicenseImage", result.assets[0].uri)
            }
        }
    }

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (permission.granted === false) {
            Alert.alert(
                "Permission denied",
                "Please grant permission to access your media library"
            )
            return
        }

        Alert.alert(
            "Upload License Photo",
            "Choose an option",
            [
                {
                    text: "Take Photo",
                    onPress: async () => {
                        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync()
                        if (cameraPermission.granted) {
                            const result = await ImagePicker.launchCameraAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                aspect: [1, 1],
                                quality: 1,
                            })
                            if (!result.canceled) {
                                setLicenseImage(result.assets[0].uri)
                                setValue("driverLicenseImage", result.assets[0].uri)
                            }
                        }
                    },
                },
                {
                    text: "Choose from Library",
                    onPress: () => chooseFromLibrary(),
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        )
    }



    const onSubmit = async (data: DriverLicenseSchemaType) => {
        try {
            if (!licenseImage) {
                Alert.alert("Upload License Photo", "Please upload a driver license image")
                return
            }

            await AsyncStorage.setItem("driverLicense", JSON.stringify(data))
            Alert.alert("Success", "Driver license information saved successfully", [
                {
                    text: "OK",
                    onPress: () => {
                        if (onSuccess) {
                            onSuccess();
                        }
                    }
                }
            ])
        } catch (error) {
            Alert.alert("Error", "Failed to save driver license information")
            console.log(error)
        }
    }

    const getDriverLicense = async () => {
        const driverLicense = JSON.parse(await AsyncStorage.getItem("driverLicense") || "{}")
        if (driverLicense) {
            setValue("driverLicenseNumber", driverLicense.driverLicenseNumber)
            setValue("driverLicenseExpiryDate", driverLicense.driverLicenseExpiryDate)
            setLicenseImage(driverLicense.driverLicenseImage)
        }
    }

    useEffect(() => {
        getDriverLicense()
    }, [])


    return (
        <View className="flex-1 px-5">
            <View className="flex-1 gap-6">
                <Controller
                    name="driverLicenseNumber"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className="gap-3">
                            <Text className="text-base font-semibold text-gray-900 dark:text-white">License Number</Text>
                            <View className="bg-white dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 shadow-sm">
                                <TextInput
                                    className="text-base text-gray-900 dark:text-white"
                                    placeholder="Enter license number"
                                    placeholderTextColor="#9CA3AF"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                />
                            </View>
                            {errors.driverLicenseNumber && <Text className="text-red-500 text-sm mt-1">{errors.driverLicenseNumber.message}</Text>}
                        </View>
                    )}
                />
                <Controller
                    name="driverLicenseExpiryDate"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className="gap-3">
                            <Text className="text-base font-semibold text-gray-900 dark:text-white">Expiry Date</Text>
                            <View className="bg-white dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 shadow-sm">
                                <TextInput
                                    className="text-base text-gray-900 dark:text-white"
                                    placeholder="DD/MM/YYYY"
                                    placeholderTextColor="#9CA3AF"
                                    value={value}
                                    onChangeText={text => onChange(formatDate(text))}
                                    onBlur={onBlur}
                                    keyboardType="numeric"
                                    maxLength={10}
                                />
                            </View>
                            {errors.driverLicenseExpiryDate && <Text className="text-red-500 text-sm mt-1">{errors.driverLicenseExpiryDate.message}</Text>}
                        </View>
                    )}
                />

                {/* Driver License Image */}
                <View className="gap-3">
                    <Text className="text-base font-semibold text-gray-900 dark:text-white">License Image</Text>
                    <TouchableOpacity 
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl overflow-hidden shadow-sm"
                        onPress={pickImage}
                        activeOpacity={0.7}
                    >
                        {licenseImage || watch("driverLicenseImage")
                            ? <Image
                                source={{ uri: licenseImage || watch("driverLicenseImage") || "" }}
                                className="w-full h-52" 
                                contentFit="cover"
                            />
                            : <View className="w-full h-52 items-center justify-center bg-white dark:bg-gray-800/50">
                                <Ionicons name="cloud-upload-outline" size={48} color="#FDB74B" />
                                <Text className="text-gray-700 dark:text-gray-300 mt-3 text-base font-semibold">Tap to upload</Text>
                                <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">Take photo or choose from gallery</Text>
                            </View>
                        }
                    </TouchableOpacity>
                </View>


            </View>
            <View className="pb-6 pt-6">
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
