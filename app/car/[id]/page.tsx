import { carModels } from "@/data/car-models";
import useTheme from "@/hooks/use-theme";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, TouchableOpacity, Linking, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useRef } from "react";

const { width } = Dimensions.get('window');

export default function CarModelPage() {
    const { colorScheme } = useTheme();
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const car = carModels.find((car) => car.id === id);

    if (!car) {
        return (
            <SafeAreaView className={`flex-1 items-center justify-center ${colorScheme === "dark" ? "bg-gray-900" : "bg-white"}`}>
                <Text className={colorScheme === "dark" ? "text-white" : "text-gray-900"}>Car not found</Text>
            </SafeAreaView>
        );
    }

    // Use car images array if available, otherwise fallback to single image
    const carImages = car.images || [car.image];

    const handleCall = () => {
        Linking.openURL('tel:+1234567890');
    };

    const handleMessage = () => {
        // Navigate to messages page
        router.push('/');
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setActiveImageIndex(index);
    };

    return (
        <SafeAreaView className={`flex-1 ${colorScheme === "dark" ? "bg-gray-900" : "bg-white"}`} edges={['top']}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Car Image Carousel */}
                <View className="relative">
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {carImages.map((imageUri, index) => (
                            <Image 
                                key={index}
                                source={{ uri: imageUri }} 
                                style={{ width, height: 280 }}
                                contentFit="cover"
                            />
                        ))}
                    </ScrollView>
                    
                    {/* Pagination Dots */}
                    <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
                        {carImages.map((_, index) => (
                            <View 
                                key={index}
                                className={`h-2 rounded-full ${
                                    index === activeImageIndex 
                                        ? 'w-8 bg-orange-500' 
                                        : 'w-2 bg-white/50'
                                }`}
                            />
                        ))}
                    </View>

                    {/* Back Button */}
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View className="px-4 pb-24">
                    {/* Title & Favorite */}
                    <View className="flex-row items-center justify-between mt-4">
                        <View className="flex-1">
                            <Text className={`text-2xl font-bold ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                                {car.brand} - {car.model}
                            </Text>
                            <Text className={`text-sm mt-1 ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                {car.type}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
                            <Ionicons 
                                name={isFavorite ? "heart" : "heart-outline"} 
                                size={28} 
                                color={isFavorite ? "#FF6B6B" : colorScheme === "dark" ? "#fff" : "#000"} 
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Rating */}
                    <View className="flex-row items-center mt-2">
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text className={`ml-1 font-semibold ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                            4.8
                        </Text>
                        <Text className={`ml-1 ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                            (140+ Review)
                        </Text>
                    </View>

                    {/* Renter Info */}
                    <View className={`flex-row items-center justify-between mt-6 p-4 rounded-2xl ${colorScheme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
                        <View className="flex-row items-center flex-1">
                            <Image 
                                source={{ uri: "https://i.pravatar.cc/150?img=12" }}
                                className="w-12 h-12 rounded-full"
                            />
                            <View className="ml-3">
                                <Text className={`font-semibold ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                                    John Downson
                                </Text>
                                <Text className={`text-sm ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                    Renter
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row gap-3">
                            <TouchableOpacity 
                                onPress={handleMessage}
                                className="w-12 h-12 rounded-xl bg-orange-500 items-center justify-center"
                            >
                                <Ionicons name="chatbubble" size={20} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={handleCall}
                                className="w-12 h-12 rounded-xl border-2 border-orange-500 items-center justify-center"
                            >
                                <Ionicons name="call" size={20} color="#FF6B35" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Car Info */}
                    <View className="mt-6">
                        <Text className={`text-lg font-bold mb-4 ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                            Car Info
                        </Text>
                        <View className="flex-row flex-wrap gap-4">
                            <View className="flex-row items-center w-[45%]">
                                <Ionicons name="people" size={24} color="#FF6B35" />
                                <Text className={`ml-2 ${colorScheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                    {car.seats} Passengers
                                </Text>
                            </View>
                            <View className="flex-row items-center w-[45%]">
                                <MaterialCommunityIcons name="car-door" size={24} color="#FF6B35" />
                                <Text className={`ml-2 ${colorScheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                    4 Doors
                                </Text>
                            </View>
                            <View className="flex-row items-center w-[45%]">
                                <MaterialCommunityIcons name="air-conditioner" size={24} color="#FF6B35" />
                                <Text className={`ml-2 ${colorScheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                    Air conditioning
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Performance Stats */}
                    <View className="mt-6">
                        <Text className={`text-lg font-bold mb-4 ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                            Performance
                        </Text>
                        <View className="flex-row">
                            <View className={`flex-1 mr-2 p-4 rounded-2xl border ${colorScheme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                                <Text className={`text-sm ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                    Max Power
                                </Text>
                                <Text className={`text-2xl font-bold mt-1 ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                                    {car.hp}
                                </Text>
                                <Text className={`text-xs ${colorScheme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                                    hp
                                </Text>
                            </View>
                            <View className={`flex-1 mx-1 p-4 rounded-2xl border ${colorScheme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                                <Text className={`text-sm ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                    0-60 mph
                                </Text>
                                <Text className={`text-2xl font-bold mt-1 ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                                    {car.zeroToSixty}
                                </Text>
                                <Text className={`text-xs ${colorScheme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                                    sec
                                </Text>
                            </View>
                            <View className={`flex-1 ml-2 p-4 rounded-2xl border ${colorScheme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                                <Text className={`text-sm ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                    Top Speed
                                </Text>
                                <Text className={`text-2xl font-bold mt-1 ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                                    {car.topSpeed}
                                </Text>
                                <Text className={`text-xs ${colorScheme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                                    mph
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Booking Button - Fixed at bottom */}
            <View className={`absolute bottom-0 left-0 right-0 p-4 ${colorScheme === "dark" ? "bg-gray-900" : "bg-white"} border-t ${colorScheme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
                <TouchableOpacity 
                    onPress={() => router.push(`/booking/${id}/calendar`)}
                    className="bg-orange-500 rounded-2xl py-4 flex-row items-center justify-center"
                >
                    <Text className="text-white text-lg font-bold mr-2">Booking Now</Text>
                    <Text className="text-white text-lg font-bold">${car.pricePerDay}</Text>
                    <Text className="text-white/80 text-sm ml-1">/day</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
