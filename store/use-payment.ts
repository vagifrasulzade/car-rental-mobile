import { create } from "zustand";
import { BookingDetails } from "./use-add-booking";

export type PaymentStatus = "idle" | "processing" | "success" | "failed";

export interface CompletedBooking extends BookingDetails {
    bookingId: string;
    paidAt: string;
}

interface PaymentState {
    status: PaymentStatus;
    errorMessage: string | null;
    completedBookings: CompletedBooking[];
    setStatus: (status: PaymentStatus) => void;
    confirmPayment: (details: BookingDetails) => CompletedBooking;
    resetPayment: () => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
    status: "idle",
    errorMessage: null,
    completedBookings: [],

    setStatus: (status: PaymentStatus) => set({ status }),

    confirmPayment: (details: BookingDetails): CompletedBooking => {
        set({ status: "processing" });

        const booking: CompletedBooking = {
            ...details,
            bookingId: `BK-${Date.now()}`,
            paidAt: new Date().toISOString(),
        };

        set((state) => ({
            status: "success",
            completedBookings: [booking, ...state.completedBookings],
            errorMessage: null,
        }));

        return booking;
    },

    resetPayment: () => set({ status: "idle", errorMessage: null }),
}));
