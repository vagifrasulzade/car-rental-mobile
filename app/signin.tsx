import SignInForm from "@/components/screens/signin/sign-in.form";
import useTheme from "@/hooks/use-theme";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
	const { colorScheme } = useTheme();
	const isDark = colorScheme === "dark";

	return (
		<SafeAreaView
			className={`flex-1 px-9 pt-6 ${isDark ? "bg-gray-900" : "bg-white"}`}
		>
			<Text
				className={`text-3xl font-bold mb-4 ${
					isDark ? "text-white" : "text-gray-900"
				}`}
			>
				{"Let's Sign You In"}
			</Text>

			<View className="mb-2 rounded-lg">
				<Text
					className={`text-base ${
						isDark ? "text-gray-300" : "text-gray-700"
					}`}
				>
					{"Welcome back, you've been missed!"}
				</Text>
			</View>

			<SignInForm />
		</SafeAreaView>
	);
}

