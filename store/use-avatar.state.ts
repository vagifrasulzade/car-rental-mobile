import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface AvatarState {
    avatar: string | null;
    setAvatar: (avatar: string) => Promise<void>;
    loadAvatar: () => Promise<void>;
}

const AVATAR_STORAGE_KEY = "user-avatar";

export const useAvatarStore = create<AvatarState>((set) => ({
    avatar: null,
    setAvatar: async (avatar: string) => {
        set({ avatar });
        try {
            await AsyncStorage.setItem(AVATAR_STORAGE_KEY, avatar);
        } catch (error) {
            console.error("Failed to save avatar to AsyncStorage:", error);
        }
    },
    loadAvatar: async () => {
        try {
            const savedAvatar = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
            if (savedAvatar) {
                set({ avatar: savedAvatar });
            }
        } catch (error) {
            console.error("Failed to load avatar from AsyncStorage:", error);
        }
    },
}));