import { carModels } from "@/data/car-models";
import useTheme from "@/hooks/use-theme";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, TouchableOpacity, Dimensions, TextInput, Platform, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import * as Device from "expo-device";
import { useAddBookingStore } from "@/store/use-add-booking";

const { width, height } = Dimensions.get('window');

export default function BookingOverviewPage() {
    const { colorScheme } = useTheme();
    const { id, startDate, endDate, pickupTime, returnTime, withDriver } = useLocalSearchParams();
    const router = useRouter();
    const { setBookingDetails } = useAddBookingStore();
    const [selectedPayment, setSelectedPayment] = useState("mastercard");
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [search, setSearch] = useState<string | null>(null);
    const [region, setRegion] = useState<any | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [searchedLocation, setSearchedLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const car = carModels.find((car) => car.id === id);

    useEffect(() => {
        async function getCurrentLocation() {
            if (Platform.OS === "android" && !Device.isDevice) {
                setErrorMsg("Oops, this must be run on a real device.");
                return;
            }
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        }
        getCurrentLocation();
    }, []);

    const handleSearch = async () => {
        if (!search || !search.trim()) return;
        
        Keyboard.dismiss();
        setIsSearching(true);

        try {
            const result = await Location.geocodeAsync(search);

            if (result.length > 0) {
                const { latitude, longitude } = result[0];
                setRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                });
                setSearchedLocation({ latitude, longitude });
            } else {
                alert("Location not found. Please try a different search term.");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to search location. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleClearSearch = () => {
        setSearch(null);
        setSearchedLocation(null);
        if (location) {
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        }
        Keyboard.dismiss();
    };

    // Format dates for display
    const formatDate = (dateString: string | string[]) => {
        if (!dateString || Array.isArray(dateString)) return "Not selected";
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // Calculate number of days
    const calculateDays = () => {
        if (!startDate || !endDate || Array.isArray(startDate) || Array.isArray(endDate)) return 1;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1;
    };

    const numberOfDays = calculateDays();

    if (!car) {
        return (
            <SafeAreaView className={`flex-1 items-center justify-center ${colorScheme === "dark" ? "bg-gray-900" : "bg-white"}`}>
                <Text className={colorScheme === "dark" ? "text-white" : "text-gray-900"}>Car not found</Text>
            </SafeAreaView>
        );
    }

    if (errorMsg) {
        return (
            <SafeAreaView className={`flex-1 items-center justify-center ${colorScheme === "dark" ? "bg-gray-900" : "bg-white"}`}>
                <Text className={colorScheme === "dark" ? "text-white" : "text-gray-900"}>{errorMsg}</Text>
            </SafeAreaView>
        );
    }

    if (!location || !region) {
        return (
            <SafeAreaView className={`flex-1 items-center justify-center ${colorScheme === "dark" ? "bg-gray-900" : "bg-white"}`}>
                <Text className={colorScheme === "dark" ? "text-white" : "text-gray-900"}>Loading map...</Text>
            </SafeAreaView>
        );
    }

    const handlePayment = () => {
        if (!car) return;

        const totalPrice = car.pricePerDay * numberOfDays;
        const totalPriceWithTax = totalPrice * (1 + 0.18); // 18% tax

        setBookingDetails({
            carId: Array.isArray(id) ? id[0] : id,
            startDate: Array.isArray(startDate) ? startDate[0] : startDate,
            endDate: Array.isArray(endDate) ? endDate[0] : endDate,
            pickupTime: Array.isArray(pickupTime) ? pickupTime[0] : (pickupTime as string) || "",
            returnTime: Array.isArray(returnTime) ? returnTime[0] : (returnTime as string) || "",
            withDriver: withDriver === "true",
            numberOfDays,
            pricePerDay: car.pricePerDay,
            totalPrice,
            totalPriceWithTax,
            pickupLocationName: searchedLocation ? (search || "Selected Location") : "Current Location",
            pickupLocationCoords: searchedLocation
                ? searchedLocation
                : location
                    ? { latitude: location.coords.latitude, longitude: location.coords.longitude }
                    : null,
            selectedPaymentMethod: "mastercard",
            selectedCardLast4: "4567 5485",
        });

        router.push("/payment/page" as any);
    };

    return (
        <SafeAreaView className={`flex-1 ${colorScheme === "dark" ? "bg-gray-900" : "bg-white"}`} edges={['top']}>
            <View className="flex-1">
                {/* Map Header */}
                <View style={{ height: 280, position: 'relative' }}>
                    {/* Search Bar */}
                    <View className={`absolute top-4 left-4 right-4 z-10 flex-row items-center px-4 py-3 rounded-2xl shadow-lg ${colorScheme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                        <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
                        <TextInput
                            className={`flex-1 ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}
                            placeholder="Search for a location"
                            placeholderTextColor="#999"
                            value={search || ""}
                            onChangeText={setSearch}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                            editable={!isSearching}
                        />
                        {search && (
                            <TouchableOpacity onPress={handleClearSearch} style={{ marginRight: 8 }}>
                                <Ionicons name="close-circle" size={20} color="#999" />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity 
                            onPress={handleSearch}
                            disabled={isSearching || !search}
                            className={`ml-2 ${isSearching || !search ? "opacity-50" : ""}`}
                        >
                            {isSearching ? (
                                <Ionicons name="hourglass" size={24} color={colorScheme === "dark" ? "#fff" : "#000"} />
                            ) : (
                                <Ionicons name="arrow-forward-circle" size={28} color="#FF6B35" />
                            )}
                        </TouchableOpacity>
                    </View>

                    <MapView
                        style={{ flex: 1 }}
                        provider={PROVIDER_GOOGLE}
                        region={region}
                        showsUserLocation
                        showsMyLocationButton
                        showsCompass
                        showsScale
                        showsTraffic
                        showsBuildings
                        showsPointsOfInterest
                        onPanDrag={() => Keyboard.dismiss()}
                    >
                        {/* Car Location Marker */}
                        {searchedLocation ? (
                            <Marker
                                coordinate={searchedLocation}
                                title={`${car.brand} ${car.model}`}
                                description="Pick-up location"
                            >
                                <View className="items-center">
                                    <View className="bg-white rounded-full p-2 shadow-lg">
                                        <Ionicons name="car" size={28} color="#FF6B35" />
                                    </View>
                                </View>
                            </Marker>
                        ) : (
                            <Marker
                                coordinate={{
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                }}
                                title={`${car.brand} ${car.model}`}
                                description="Pick-up location"
                            >
                                <View className="items-center">
                                    <View className="bg-white rounded-full p-2 shadow-lg">
                                        <Ionicons name="car" size={28} color="#FF6B35" />
                                    </View>
                                </View>
                            </Marker>
                        )}
                    </MapView>

                    {/* Back Button */}
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-white items-center justify-center shadow-lg"
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Car Info Card - Overlapping Map */}
                    <View className="px-4 -mt-16">
                        <View className="bg-orange-500 rounded-3xl p-4 shadow-lg">
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-1">
                                    <Text className="text-white text-xl font-bold">
                                        {car.brand} {car.model}
                                    </Text>
                                    <Text className="text-white/80 text-sm mt-1">
                                        {car.type}
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Ionicons name="star" size={20} color="#FFD700" />
                                    <Text className="text-white text-lg font-bold ml-1">4.8</Text>
                                </View>
                            </View>

                            {/* Car Image */}
                            <View className="items-center my-2">
                                <Image 
                                    source={{ uri: car.image }} 
                                    style={{ width: 200, height: 120 }}
                                    contentFit="contain"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Overview Section */}
                    <View className="px-4 mt-6">
                        <Text className={`text-xl font-bold mb-4 ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                            Overview
                        </Text>

                        <View className="flex-row gap-3">
                            <View className={`flex-1 p-4 rounded-2xl border ${colorScheme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
                                <Text className={`text-sm mb-1 ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                    Start
                                </Text>
                                <Text className={`text-base font-bold ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                                    {formatDate(startDate)}
                                </Text>
                            </View>

                            <View className={`flex-1 p-4 rounded-2xl border ${colorScheme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
                                <Text className={`text-sm mb-1 ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                    End
                                </Text>
                                <Text className={`text-base font-bold ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                                    {formatDate(endDate)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Pick-up Location */}
                    <View className="px-4 mt-6">
                        <Text className={`text-xl font-bold mb-4 ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                            Pick-up location
                        </Text>

                        <View className={`flex-row items-center justify-between p-4 rounded-2xl border ${colorScheme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
                            <View className="flex-row items-center flex-1">
                                <View className="w-10 h-10 rounded-full bg-yellow-100 items-center justify-center">
                                    <Ionicons name="location" size={24} color="#FFA500" />
                                </View>
                                <View className="ml-3 flex-1">
                                    <Text className={`text-base font-semibold ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                                        {searchedLocation ? (search || "Selected Location") : "Current Location"}
                                    </Text>
                                    <Text className={`text-xs mt-1 ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                        {searchedLocation 
                                            ? `${searchedLocation.latitude.toFixed(4)}, ${searchedLocation.longitude.toFixed(4)}`
                                            : `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`
                                        }
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Payment Section */}
                    {/* <View className="px-4 mt-6 pb-32">
                        <Text className={`text-xl font-bold mb-4 ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                            Payment
                        </Text>

                        <TouchableOpacity className={`flex-row items-center justify-between p-4 rounded-2xl border ${colorScheme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
                            <View className="flex-row items-center flex-1">
                                <View className="w-12 h-12 rounded-xl bg-white items-center justify-center overflow-hidden">
                                    <Image 
                                        source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" }}
                                        style={{ width: 40, height: 40 }}
                                        contentFit="contain"
                                    />
                                </View>
                                <View className="ml-3 flex-1">
                                    <Text className={`text-base font-semibold ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                                        MasterCard
                                    </Text>
                                    <Text className={`text-sm ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                        **** **** 4567 5485
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colorScheme === "dark" ? "#fff" : "#000"} />
                            </View>
                        </TouchableOpacity>
                    </View> */}
                </ScrollView>

                <View className={`absolute bottom-0 left-0 right-0 p-4 ${colorScheme === "dark" ? "bg-gray-900" : "bg-white"} border-t ${colorScheme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
                    <TouchableOpacity 
                        onPress={handlePayment}
                        className="bg-orange-500 rounded-2xl py-4 flex-row items-center justify-center"
                    >
                        <Text className="text-white text-xl font-bold mr-2">Pay</Text>
                        <Text className="text-white text-xl font-bold">| ${car.pricePerDay * numberOfDays}</Text>
                        <Text className="text-white/80 text-base ml-1">({numberOfDays} {numberOfDays === 1 ? 'day' : 'days'})</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
