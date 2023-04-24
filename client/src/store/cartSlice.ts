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
  items: [],
  amount: 0,
  price: 0,
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
    }
  },
});

export default cartSlice.reducer;
