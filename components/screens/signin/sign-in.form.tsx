import useTheme from "@/hooks/use-theme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { signInSchema, SignInSchema } from "./sign-up.schema";

export default function SignInForm() {
	const { colorScheme } = useTheme();
	const isDark = colorScheme === "dark";
	const [showPassword, setShowPassword] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInSchema>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: SignInSchema) => {
		try {
			setAuthError(null);
			const stored = await AsyncStorage.getItem("user");
			if (!stored) {
				setAuthError("No account found. Please sign up first.");
				return;
			}

			const storedUser: { email?: string; password?: string } = JSON.parse(stored);
			if (
				!storedUser.email ||
				!storedUser.password ||
				storedUser.email.toLowerCase() !== data.email.toLowerCase() ||
				storedUser.password !== data.password
			) {
				setAuthError("Invalid email or password.");
				return;
			}

			await AsyncStorage.setItem("isAuthenticated", "true");
			router.replace("/(tabs)");
		} catch (error) {
			console.error(error);
			setAuthError("Something went wrong. Please try again.");
		}
	};

	return (
		<View className={`flex-1 justify-between mt-8 ${isDark ? "bg-gray-900" : "bg-white"}`}>
			<View>
				<Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mb-3 mt-6`}>
					Username or Email
				</Text>
				<View
					className={`flex-row items-center border-b pb-2 ${
						isDark ? "border-gray-700" : "border-gray-200"
					}`}
				>
					<Ionicons name="person-outline" size={24} color="#666" className="mr-3" />
					<Controller
						control={control}
						name="email"
						render={({ field: { onChange, value } }) => (
							<TextInput
								className={`flex-1 text-base ${isDark ? "text-white" : "text-gray-900"}`}
								placeholder="Username"
								placeholderTextColor="#999"
								onChangeText={onChange}
								value={value}
								autoCapitalize="none"
							/>
						)}
					/>
				</View>
				{errors.email && (
					<Text className="text-xs text-red-500 mt-1">{errors.email.message}</Text>
				)}

				<Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mb-3 mt-6`}>
					Password
				</Text>
				<View
					className={`flex-row items-center border-b pb-2 ${
						isDark ? "border-gray-700" : "border-gray-200"
					}`}
				>
					<MaterialIcons name="lock-outline" size={24} color="#666" className="mr-3" />
					<Controller
						control={control}
						name="password"
						render={({ field: { onChange, value } }) => (
							<TextInput
								className={`flex-1 text-base ${isDark ? "text-white" : "text-gray-900"}`}
								placeholder="••••••••"
								placeholderTextColor="#999"
								secureTextEntry={!showPassword}
								onChangeText={onChange}
								value={value}
								autoCapitalize="none"
							/>
						)}
					/>
					<TouchableOpacity
						onPress={() => setShowPassword((prev) => !prev)}
						className="p-1"
					>
						<Ionicons
							name={showPassword ? "eye-outline" : "eye-off-outline"}
							size={24}
							color="#666"
						/>
					</TouchableOpacity>
				</View>
				{errors.password && (
					<Text className="text-xs text-red-500 mt-1">{errors.password.message}</Text>
				)}

				{authError && (
					<Text className="text-xs text-red-500 mt-2">{authError}</Text>
				)}
			</View>

			<View>
				<TouchableOpacity
					className="bg-orange-500 flex-row items-center justify-center py-4 rounded-lg mt-10 gap-2"
					onPress={handleSubmit(onSubmit)}
				>
					<Text className="text-white text-base font-semibold tracking-widest">SIGN IN</Text>
					<Ionicons name="arrow-forward" size={24} color="#FFF" />
				</TouchableOpacity>

				<View className="flex-row justify-center items-center mt-6">
					<Text className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>
						Don&apos;t have an account?{" "}
					</Text>
					<TouchableOpacity onPress={() => router.push("/signup")}>
						<Text className={`${isDark ? "text-white" : "text-black"} text-sm font-semibold`}>
							Sign up
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
