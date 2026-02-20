import useTheme from "@/hooks/use-theme";
import { usePaymentStore } from "@/store/use-payment";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentSuccessPage() {
    const { colorScheme } = useTheme();
    const router = useRouter();
    const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
    const { completedBookings } = usePaymentStore();

    const booking = completedBookings.find((b) => b.bookingId === bookingId);

    const bg = colorScheme === "dark" ? "bg-gray-900" : "bg-white";
    const cardBg = colorScheme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200";
    const textPrimary = colorScheme === "dark" ? "text-white" : "text-gray-900";
    const textSecondary = colorScheme === "dark" ? "text-gray-400" : "text-gray-500";

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
        <SafeAreaView className={`flex-1 ${bg}`}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                {/* Success Banner */}
                <View className="items-center px-6 pt-10 pb-6">
                    <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center mb-4">
                        <Ionicons name="checkmark-circle" size={60} color="#22C55E" />
                    </View>
                    <Text className={`text-2xl font-bold ${textPrimary}`}>Payment Successful!</Text>
                    <Text className={`text-sm text-center mt-2 ${textSecondary}`}>
                        Your booking has been confirmed. Enjoy your ride!
                    </Text>
                    {booking && (
                        <View className="mt-3 bg-orange-100 px-4 py-2 rounded-full">
                            <Text className="text-orange-600 font-semibold text-sm">{booking.bookingId}</Text>
                        </View>
                    )}
                </View>

                {booking && (
                    <View className="px-4">
                        {/* Summary Card */}
                        <View className={`rounded-2xl border p-4 mb-4 ${cardBg}`}>
                            <Text className={`text-base font-bold mb-3 ${textPrimary}`}>Booking Summary</Text>

                            <Row label="Car" value={`${booking.carId}`} textSecondary={textSecondary} textPrimary={textPrimary} />
                            <Row label="Pick-up" value={formatDate(booking.startDate)} textSecondary={textSecondary} textPrimary={textPrimary} />
                            <Row label="Return" value={formatDate(booking.endDate)} textSecondary={textSecondary} textPrimary={textPrimary} />
                            <Row label="Duration" value={`${booking.numberOfDays} ${booking.numberOfDays === 1 ? "day" : "days"}`} textSecondary={textSecondary} textPrimary={textPrimary} />
                            <Row label="Location" value={booking.pickupLocationName || "—"} textSecondary={textSecondary} textPrimary={textPrimary} />
                            {booking.withDriver && <Row label="Driver" value="Included" textSecondary={textSecondary} textPrimary={textPrimary} />}
                        </View>

                        {/* Price Card */}
                        <View className={`rounded-2xl border p-4 mb-4 ${cardBg}`}>
                            <Text className={`text-base font-bold mb-3 ${textPrimary}`}>Payment Details</Text>
                            <Row label="Rate" value={`$${booking.pricePerDay}/day`} textSecondary={textSecondary} textPrimary={textPrimary} />
                            <Row label="Subtotal" value={`$${booking.totalPrice.toFixed(2)}`} textSecondary={textSecondary} textPrimary={textPrimary} />
                            <Row label="Tax (18%)" value={`$${(booking.totalPriceWithTax - booking.totalPrice).toFixed(2)}`} textSecondary={textSecondary} textPrimary={textPrimary} />
                            <View className={`h-px my-2 ${colorScheme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
                            <View className="flex-row justify-between">
                                <Text className={`font-bold ${textPrimary}`}>Total Paid</Text>
                                <Text className="font-bold text-orange-500 text-base">${booking.totalPriceWithTax.toFixed(2)}</Text>
                            </View>
                        </View>

                        <View className={`rounded-2xl border p-4 mb-4 ${cardBg}`}>
                            <Row label="Payment Method" value={`MasterCard **** ${booking.selectedCardLast4}`} textSecondary={textSecondary} textPrimary={textPrimary} />
                            <Row
                                label="Paid At"
                                value={new Date(booking.paidAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                                textSecondary={textSecondary}
                                textPrimary={textPrimary}
                            />
                        </View>
                    </View>
                )}

                {/* CTA Buttons */}
                <View className="px-4 mt-2 gap-3">
                    <TouchableOpacity
                        className="bg-orange-500 rounded-2xl py-4 items-center"
                        onPress={() => router.replace("/(tabs)")}
                    >
                        <Text className="text-white text-base font-bold">Back to Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`rounded-2xl py-4 items-center border ${colorScheme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                        onPress={() => router.replace("/(tabs)/car-list")}
                    >
                        <Text className={`text-base font-semibold ${textPrimary}`}>Browse More Cars</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function Row({ label, value, textSecondary, textPrimary }: { label: string; value: string; textSecondary: string; textPrimary: string }) {
    return (
        <View className="flex-row justify-between mb-2">
            <Text className={`text-sm ${textSecondary}`}>{label}</Text>
            <Text className={`text-sm font-semibold ${textPrimary} flex-shrink ml-4 text-right`}>{value}</Text>
        </View>
    );
}
