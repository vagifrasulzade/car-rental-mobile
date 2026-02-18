import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@/hooks/use-theme";

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FDB74B",
        tabBarInactiveTintColor: isDark ? "#6B7280" : "#9CA3AF",
        tabBarStyle: {
          backgroundColor: isDark ? "#111827" : "white",
          borderTopWidth: 1,
          borderTopColor: isDark ? "#1F2937" : "#E5E7EB",
          elevation: 0,
          height: 100,
          paddingBottom: 10,
          paddingTop: 15,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons name="location" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="car-list"
        options={{
          title: "",
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "",
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/personal-information"
        options={{
          title: "",
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/driver-license"
        options={{
          title: "",
          href: null,
        }}
      />
    </Tabs>
  );
}
