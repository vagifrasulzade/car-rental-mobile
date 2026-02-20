import useTheme from "@/hooks/use-theme";
import { Card, useAddCardStore } from "@/store/use-add-card";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CARD_LOGOS: Record<string, string> = {
    visa: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1280px-Visa_Inc._logo.svg.png",
    mastercard: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png",
    amex: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1280px-American_Express_logo_%282018%29.svg.png",
    other: "",
};

function detectCardType(num: string): Card["cardType"] {
    const raw = num.replace(/\s/g, "");
    if (/^4/.test(raw)) return "visa";
    if (/^5[1-5]/.test(raw)) return "mastercard";
    if (/^3[47]/.test(raw)) return "amex";
    return "other";
}

function formatCardNumber(value: string) {
    const raw = value.replace(/\D/g, "").slice(0, 16);
    return raw.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
    const raw = value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) return raw.slice(0, 2) + "/" + raw.slice(2);
    return raw;
}

export default function AddCardPage() {
    const { colorScheme } = useTheme();
    const isDark = colorScheme === "dark";
    const router = useRouter();
    const { addCard } = useAddCardStore();

    const [cardNumber, setCardNumber] = useState("");
    const [holderName, setHolderName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const cardType = detectCardType(cardNumber);
    const raw = cardNumber.replace(/\s/g, "");

    const bg = isDark ? "bg-gray-900" : "bg-white";
    const inputBg = isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900";
    const labelColor = isDark ? "text-gray-400" : "text-gray-500";
    const textPrimary = isDark ? "text-white" : "text-gray-900";

    const validate = () => {
        const e: Record<string, string> = {};
        if (raw.length < 13) e.cardNumber = "Enter a valid card number";
        if (!holderName.trim()) e.holderName = "Cardholder name is required";
        const [mm] = expiry.split("/");
        if (expiry.length < 5 || !mm || parseInt(mm) < 1 || parseInt(mm) > 12) e.expiry = "Enter valid expiry (MM/YY)";
        if (cvv.length < 3) e.cvv = "CVV must be 3–4 digits";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        const card: Card = {
            id: `card-${Date.now()}`,
            cardNumber: `•••• •••• •••• ${raw.slice(-4)}`,
            cardHolderName: holderName.trim(),
            cardExpirationDate: expiry,
            cardCvv: cvv,
            cardType,
            last4: raw.slice(-4),
        };
        addCard(card);
        router.back();
    };

    // Flip card preview color by type
    const cardGradient =
        cardType === "visa" ? "#1A1F71"
        : cardType === "mastercard" ? "#EB001B"
        : cardType === "amex" ? "#007BC1"
        : "#2D2D2D";

    return (
        <SafeAreaView className={`flex-1 ${bg}`} edges={["top"]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                {/* Header */}
                <View className="flex-row items-center px-4 py-4">
                    <TouchableOpacity onPress={() => router.back()} className="mr-3">
                        <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
                    </TouchableOpacity>
                    <Text className={`text-xl font-bold flex-1 ${textPrimary}`}>Add Payment Method</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    {/* Card Preview */}
                    <View className="mx-6 mt-2 mb-6 rounded-3xl p-5 h-48 justify-between"
                        style={{ backgroundColor: cardGradient }}>
                        <View className="flex-row justify-between items-start">
                            <View className="bg-white/10 rounded-lg px-2 py-1">
                                <Text className="text-white/80 text-xs font-medium">
                                    {cardType !== "other" ? cardType.toUpperCase() : "CARD"}
                                </Text>
                            </View>
                            {CARD_LOGOS[cardType] ? (
                                <Image
                                    source={{ uri: CARD_LOGOS[cardType] }}
                                    style={{ width: 52, height: 32 }}
                                    contentFit="contain"
                                />
                            ) : (
                                <Ionicons name="card-outline" size={32} color="rgba(255,255,255,0.5)" />
                            )}
                        </View>

                        <View>
                            <Text className="text-white/60 text-sm tracking-widest font-mono">
                                {cardNumber
                                    ? cardNumber.padEnd(19, " ").replace(/\d(?!(?:\d| ){0,3}$)/g, "•")
                                    : "•••• •••• •••• ••••"}
                            </Text>
                        </View>

                        <View className="flex-row justify-between items-end">
                            <View>
                                <Text className="text-white/50 text-xs">CARDHOLDER</Text>
                                <Text className="text-white font-semibold text-sm mt-0.5">
                                    {holderName.toUpperCase() || "YOUR NAME"}
                                </Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-white/50 text-xs">EXPIRES</Text>
                                <Text className="text-white font-semibold text-sm mt-0.5">
                                    {expiry || "MM/YY"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Form */}
                    <View className="px-6 gap-4">
                        {/* Card Number */}
                        <View>
                            <Text className={`text-sm font-medium mb-1.5 ${labelColor}`}>Card Number</Text>
                            <View className={`flex-row items-center border rounded-2xl px-4 ${inputBg} ${errors.cardNumber ? "border-red-500" : ""}`}>
                                <Ionicons name="card-outline" size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
                                <TextInput
                                    className={`flex-1 ml-3 py-4 text-base ${isDark ? "text-white" : "text-gray-900"}`}
                                    placeholder="0000 0000 0000 0000"
                                    placeholderTextColor={isDark ? "#4B5563" : "#9CA3AF"}
                                    keyboardType="numeric"
                                    maxLength={19}
                                    value={cardNumber}
                                    onChangeText={(v) => setCardNumber(formatCardNumber(v))}
                                />
                            </View>
                            {errors.cardNumber && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.cardNumber}</Text>}
                        </View>

                        {/* Cardholder */}
                        <View>
                            <Text className={`text-sm font-medium mb-1.5 ${labelColor}`}>Cardholder Name</Text>
                            <View className={`flex-row items-center border rounded-2xl px-4 ${inputBg} ${errors.holderName ? "border-red-500" : ""}`}>
                                <Ionicons name="person-outline" size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
                                <TextInput
                                    className={`flex-1 ml-3 py-4 text-base ${isDark ? "text-white" : "text-gray-900"}`}
                                    placeholder="Name on card"
                                    placeholderTextColor={isDark ? "#4B5563" : "#9CA3AF"}
                                    autoCapitalize="characters"
                                    value={holderName}
                                    onChangeText={setHolderName}
                                />
                            </View>
                            {errors.holderName && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.holderName}</Text>}
                        </View>

                        {/* Expiry + CVV */}
                        <View className="flex-row gap-4">
                            <View className="flex-1">
                                <Text className={`text-sm font-medium mb-1.5 ${labelColor}`}>Expiry Date</Text>
                                <View className={`flex-row items-center border rounded-2xl px-4 ${inputBg} ${errors.expiry ? "border-red-500" : ""}`}>
                                    <Ionicons name="calendar-outline" size={18} color={isDark ? "#9CA3AF" : "#6B7280"} />
                                    <TextInput
                                        className={`flex-1 ml-2 py-4 text-base ${isDark ? "text-white" : "text-gray-900"}`}
                                        placeholder="MM/YY"
                                        placeholderTextColor={isDark ? "#4B5563" : "#9CA3AF"}
                                        keyboardType="numeric"
                                        maxLength={5}
                                        value={expiry}
                                        onChangeText={(v) => setExpiry(formatExpiry(v))}
                                    />
                                </View>
                                {errors.expiry && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.expiry}</Text>}
                            </View>

                            <View className="flex-1">
                                <Text className={`text-sm font-medium mb-1.5 ${labelColor}`}>CVV</Text>
                                <View className={`flex-row items-center border rounded-2xl px-4 ${inputBg} ${errors.cvv ? "border-red-500" : ""}`}>
                                    <Ionicons name="lock-closed-outline" size={18} color={isDark ? "#9CA3AF" : "#6B7280"} />
                                    <TextInput
                                        className={`flex-1 ml-2 py-4 text-base ${isDark ? "text-white" : "text-gray-900"}`}
                                        placeholder="•••"
                                        placeholderTextColor={isDark ? "#4B5563" : "#9CA3AF"}
                                        keyboardType="numeric"
                                        maxLength={4}
                                        secureTextEntry
                                        value={cvv}
                                        onChangeText={setCvv}
                                    />
                                </View>
                                {errors.cvv && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.cvv}</Text>}
                            </View>
                        </View>

                        {/* Save */}
                        <TouchableOpacity
                            onPress={handleSave}
                            className="bg-orange-500 rounded-2xl py-4 items-center mt-4 mb-8"
                        >
                            <Text className="text-white text-base font-bold">Save Card</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
