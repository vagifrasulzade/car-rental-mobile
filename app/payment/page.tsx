import { carModels } from "@/data/car-models";
import useTheme from "@/hooks/use-theme";
import { useAddBookingStore } from "@/store/use-add-booking";
import { useAddCardStore } from "@/store/use-add-card";
import { usePaymentStore } from "@/store/use-payment";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentPage() {
    const { colorScheme } = useTheme();
    const isDark = colorScheme === "dark";
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const {
        carId,
        startDate,
        endDate,
        pickupTime,
        returnTime,
        withDriver,
        numberOfDays,
        pricePerDay,
        totalPrice,
        totalPriceWithTax,
        pickupLocationName,
        selectedPaymentMethod,
        selectedCardLast4,
        resetBooking,
    } = useAddBookingStore();

    const { confirmPayment, completedBookings } = usePaymentStore();
    const { cards, selectedCardId, selectCard, removeCard } = useAddCardStore();
    const selectedCard = cards.find((c) => c.id === selectedCardId) ?? cards[0] ?? null;

    const CARD_LOGOS: Record<string, string> = {
        visa: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1280px-Visa_Inc._logo.svg.png",
        mastercard: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png",
        amex: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1280px-American_Express_logo_%282018%29.svg.png",
    };

    const car = carModels.find((c) => c.id === carId) || null;

    const bg = colorScheme === "dark" ? "bg-gray-900" : "bg-white";
    const cardBg = colorScheme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200";
    const textPrimary = colorScheme === "dark" ? "text-white" : "text-gray-900";
    const textSecondary = colorScheme === "dark" ? "text-gray-400" : "text-gray-500";

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    };

    const handleConfirmPayment = async () => {
        if (!car) return;
        setIsProcessing(true);

        // Simulate network delay
        await new Promise((r) => setTimeout(r, 1500));

        const booking = confirmPayment({
            carId,
            startDate,
            endDate,
            pickupTime,
            returnTime,
            withDriver,
            numberOfDays,
            pricePerDay,
            totalPrice,
            totalPriceWithTax,
            pickupLocationName,
            pickupLocationCoords: null,
            selectedPaymentMethod: selectedCard?.cardType ?? selectedPaymentMethod,
            selectedCardLast4: selectedCard?.last4 ?? selectedCardLast4,
        });

        setIsProcessing(false);
        resetBooking();
        router.push({
            pathname: "/(tabs)",
            params: { bookingId: booking.bookingId },
        });
    };

    if (!car) {
        return (
            <SafeAreaView className={`flex-1 items-center justify-center ${bg}`}>
                <Ionicons name="alert-circle-outline" size={60} color="#FF6B35" />
                <Text className={`text-lg font-semibold mt-4 ${textPrimary}`}>No booking data found</Text>
                <TouchableOpacity
                    className="mt-6 bg-orange-500 px-8 py-3 rounded-2xl"
                    onPress={() => router.back()}
                >
                    <Text className="text-white font-bold text-base">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const tax = totalPriceWithTax - totalPrice;

    return (
        <SafeAreaView className={`flex-1 ${bg}`} edges={["top"]}>
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 border-b border-gray-200/30">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="arrow-back" size={24} color={colorScheme === "dark" ? "#fff" : "#000"} />
                </TouchableOpacity>
                <Text className={`text-xl font-bold flex-1 ${textPrimary}`}>Payment Summary</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Car Card */}
                <View className="mx-4 mt-5 bg-orange-500 rounded-3xl p-4">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-1">
                            <Text className="text-white text-xl font-bold">{car.brand} {car.model}</Text>
                            <Text className="text-white/70 text-sm">{car.type} · {car.year}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text className="text-white font-bold ml-1">4.8</Text>
                        </View>
                    </View>
                    <Image
                        source={{ uri: car.image }}
                        style={{ width: "100%", height: 130 }}
                        contentFit="contain"
                    />
                    <View className="flex-row flex-wrap gap-2 mt-2">
                        {(car.features || []).slice(0, 3).map((f: string) => (
                            <View key={f} className="bg-white/20 px-3 py-1 rounded-full">
                                <Text className="text-white text-xs">{f}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Booking Details */}
                <View className="mx-4 mt-5">
                    <Text className={`text-lg font-bold mb-3 ${textPrimary}`}>Booking Details</Text>
                    <View className={`rounded-2xl border p-4 ${cardBg}`}>

                        <View className="flex-row justify-between mb-3">
                            <View className="flex-1">
                                <Text className={`text-xs ${textSecondary}`}>Pick-up Date</Text>
                                <Text className={`text-sm font-semibold mt-0.5 ${textPrimary}`}>{formatDate(startDate)}</Text>
                                {pickupTime ? <Text className={`text-xs mt-0.5 ${textSecondary}`}>{pickupTime}</Text> : null}
                            </View>
                            <View className="items-center justify-center px-3">
                                <View className="w-8 h-0.5 bg-orange-400" />
                                <Text className="text-orange-500 text-xs font-bold mt-1">{numberOfDays}d</Text>
                            </View>
                            <View className="flex-1 items-end">
                                <Text className={`text-xs ${textSecondary}`}>Return Date</Text>
                                <Text className={`text-sm font-semibold mt-0.5 ${textPrimary}`}>{formatDate(endDate)}</Text>
                                {returnTime ? <Text className={`text-xs mt-0.5 ${textSecondary}`}>{returnTime}</Text> : null}
                            </View>
                        </View>

                        <View className={`h-px my-1 ${colorScheme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />

                        <View className="flex-row items-center mt-3">
                            <View className="w-8 h-8 rounded-full bg-yellow-100 items-center justify-center">
                                <Ionicons name="location" size={18} color="#FFA500" />
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className={`text-xs ${textSecondary}`}>Pick-up Location</Text>
                                <Text className={`text-sm font-semibold mt-0.5 ${textPrimary}`}>{pickupLocationName || "Not specified"}</Text>
                            </View>
                        </View>

                        {withDriver && (
                            <View className="flex-row items-center mt-3">
                                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
                                    <Ionicons name="person" size={18} color="#3B82F6" />
                                </View>
                                <Text className={`ml-3 text-sm font-semibold ${textPrimary}`}>Includes Driver</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Car Specs */}
                <View className="mx-4 mt-5">
                    <Text className={`text-lg font-bold mb-3 ${textPrimary}`}>Car Specs</Text>
                    <View className={`flex-row flex-wrap rounded-2xl border p-4 ${cardBg}`}>
                        {[
                            { icon: "speedometer-outline", label: "HP", value: `${car.hp}` },
                            { icon: "flash-outline", label: "0–60", value: `${car.zeroToSixty}s` },
                            { icon: "car-outline", label: "Trans.", value: car.transmission },
                            { icon: "people-outline", label: "Seats", value: `${car.seats}` },
                        ].map((spec) => (
                            <View key={spec.label} className="w-1/2 flex-row items-center mb-3">
                                <Ionicons name={spec.icon as any} size={20} color="#FF6B35" />
                                <View className="ml-2">
                                    <Text className={`text-xs ${textSecondary}`}>{spec.label}</Text>
                                    <Text className={`text-sm font-semibold ${textPrimary}`}>{spec.value}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Payment Method */}
                <View className="mx-4 mt-5">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className={`text-lg font-bold ${textPrimary}`}>Payment Method</Text>
                        <TouchableOpacity
                            onPress={() => router.push("/payment/add-card" as any)}
                            className="flex-row items-center"
                        >
                            <Ionicons name="add-circle-outline" size={18} color="#FF6B35" />
                            <Text className="text-orange-500 font-semibold text-sm ml-1">Add Card</Text>
                        </TouchableOpacity>
                    </View>

                    {cards.length === 0 ? (
                        <TouchableOpacity
                            onPress={() => router.push("/payment/add-card" as any)}
                            className={`flex-row items-center justify-center p-5 rounded-2xl border-2 border-dashed ${isDark ? "border-gray-600" : "border-gray-300"}`}
                        >
                            <Ionicons name="add" size={22} color="#FF6B35" />
                            <Text className="text-orange-500 font-semibold ml-2">Add a payment method</Text>
                        </TouchableOpacity>
                    ) : (
                        <View className="gap-3">
                            {cards.map((card) => {
                                const isSelected = (selectedCardId ?? cards[0]?.id) === card.id;
                                return (
                                    <TouchableOpacity
                                        key={card.id}
                                        onPress={() => selectCard(card.id)}
                                        className={`flex-row items-center p-4 rounded-2xl border ${
                                            isSelected
                                                ? "border-orange-500 bg-orange-500/10"
                                                : isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
                                        }`}
                                    >
                                        <View className="w-12 h-10 rounded-xl bg-white items-center justify-center overflow-hidden">
                                            {CARD_LOGOS[card.cardType] ? (
                                                <Image
                                                    source={{ uri: CARD_LOGOS[card.cardType] }}
                                                    style={{ width: 40, height: 28 }}
                                                    contentFit="contain"
                                                />
                                            ) : (
                                                <Ionicons name="card" size={24} color="#6B7280" />
                                            )}
                                        </View>
                                        <View className="ml-3 flex-1">
                                            <Text className={`text-sm font-semibold ${textPrimary}`}>
                                                {card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)}
                                            </Text>
                                            <Text className={`text-xs mt-0.5 ${textSecondary}`}>
                                                {card.cardNumber} · {card.cardHolderName}
                                            </Text>
                                            <Text className={`text-xs mt-0.5 ${textSecondary}`}>Exp {card.cardExpirationDate}</Text>
                                        </View>
                                        <View className="flex-row items-center gap-3">
                                            {isSelected && (
                                                <Ionicons name="checkmark-circle" size={22} color="#FF6B35" />
                                            )}
                                            <TouchableOpacity onPress={() => removeCard(card.id)}>
                                                <Ionicons name="trash-outline" size={18} color={isDark ? "#9CA3AF" : "#D1D5DB"} />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>

                {/* Price Breakdown */}
                <View className="mx-4 mt-5">
                    <Text className={`text-lg font-bold mb-3 ${textPrimary}`}>Price Breakdown</Text>
                    <View className={`rounded-2xl border p-4 ${cardBg}`}>
                        <View className="flex-row justify-between mb-3">
                            <Text className={`text-sm ${textSecondary}`}>${pricePerDay}/day × {numberOfDays} {numberOfDays === 1 ? "day" : "days"}</Text>
                            <Text className={`text-sm font-semibold ${textPrimary}`}>${totalPrice.toFixed(2)}</Text>
                        </View>
                        {withDriver && (
                            <View className="flex-row justify-between mb-3">
                                <Text className={`text-sm ${textSecondary}`}>Driver fee</Text>
                                <Text className={`text-sm font-semibold ${textPrimary}`}>Included</Text>
                            </View>
                        )}
                        <View className="flex-row justify-between mb-3">
                            <Text className={`text-sm ${textSecondary}`}>Tax (18%)</Text>
                            <Text className={`text-sm font-semibold ${textPrimary}`}>${tax.toFixed(2)}</Text>
                        </View>
                        <View className={`h-px my-2 ${colorScheme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
                        <View className="flex-row justify-between">
                            <Text className={`text-base font-bold ${textPrimary}`}>Total</Text>
                            <Text className="text-base font-bold text-orange-500">${totalPriceWithTax.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Confirm Button */}
            <View className={`absolute bottom-0 left-0 right-0 px-4 py-4 border-t ${colorScheme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                <TouchableOpacity
                    onPress={handleConfirmPayment}
                    disabled={isProcessing || !selectedCard}
                    className={`rounded-2xl py-4 items-center justify-center flex-row ${isProcessing || !selectedCard ? "bg-orange-300" : "bg-orange-500"}`}
                >
                    {isProcessing ? (
                        <>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text className="text-white text-lg font-bold ml-2">Processing...</Text>
                        </>
                    ) : (
                        <>
                            <Ionicons name="shield-checkmark-outline" size={22} color="#fff" />
                            <Text className="text-white text-lg font-bold ml-2">Confirm & Pay ${totalPriceWithTax.toFixed(2)}</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
