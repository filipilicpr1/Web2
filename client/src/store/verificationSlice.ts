import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetAllSellers,
  GetVerifiedSellers,
  GetUserById,
  VerifySeller,
} from "../services/UserService";
import { toast } from "react-toastify";
import { ApiCallState } from "../shared/types/enumerations";
import { defaultErrorMessage } from "../constants/Constants";
import { IUser, IVerifySeller } from "../shared/interfaces/userInterfaces";

export interface VerificationState {
  allSellers: IUser[];
  verifiedSellers: IUser[];
  detailedSeller: IUser | null;
  page: number;
  totalPages: number;
  apiState: ApiCallState;
}

const initialState: VerificationState = {
  allSellers: [],
  verifiedSellers: [],
  detailedSeller: null,
  page: 1,
  totalPages: 0,
  apiState: "COMPLETED",
};

interface IPagedUsers {
  items: IUser[];
  page: number;
  totalPages: number;
}

export const getAllSellersAction = createAsyncThunk(
  "verification/getAllSellers",
  async (query: string, thunkApi) => {
    try {
      const response = await GetAllSellers(query);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

export const getVerifiedSellersAction = createAsyncThunk(
  "verification/getVerifiedSellers",
  async (query: string, thunkApi) => {
    try {
      const response = await GetVerifiedSellers(query);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

export const getByIdAction = createAsyncThunk(
  "verification/getById",
  async (id: string, thunkApi) => {
    try {
      const response = await GetUserById(id);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

interface IVerify {
  id: string;
  data: IVerifySeller;
}

export const verifySellerAction = createAsyncThunk(
  "verification/verify",
  async (data: IVerify, thunkApi) => {
    try {
      const response = await VerifySeller(data.id, data.data);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

const verificationSlice = createSlice({
  name: "verification",
  initialState,
  reducers: {
    changePage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    clearAllSellers(state) {
      state.allSellers = [];
      state.page = 1;
      state.totalPages = 0;
      state.apiState = "COMPLETED";
    },
    clearVerifiedSellers(state) {
      state.verifiedSellers = [];
      state.page = 1;
      state.totalPages = 0;
      state.apiState = "COMPLETED";
    },
    clearDetailedSeller(state) {
      state.detailedSeller = null;
      state.apiState = "COMPLETED";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllSellersAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      getAllSellersAction.fulfilled,
      (state, action: PayloadAction<IPagedUsers>) => {
        state.apiState = "COMPLETED";
        state.allSellers = [...action.payload.items];
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      }
    );
    builder.addCase(getAllSellersAction.rejected, (state, action) => {
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

    builder.addCase(getVerifiedSellersAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      getVerifiedSellersAction.fulfilled,
      (state, action: PayloadAction<IPagedUsers>) => {
        state.apiState = "COMPLETED";
        state.verifiedSellers = [...action.payload.items];
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      }
    );
    builder.addCase(getVerifiedSellersAction.rejected, (state, action) => {
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
      (state, action: PayloadAction<IUser>) => {
        state.apiState = "COMPLETED";
        state.detailedSeller = { ...action.payload };
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

    builder.addCase(verifySellerAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      verifySellerAction.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.apiState = "COMPLETED";
        state.detailedSeller = { ...action.payload };

        toast.success(
          "Seller has been successfully " +
            action.payload.verificationStatus.toLowerCase(),
          {
            position: "top-center",
            autoClose: 2500,
            closeOnClick: true,
            pauseOnHover: false,
          }
        );
      }
    );
    builder.addCase(verifySellerAction.rejected, (state, action) => {
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
  clearAllSellers,
  clearVerifiedSellers,
  clearDetailedSeller,
} = verificationSlice.actions;
export default verificationSlice.reducer;
