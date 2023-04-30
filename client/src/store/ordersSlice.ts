import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ApiCallState } from "../shared/types/enumerations";
import { defaultErrorMessage } from "../constants/Constants";
import { ICreateOrder, IOrder } from "../shared/interfaces/orderInterfaces";
import {
  CreateOrder,
  GetDeliveredOrCanceledOrdersBySeller,
  GetAllOrders,
  GetDeliveredOrdersByBuyer,
  GetOngoingOrdersByBuyer,
  GetOngoingOrdersBySeller,
  GetOrderById
} from "../services/OrdersService";

export interface OrdersState {
  sellerDeliveredOrders: IOrder[];
  allOrders: IOrder[];
  buyerDeliveredOrders: IOrder[];
  buyerOngoingOrders: IOrder[];
  sellerOngoingOrders: IOrder[];
  detailedOrder: IOrder | null;
  page: number;
  totalPages: number;
  apiState: ApiCallState;
}

const initialState: OrdersState = {
  sellerDeliveredOrders: [],
  allOrders: [],
  buyerDeliveredOrders: [],
  buyerOngoingOrders: [],
  sellerOngoingOrders: [],
  detailedOrder: null,
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

export const getAllOrdersAction = createAsyncThunk(
  "orders/getAll",
  async (query: string, thunkApi) => {
    try {
      const response = await GetAllOrders(query);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

export const getDeliveredByBuyerAction = createAsyncThunk(
  "orders/getDeliveredByBuyer",
  async (data: IGetOrders, thunkApi) => {
    try {
      const response = await GetDeliveredOrdersByBuyer(data.id, data.query);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

export const getOngoingByBuyerAction = createAsyncThunk(
  "orders/getOngoingByBuyer",
  async (data: IGetOrders, thunkApi) => {
    try {
      const response = await GetOngoingOrdersByBuyer(data.id, data.query);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

export const getOngoingBySellerAction = createAsyncThunk(
  "orders/getOngoingBySeller",
  async (data: IGetOrders, thunkApi) => {
    try {
      const response = await GetOngoingOrdersBySeller(data.id, data.query);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

export const getByIdAction = createAsyncThunk(
  "orders/getById",
  async (id: string, thunkApi) => {
    try {
      const response = await GetOrderById(id);
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
    clearAllOrders(state) {
      state.allOrders = [];
      state.page = 1;
      state.totalPages = 0;
      state.apiState = "COMPLETED";
    },
    clearBuyerDeliveredOrders(state) {
      state.buyerDeliveredOrders = [];
      state.page = 1;
      state.totalPages = 0;
      state.apiState = "COMPLETED";
    },
    clearBuyerOngoingOrders(state) {
      state.buyerOngoingOrders = [];
      state.page = 1;
      state.totalPages = 0;
      state.apiState = "COMPLETED";
    },
    clearSellerOngoingOrders(state) {
      state.sellerOngoingOrders = [];
      state.page = 1;
      state.totalPages = 0;
      state.apiState = "COMPLETED";
    },
    clearDetailedOrder(state) {
      state.detailedOrder = null;
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

    builder.addCase(getAllOrdersAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      getAllOrdersAction.fulfilled,
      (state, action: PayloadAction<IPagedOrders>) => {
        state.apiState = "COMPLETED";
        state.allOrders = [...action.payload.items];
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      }
    );
    builder.addCase(getAllOrdersAction.rejected, (state, action) => {
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

    builder.addCase(getDeliveredByBuyerAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      getDeliveredByBuyerAction.fulfilled,
      (state, action: PayloadAction<IPagedOrders>) => {
        state.apiState = "COMPLETED";
        state.buyerDeliveredOrders = [...action.payload.items];
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      }
    );
    builder.addCase(getDeliveredByBuyerAction.rejected, (state, action) => {
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

    builder.addCase(getOngoingByBuyerAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      getOngoingByBuyerAction.fulfilled,
      (state, action: PayloadAction<IPagedOrders>) => {
        state.apiState = "COMPLETED";
        state.buyerOngoingOrders = [...action.payload.items];
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      }
    );
    builder.addCase(getOngoingByBuyerAction.rejected, (state, action) => {
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

    builder.addCase(getOngoingBySellerAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      getOngoingBySellerAction.fulfilled,
      (state, action: PayloadAction<IPagedOrders>) => {
        state.apiState = "COMPLETED";
        state.sellerOngoingOrders = [...action.payload.items];
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      }
    );
    builder.addCase(getOngoingBySellerAction.rejected, (state, action) => {
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

    builder.addCase(getByIdAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      getByIdAction.fulfilled,
      (state, action: PayloadAction<IOrder>) => {
        state.apiState = "COMPLETED";
        state.detailedOrder = {...action.payload};
      }
    );
    builder.addCase(getByIdAction.rejected, (state, action) => {
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

export const {
  changePage,
  clearSellerDeliveredOrders,
  clearAllOrders,
  clearBuyerDeliveredOrders,
  clearBuyerOngoingOrders,
  clearSellerOngoingOrders,
  clearDetailedOrder
} = ordersSlice.actions;
export default ordersSlice.reducer;
