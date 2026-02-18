import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CarList() {
    return (
        <SafeAreaView>
            <Pressable onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="black" />
            </Pressable>
            <Text>Car List</Text>
            <Text>Car List</Text>
            <Text>Car List</Text>
            <Text>Car List</Text>
            <Text>Car List</Text>
            <Text>Car List</Text>
        </SafeAreaView>
    )
}