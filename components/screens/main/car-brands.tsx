import { carModels } from "@/data/car-models";
import useTheme from "@/hooks/use-theme";
import { useCarState } from "@/store/use-car.state";
import { CarModel } from "@/types/car-model.types";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const pickFeaturedCars = (models: CarModel[]) => {
  return [...models].sort(() => Math.random() - 0.5).slice(0, 6);
};

export default function CarBrands() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const { brand } = useCarState();

  const [featuredCars, setFeaturedCars] = useState<CarModel[]>(() =>
    pickFeaturedCars(carModels as CarModel[])
  );

  useEffect(() => {
    setFeaturedCars(pickFeaturedCars(carModels as CarModel[]));
  }, []);

  const cars = useMemo(() => {
    if (brand.length > 0) {
      return (carModels as CarModel[]).filter((car) => car.brandSlug === brand[0]);
    }

    return featuredCars;
  }, [brand, featuredCars]);

  const renderCarCard = ({ item }: { item: CarModel }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/car/${item.id}/page`)}
      className={`mr-4 w-[300px] rounded-3xl overflow-hidden ${
        isDark ? "bg-gray-900" : "bg-white"
      }`}
      style={{
        shadowColor: "rgba(0,0,0,0.2)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 0,
      }}
    >
      <Image
        source={{ uri: (item as any).images?.[1] || item.image }}
        className="h-44 w-full rounded-t-3xl"
        contentFit="cover"
      />
      <View className="p-5 pb-4 ">
        <Text className={`text-base font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
          {item.brand}
        </Text>
        <Text className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {item.model}
        </Text>
        <View className="mt-3 flex-row items-center justify-between">
          <Text className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {item.year}
          </Text>
          <View className="flex-row items-baseline">
            <Text className={`text-base font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              ${item.pricePerDay}
            </Text>
            <Text className="text-xs text-gray-400"> /day</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className={`mt-8 pb-8 ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <View className="flex-row items-center justify-between mb-4">
        <Text className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Available Near You
        </Text>
        <TouchableOpacity onPress={() => router.push("/car-list")}
          className="rounded-full px-3 py-1"
        >
          <Text className="text-orange-500 font-semibold">See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        renderItem={renderCarCard}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      />
    </View>
  );
}
