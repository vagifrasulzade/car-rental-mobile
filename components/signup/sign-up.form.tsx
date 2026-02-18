
import useTheme from "@/hooks/use-theme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { signUpSchema, SignUpSchema } from "./sign-up.schema";

export default function SignUpForm() {
	const { colorScheme } = useTheme();
	const isDark = colorScheme === "dark";
	const [showPassword, setShowPassword] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: SignUpSchema) => {
		try {
			const { confirmPassword, ...user } = data;
			await AsyncStorage.setItem("user", JSON.stringify(user));
			await AsyncStorage.removeItem("isAuthenticated");
			router.replace("/signin");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<View className={`flex-1 justify-between mt-8 ${isDark ? "bg-gray-900" : "bg-white"}`}>
			<View>
				<Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mb-3 mt-6`}>
					Username
				</Text>
				<View
					className={`flex-row items-center border-b pb-2 ${
						isDark ? "border-gray-700" : "border-gray-200"
					}`}
				>
					<Ionicons name="person-outline" size={24} color="#666" style={{ marginRight: 12 }} />
					<Controller
						control={control}
						name="name"
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
				{errors.name && (
					<Text className="text-xs text-red-500 mt-1">{errors.name.message}</Text>
				)}

				<Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mb-3 mt-6`}>
					Email
				</Text>
				<View
					className={`flex-row items-center border-b pb-2 ${
						isDark ? "border-gray-700" : "border-gray-200"
					}`}
				>
					<Ionicons name="mail-outline" size={24} color="#666" style={{ marginRight: 12 }} />
					<Controller
						control={control}
						name="email"
						render={({ field: { onChange, value } }) => (
							<TextInput
								className={`flex-1 text-base ${isDark ? "text-white" : "text-gray-900"}`}
								placeholder="Email"
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
					<MaterialIcons name="lock-outline" size={24} color="#666" style={{ marginRight: 12 }} />
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
					<TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} className="p-1">
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

				<Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mb-3 mt-6`}>
					Confirm Password
				</Text>
				<View
					className={`flex-row items-center border-b pb-2 ${
						isDark ? "border-gray-700" : "border-gray-200"
					}`}
				>
					<MaterialIcons name="lock-outline" size={24} color="#666" style={{ marginRight: 12 }} />
					<Controller
						control={control}
						name="confirmPassword"
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
					<TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} className="p-1">
						<Ionicons
							name={showPassword ? "eye-outline" : "eye-off-outline"}
							size={24}
							color="#666"
						/>
					</TouchableOpacity>
				</View>
				{errors.confirmPassword && (
					<Text className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</Text>
				)}
			</View>

			<View>
				<TouchableOpacity
					className="bg-orange-500 flex-row items-center justify-center py-4 rounded-lg mt-10 gap-2"
					onPress={handleSubmit(onSubmit)}
				>
					<Text className="text-white text-base font-semibold tracking-widest">SIGN UP</Text>
					<Ionicons name="arrow-forward" size={24} color="#FFF" />
				</TouchableOpacity>

				<View className="flex-row justify-center items-center mt-6">
					<Text className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>
						If you already have an account,{" "}
					</Text>
					<TouchableOpacity onPress={() => router.push("/signin")}>
						<Text className={`${isDark ? "text-white" : "text-black"} text-sm font-semibold`}>
							Sign in
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
