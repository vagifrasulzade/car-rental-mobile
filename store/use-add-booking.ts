import { create } from "zustand";

export interface BookingDetails {
    carId: string;
    startDate: string;
    endDate: string;
    pickupTime: string;
    returnTime: string;
    withDriver: boolean;
    numberOfDays: number;
    pricePerDay: number;
    totalPrice: number;
    totalPriceWithTax: number;
    pickupLocationName: string;
    pickupLocationCoords: { latitude: number; longitude: number } | null;
    selectedPaymentMethod: string;
    selectedCardLast4: string;
}

interface AddBookingState extends BookingDetails {
    setStartDate: (startDate: string) => void;
    setEndDate: (endDate: string) => void;
    setCarId: (carId: string) => void;
    setBookingDetails: (details: Partial<BookingDetails>) => void;
    resetBooking: () => void;
}

const initialState: BookingDetails = {
    carId: "",
    startDate: "",
    endDate: "",
    pickupTime: "",
    returnTime: "",
    withDriver: false,
    numberOfDays: 1,
    pricePerDay: 0,
    totalPrice: 0,
    totalPriceWithTax: 0,
    pickupLocationName: "",
    pickupLocationCoords: null,
    selectedPaymentMethod: "mastercard",
    selectedCardLast4: "4567 5485",
};

export const useAddBookingStore = create<AddBookingState>((set) => ({
    ...initialState,
    setStartDate: (startDate: string) => set({ startDate }),
    setEndDate: (endDate: string) => set({ endDate }),
    setCarId: (carId: string) => set({ carId }),
    setBookingDetails: (details: Partial<BookingDetails>) => set((state) => ({ ...state, ...details })),
    resetBooking: () => set({ ...initialState }),
}));