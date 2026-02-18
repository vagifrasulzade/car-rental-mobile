import SignUpForm from "@/components/signup/sign-up.form";
import useTheme from "@/hooks/use-theme";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
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
				{"Getting Started"}
			</Text>

			<View className="mb-2 rounded-lg">
				<Text
					className={`text-base ${
						isDark ? "text-gray-300" : "text-gray-700"
					}`}
				>
					Create an account to continue!
				</Text>
			</View>

			<SignUpForm />
		</SafeAreaView>
	);
}

