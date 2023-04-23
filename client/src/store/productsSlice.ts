import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AddProduct } from "../services/ProductsService";
import { toast } from "react-toastify";
import { ApiCallState } from "../shared/types/enumerations";
import { defaultErrorMessage } from "../constants/Constants";

export interface ProductsState {
  apiState: ApiCallState;
}

const initialState: ProductsState = {
  apiState: "COMPLETED",
};

export const addProductAction = createAsyncThunk(
  "products/add",
  async (newProduct: FormData, thunkApi) => {
    try {
      const response = await AddProduct(newProduct);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
  
      builder.addCase(addProductAction.pending, (state) => {
        state.apiState = "PENDING";
      });
      builder.addCase(
        addProductAction.fulfilled,
        (state) => {
          state.apiState = "COMPLETED";
  
          toast.success("Product successfully added", {
            position: "top-center",
            autoClose: 2500,
            closeOnClick: true,
            pauseOnHover: false,
          });
        }
      );
      builder.addCase(addProductAction.rejected, (state, action) => {
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

  export default productsSlice.reducer;