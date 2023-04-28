import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ApiCallState } from "../shared/types/enumerations";
import { defaultErrorMessage } from "../constants/Constants";
import { ICreateOrder, IOrder } from "../shared/interfaces/orderInterfaces";
import {
  CreateOrder,
  GetDeliveredOrCanceledOrdersBySeller,
} from "../services/OrdersService";

export interface OrdersState {
  sellerDeliveredOrders: IOrder[];
  page: number;
  totalPages: number;
  apiState: ApiCallState;
}

const initialState: OrdersState = {
  sellerDeliveredOrders: [],
  page: 1,
  totalPages: 0,
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

interface IGetOrders {
  id: string;
  query: string;
}

interface IPagedOrders {
  items: IOrder[];
  page: number;
  totalPages: number;
}

export const getDeliveredOrCanceledBySellerAction = createAsyncThunk(
  "orders/getDeliveredOrCanceledBySeller",
  async (data: IGetOrders, thunkApi) => {
    try {
      const response = await GetDeliveredOrCanceledOrdersBySeller(
        data.id,
        data.query
      );
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    changePage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    clearSellerDeliveredOrders(state) {
      state.sellerDeliveredOrders = [];
      state.page = 1;
      state.totalPages = 0;
      state.apiState = "COMPLETED";
    },
  },
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

    builder.addCase(getDeliveredOrCanceledBySellerAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      getDeliveredOrCanceledBySellerAction.fulfilled,
      (state, action: PayloadAction<IPagedOrders>) => {
        state.apiState = "COMPLETED";
        state.sellerDeliveredOrders = [...action.payload.items];
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      }
    );
    builder.addCase(
      getDeliveredOrCanceledBySellerAction.rejected,
      (state, action) => {
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
      }
    );
  },
});

export const { changePage, clearSellerDeliveredOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
