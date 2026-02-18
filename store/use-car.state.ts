import { create } from "zustand";

interface CarState {
    brand: string[];
    setBrand: (brand: string[]) => void;
}

export const useCarState = create<CarState>((set) => ({
    brand: [],
    setBrand: (brand) => set({ brand })
}))