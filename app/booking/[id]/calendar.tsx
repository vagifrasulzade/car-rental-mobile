import { carModels } from "@/data/car-models";
import useTheme from "@/hooks/use-theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, TouchableOpacity, Switch, Modal, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Calendar } from "react-native-calendars";

// Generate time slots
const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push(timeString);
        }
    }
    return slots;
};

const timeSlots = generateTimeSlots();

export default function DateTimePage() {
    const { colorScheme } = useTheme();
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [bookingWithDriver, setBookingWithDriver] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
    const [pickupTime, setPickupTime] = useState("10:00");
    const [returnTime, setReturnTime] = useState("17:00");
    const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
    const [showReturnTimePicker, setShowReturnTimePicker] = useState(false);

    const car = carModels.find((car) => car.id === id);

    const today = new Date().toISOString().split("T")[0];

    const handleDayPress = (day: any) => {
        const selectedDate = day.dateString;

        // Prevent selecting past dates
        if (selectedDate < today) return;

        // 1️⃣ First selection
        if (!selectedStartDate) {
            setSelectedStartDate(selectedDate);
            setSelectedEndDate(null);
            return;
        }

        // 2️⃣ Selecting end date
        if (selectedStartDate && !selectedEndDate) {
            if (selectedDate >= selectedStartDate) {
                setSelectedEndDate(selectedDate);
            } else {
                setSelectedStartDate(selectedDate);
            }
            return;
        }

        // 3️⃣ Reset and start new selection
        setSelectedStartDate(selectedDate);
        setSelectedEndDate(null);
    };

    const getMarkedDates = () => {
        if (!selectedStartDate) return {};

        const marked: any = {};

        // Only start date selected
        if (selectedStartDate && !selectedEndDate) {
            marked[selectedStartDate] = {
                startingDay: true,
                endingDay: true,
                color: '#FF6B35',
                textColor: 'white',
            };
            return marked;
        }

        // Range selected
        if (selectedStartDate && selectedEndDate) {
            let current = new Date(selectedStartDate);
            const last = new Date(selectedEndDate);

            while (current <= last) {
                const dateString = current.toISOString().split('T')[0];

                marked[dateString] = {
                    color: '#FF6B35',
                    textColor: 'white',
                };

                if (dateString === selectedStartDate) {
                    marked[dateString].startingDay = true;
                }

                if (dateString === selectedEndDate) {
                    marked[dateString].endingDay = true;
                }

                current.setDate(current.getDate() + 1);
            }
        }

        return marked;
    };

    const handleBooking = () => {
        // Validate date selection
        if (!selectedStartDate) return;

        // Handle booking logic here
        console.log({
            carId: id,
            bookingWithDriver,
            startDate: selectedStartDate,
            endDate: selectedEndDate || selectedStartDate,
            pickupTime,
            returnTime
        });
        // Navigate to overview screen with map and pass booking data
        router.push({
            pathname: "/booking/[id]/overview",
            params: {
                id: id as string,
                startDate: selectedStartDate,
                endDate: selectedEndDate || selectedStartDate,
                pickupTime,
                returnTime,
                withDriver: bookingWithDriver.toString()
            }
        });
    };

    return (
        <SafeAreaView className={`flex-1 ${colorScheme === "dark" ? "bg-gray-900" : "bg-white"}`} edges={['top']}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="flex-row items-center justify-center px-4 py-4 relative">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="absolute left-4 w-10 h-10 rounded-full items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={24} color={colorScheme === "dark" ? "#fff" : "#000"} />
                    </TouchableOpacity>
                    <Text className={`text-xl font-bold ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                        Date & Time
                    </Text>
                </View>

                <View className="px-4">
                    {/* Booking with Driver Toggle */}
                    <View className={`p-4 rounded-2xl mt-4 ${colorScheme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className={`text-lg font-semibold ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                                    Booking with driver
                                </Text>
                                <Text className={`text-sm mt-1 ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                    Don't have a driver? book with the driver.
                                </Text>
                            </View>
                            <Switch
                                value={bookingWithDriver}
                                onValueChange={setBookingWithDriver}
                                trackColor={{ false: "#767577", true: "#FFB8A3" }}
                                thumbColor={bookingWithDriver ? "#FF6B35" : "#f4f3f4"}
                            />
                        </View>
                    </View>

                    {/* Calendar */}
                    <View className={`mt-6 rounded-2xl overflow-hidden ${colorScheme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                        <Calendar
                            onDayPress={handleDayPress}
                            markedDates={getMarkedDates()}
                            markingType={'period'}
                            minDate={today}
                            theme={{
                                backgroundColor: colorScheme === "dark" ? "#1F2937" : "#ffffff",
                                calendarBackground: colorScheme === "dark" ? "#1F2937" : "#ffffff",
                                textSectionTitleColor: colorScheme === "dark" ? "#9CA3AF" : "#6B7280",
                                selectedDayBackgroundColor: '#FF6B35',
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: '#FF6B35',
                                dayTextColor: colorScheme === "dark" ? "#ffffff" : "#1F2937",
                                textDisabledColor: colorScheme === "dark" ? "#4B5563" : "#D1D5DB",
                                monthTextColor: colorScheme === "dark" ? "#ffffff" : "#1F2937",
                                textMonthFontWeight: 'bold',
                                textDayFontSize: 16,
                                textMonthFontSize: 18,
                            }}
                        />
                    </View>

                    {/* Time Selectors */}
                    <View className="flex-row gap-4 mt-6">
                        <View className="flex-1">
                            <Text className={`text-sm font-semibold mb-2 ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                                Pick-up time
                            </Text>
                            <TouchableOpacity 
                                onPress={() => setShowPickupTimePicker(true)}
                                className={`p-4 rounded-2xl border ${colorScheme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}
                            >
                                <View className="flex-row items-center justify-between">
                                    <Text className={`text-lg font-semibold ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                                        {pickupTime}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color={colorScheme === "dark" ? "#fff" : "#000"} />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-1">
                            <Text className={`text-sm font-semibold mb-2 ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                                Return time
                            </Text>
                            <TouchableOpacity 
                                onPress={() => setShowReturnTimePicker(true)}
                                className={`p-4 rounded-2xl border ${colorScheme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}
                            >
                                <View className="flex-row items-center justify-between">
                                    <Text className={`text-lg font-semibold ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                                        {returnTime}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color={colorScheme === "dark" ? "#fff" : "#000"} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Pick-up Time Picker Modal */}
            <Modal
                visible={showPickupTimePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPickupTimePicker(false)}
            >
                <TouchableOpacity 
                    activeOpacity={1}
                    onPress={() => setShowPickupTimePicker(false)}
                    className="flex-1 justify-end"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                        <View className={`rounded-t-3xl ${colorScheme === "dark" ? "bg-gray-900" : "bg-white"}`}>
                            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                                <TouchableOpacity onPress={() => setShowPickupTimePicker(false)}>
                                    <Text className="text-orange-500 text-lg">Cancel</Text>
                                </TouchableOpacity>
                                <Text className={`text-lg font-bold ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                                    Pick-up Time
                                </Text>
                                <TouchableOpacity onPress={() => setShowPickupTimePicker(false)}>
                                    <Text className="text-orange-500 text-lg font-semibold">Done</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={timeSlots}
                                keyExtractor={(item) => item}
                                style={{ maxHeight: 300 }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setPickupTime(item);
                                            setShowPickupTimePicker(false);
                                        }}
                                        className={`p-4 border-b ${colorScheme === "dark" ? "border-gray-800" : "border-gray-100"} ${
                                            item === pickupTime ? "bg-orange-50" : ""
                                        }`}
                                    >
                                        <Text className={`text-center text-lg ${
                                            item === pickupTime 
                                                ? "text-orange-500 font-bold" 
                                                : colorScheme === "dark" ? "text-white" : "text-gray-900"
                                        }`}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Return Time Picker Modal */}
            <Modal
                visible={showReturnTimePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowReturnTimePicker(false)}
            >
                <TouchableOpacity 
                    activeOpacity={1}
                    onPress={() => setShowReturnTimePicker(false)}
                    className="flex-1 justify-end"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                        <View className={`rounded-t-3xl ${colorScheme === "dark" ? "bg-gray-900" : "bg-white"}`}>
                            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                                <TouchableOpacity onPress={() => setShowReturnTimePicker(false)}>
                                    <Text className="text-orange-500 text-lg">Cancel</Text>
                                </TouchableOpacity>
                                <Text className={`text-lg font-bold ${colorScheme === "dark" ? "text-white" : "text-gray-900"}`}>
                                    Return Time
                                </Text>
                                <TouchableOpacity onPress={() => setShowReturnTimePicker(false)}>
                                    <Text className="text-orange-500 text-lg font-semibold">Done</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={timeSlots}
                                keyExtractor={(item) => item}
                                style={{ maxHeight: 300 }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setReturnTime(item);
                                            setShowReturnTimePicker(false);
                                        }}
                                        className={`p-4 border-b ${colorScheme === "dark" ? "border-gray-800" : "border-gray-100"} ${
                                            item === returnTime ? "bg-orange-50" : ""
                                        }`}
                                    >
                                        <Text className={`text-center text-lg ${
                                            item === returnTime 
                                                ? "text-orange-500 font-bold" 
                                                : colorScheme === "dark" ? "text-white" : "text-gray-900"
                                        }`}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <View className={`absolute bottom-0 left-0 right-0 p-4 ${colorScheme === "dark" ? "bg-gray-900" : "bg-white"} border-t ${colorScheme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
                <TouchableOpacity 
                    onPress={handleBooking}
                    disabled={!selectedStartDate}
                    className={`rounded-2xl py-4 flex-row items-center justify-center ${
                        !selectedStartDate ? "bg-gray-400" : "bg-orange-500"
                    }`}
                >
                    <Text className="text-white text-lg font-bold">Booking</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
