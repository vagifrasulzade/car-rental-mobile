import { ThemeContext } from "@/hooks/use-theme-context";
import { ThemeType } from "@/types/theme.type";
import { useState, useEffect } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeProviderProps {
    children: React.ReactNode;
}

const THEME_STORAGE_KEY = "@app_theme";

export default function ThemeProvider({ children }: ThemeProviderProps) {

    const [appTheme, setAppTheme] = useState<ThemeType>("system");
    const [isLoading, setIsLoading] = useState(true);
    const systemColorScheme = useSystemColorScheme();

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme && (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system")) {
                    setAppTheme(savedTheme as ThemeType);
                }
            } catch (error) {
                console.error("Error loading theme:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async (theme: ThemeType) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
            setAppTheme(theme);
        } catch (error) {
            console.error("Error saving theme:", error);
        }
    }

    const getColorSchema = (): "light" | "dark" => {
        if (appTheme === "light") return "light";
        if (appTheme === "dark") return "dark";
        return systemColorScheme === "light" ? "light" : "dark";
    }

    return (
        <ThemeContext.Provider
            value={{
                theme: appTheme,
                colorScheme: getColorSchema(),
                toggleTheme: toggleTheme,
            }}>
            {children}
        </ThemeContext.Provider>
    )

}