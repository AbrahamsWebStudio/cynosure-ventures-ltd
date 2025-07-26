// store/cartStore.ts
import { create } from "zustand";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image_url?: string;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (index) =>
    set((state) => {
      const newCart = [...state.cart];
      newCart.splice(index, 1);
      return { cart: newCart };
    }),
  clearCart: () => set({ cart: [] }),
}));
