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

const storeCart = (state: CartState) => {
  localStorage.setItem("cart", JSON.stringify(state.items));
  localStorage.setItem("cartAmount", state.amount as unknown as string);
  localStorage.setItem("cartPrice", state.price as unknown as string);
};

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
      } else {
        const newItem: IItem = {
          id: action.payload.id,
          item: { ...action.payload },
          amount: 1,
        };
        state.items.push(newItem);
      }
      state.amount++;
      state.price += action.payload.price;
      storeCart(state);
    },
    clearCart(state) {
      state.items = [];
      state.amount = 0;
      state.price = 0;
      localStorage.removeItem("cart");
      localStorage.removeItem("cartAmount");
      localStorage.removeItem("cartPrice");
    },
    increase(state, action: PayloadAction<IProduct>) {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (!item) {
        return;
      }

      item.amount++;
      state.amount++;
      state.price += action.payload.price;
      storeCart(state);
    },
    decrease(state, action: PayloadAction<IProduct>) {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (!item) {
        return;
      }

      item.amount--;
      state.amount--;
      state.price -= action.payload.price;
      if (item.amount === 0) {
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id
        );
      }

      storeCart(state);
    },
    removeItem(state, action: PayloadAction<IProduct>) {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (!item) {
        return;
      }

      state.items = state.items.filter((item) => item.id !== action.payload.id);
      state.amount -= item.amount;
      state.price -= item.amount * action.payload.price;
      storeCart(state);
    },
  },
});

export const { addToCart, clearCart, increase, decrease, removeItem } =
  cartSlice.actions;
export default cartSlice.reducer;
