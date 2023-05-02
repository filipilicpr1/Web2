import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllSellers, GetVerifiedSellers } from "../services/UserService";
import { toast } from "react-toastify";
import { ApiCallState } from "../shared/types/enumerations";
import { defaultErrorMessage } from "../constants/Constants";
import { IUser } from "../shared/interfaces/userInterfaces";

export interface VerificationState {
  allSellers: IUser[];
  verifiedSellers: IUser[];
  page: number;
  totalPages: number;
  apiState: ApiCallState;
}

const initialState: VerificationState = {
  allSellers: [],
  verifiedSellers: [],
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
  },
});

export const { changePage, clearAllSellers, clearVerifiedSellers } =
  verificationSlice.actions;
export default verificationSlice.reducer;
