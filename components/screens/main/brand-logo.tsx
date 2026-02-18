import { carLogos } from "@/data/car-logo";
import useTheme from "@/hooks/use-theme";
import { useCarState } from "@/store/use-car.state";
import { Image } from "expo-image";
import { router } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function BrandLogo() {
    const { colorScheme } = useTheme();
    const isDark = colorScheme === "dark";
    const { brand, setBrand } = useCarState();

    const handleBrandPress = (slug: string) => {
        setBrand([slug]);
    };

    const renderBrandItem = ({ item }: { item: (typeof carLogos)[0] }) => {
        const isSelected = brand.includes(item.slug);

        return (
            <TouchableOpacity
                onPress={() => handleBrandPress(item.slug)}
                activeOpacity={0.85}
                className={`mr-3 h-[100px] w-[100px] items-center justify-center rounded-[12px] border ${
                    isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
                } ${isSelected ? "border-orange-500 bg-orange-50" : ""}`}
                style={{
                    shadowColor: "rgba(0,0,0,0.25)",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 4,
                }}
            >
                <Image
                    source={{ uri: item.image.source }}
                    className="h-full w-full rounded-[12px]"
                    contentFit="contain"
                />
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 px-3 mt-5">
            <View className="flex-row items-center justify-between">
                <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Top Brands
                </Text>
                <TouchableOpacity
                    className="px-2 py-1"
                    onPress={() => router.push("/car-list")}
                >
                    <Text className="text-orange-500 font-semibold">See All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={carLogos}
                keyExtractor={(item) => item.slug}
                renderItem={renderBrandItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-4"
                contentContainerStyle={{ columnGap: 12 }}
            />
        </View>
    );
}