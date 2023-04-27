import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ApiCallState } from "../shared/types/enumerations";
import { defaultErrorMessage } from "../constants/Constants";
import { ICreateOrder, IOrder } from "../shared/interfaces/orderInterfaces";
import { CreateOrder } from "../services/OrderService";

export interface OrdersState {
  apiState: ApiCallState;
}

const initialState: OrdersState = {
  apiState: "COMPLETED",
};

export const createOrderAction = createAsyncThunk(
  "orders/create",
  async (data: ICreateOrder, thunkApi) => {
    try {
      const response = await CreateOrder(data);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createOrderAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      createOrderAction.fulfilled,
      (state, action: PayloadAction<IOrder>) => {
        state.apiState = "COMPLETED";
        
        toast.success("Order successfully created", {
          position: "top-center",
          autoClose: 2500,
          closeOnClick: true,
          pauseOnHover: false,
        });
      }
    );
    builder.addCase(createOrderAction.rejected, (state, action) => {
      state.apiState = "REJECTED";
      let error: string = defaultErrorMessage;
      if (typeof action.payload === "string") {
        error = action.payload;
      }

      toast.error(error, {
        position: "top-center",
        autoClose: 2500,
        closeOnClick: true,
        pauseOnHover: false,
      });
    });
  },
});

export default ordersSlice.reducer;
