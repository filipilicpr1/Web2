import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "../shared/interfaces/productsInterfaces";

interface IItem {
  id: string;
  item: IProduct;
  amount: number;
}

export interface CartState {
  items: IItem[];
  amount: number;
  price: number;
}

const initialState: CartState = {
  items:
    localStorage.getItem("cart") !== null
      ? JSON.parse(localStorage.getItem("cart") as string)
      : [],
  amount:
    localStorage.getItem("cartAmount") !== null
      ? JSON.parse(localStorage.getItem("cartAmount") as string)
      : 0,
  price:
    localStorage.getItem("cartPrice") !== null
      ? JSON.parse(localStorage.getItem("cartPrice") as string)
      : 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<IProduct>) {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.amount++;
      }

      const newItem: IItem = {
        id: action.payload.id,
        item: { ...action.payload },
        amount: 1,
      };

      state.items.push(newItem);
      state.amount++;
      state.price += action.payload.price;
      localStorage.setItem("cart", JSON.stringify(state.items));
      localStorage.setItem("cartAmount", state.amount as unknown as string);
      localStorage.setItem("cartPrice", state.price as unknown as string);
    },
    clearCart(state) {
        state.items = [];
        state.amount = 0;
        state.price = 0;
        localStorage.removeItem("cart");
        localStorage.removeItem("cartAmount");
        localStorage.removeItem("cartPrice");
    }
  },
});

export const { addToCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
