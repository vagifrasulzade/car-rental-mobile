import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "@/hooks/use-theme";
import { router } from "expo-router";
import { carModels } from "@/data/car-models";
import { carLogos } from "@/data/car-logo";


// Use real car data from carModels
const cars = carModels.slice(0, 4).map(car => ({
  id: car.id,
  name: `${car.brand} ${car.model} - ${car.type}`,
  image: car.image,
  rating: 4.8,
  reviews: "140+",
  price: car.pricePerDay,
}));

// Get brands from carLogos data
const brands = carLogos.slice(0, 6).map(logo => ({
  name: logo.name,
  slug: logo.slug,
  logo: logo.image.source,
}));

export default function HomeScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className={`${isDark ? "bg-gray-900" : "bg-white"} px-5 pt-2 pb-5`}>
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="bg-yellow-400 p-2.5 rounded-full mr-3">
                <Ionicons name="location" size={18} color="white" />
              </View>
              <View>
                <Text className={`${isDark ? "text-gray-400" : "text-gray-500"} text-xs`}>Your location</Text>
                <View className="flex-row items-center">
                  <Text className={`${isDark ? "text-white" : "text-black"} font-bold text-base`}>Ngangphaf,Selman</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={20} color={isDark ? "white" : "black"} />
                </View>
              </View>
            </View>
            <Image
              source={{ uri: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcROYJiJKNe3IQnWOD7Y07Tq2ZHZIpdGlO_IZI1hA4EOOFL5kGvH" }}
              className="w-20 h-20 rounded-full"
            />
          </View>
        </View>

        <View className="px-5">
          {/* Title */}
          <Text className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"} mt-6 leading-tight`}>
            Find your favourite{"\n"}vechicle.
          </Text>

          {/* Search Bar */}
          <View className={`${isDark ? "bg-gray-800" : "bg-gray-50"} flex-row items-center px-5 py-4 rounded-full mt-6`} style={{shadowColor: "#000", shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1}}>
            <Ionicons name="search" size={22} color="#6B7280" />
            <TextInput
              placeholder="Search vechicle"
              placeholderTextColor="#9CA3AF"
              className={`flex-1 ml-3 text-base ${isDark ? "text-gray-200" : "text-gray-700"}`}
            />
          </View>

          {/* Top Brands */}
          <View className="mt-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Top Brands</Text>
              <TouchableOpacity>
                <Text className="text-orange-500 font-semibold">See All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {brands.map((brand, index) => (
                <TouchableOpacity
                  key={index}
                  className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl p-4 mr-3 items-center justify-center`}
                  style={{ width: 85, height: 85, shadowColor: "#000", shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 }}
                >
                  <Image
                    source={{ uri: brand.logo }}
                    className="w-10 h-10"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Available Near You */}
          <View className="mt-8 pb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Available Near You</Text>
              <TouchableOpacity>
                <Text className="text-orange-500 font-semibold">See All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {cars.map((car) => (
                <TouchableOpacity 
                  key={car.id} 
                  onPress={() => router.push(`/car/${car.id}/page`)}
                  className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-3xl mr-4`} 
                  style={{ width: 300, shadowColor: "#000", shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
                >
                  <Image
                    source={{ uri: car.image }}
                    className="w-full h-44 rounded-t-3xl"
                    resizeMode="cover"
                  />
                  <View className="p-5 pb-4">
                    <Text className={`text-base font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-3`}>{car.name}</Text>
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center">
                        <Ionicons name="star" size={16} color="#FDB74B" />
                        <Text className={`text-sm font-bold ml-1 ${isDark ? "text-gray-200" : "text-gray-900"}`}>{car.rating}</Text>
                        <Text className="text-xs text-gray-400 ml-1">[{car.reviews} Review]</Text>
                      </View>
                      <View className="flex-row items-baseline">
                        <Text className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>${car.price.toLocaleString()}</Text>
                        <Text className="text-xs text-gray-400"> /day</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
