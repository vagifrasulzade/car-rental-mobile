import { create } from "zustand";

export interface Card {
    id: string;
    cardNumber: string;         
    cardHolderName: string;
    cardExpirationDate: string; 
    cardCvv: string;
    cardType: "visa" | "mastercard" | "amex" | "other";
    last4: string;
}

interface AddCardState {
    cards: Card[];
    selectedCardId: string | null;
    addCard: (card: Card) => void;
    removeCard: (id: string) => void;
    selectCard: (id: string) => void;
}

export const useAddCardStore = create<AddCardState>((set) => ({
    cards: [],
    selectedCardId: null,
    addCard: (card: Card) =>
        set((state) => ({
            cards: [...state.cards, card],
            selectedCardId: card.id,
        })),
    removeCard: (id: string) =>
        set((state) => ({
            cards: state.cards.filter((c) => c.id !== id),
            selectedCardId: state.selectedCardId === id
                ? (state.cards.find((c) => c.id !== id)?.id ?? null)
                : state.selectedCardId,
        })),
    selectCard: (id: string) => set({ selectedCardId: id }),
}))