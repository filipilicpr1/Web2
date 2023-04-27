import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  AddProduct,
  GetAllProducts,
  GetAllProductsBySeller,
  DeleteProduct,
  GetProductById,
  UpdateProduct,
} from "../services/ProductsService";
import { toast } from "react-toastify";
import { ApiCallState } from "../shared/types/enumerations";
import { defaultErrorMessage } from "../constants/Constants";
import { IProduct } from "../shared/interfaces/productsInterfaces";

export interface ProductsState {
  products: IProduct[];
  sellerProducts: IProduct[];
  editProduct: IProduct | null;
  page: number;
  totalPages: number;
  apiState: ApiCallState;
}

const initialState: ProductsState = {
  products: [],
  sellerProducts: [],
  editProduct: null,
  page: 1,
  totalPages: 0,
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

interface IPagedProducts {
  items: IProduct[];
  page: number;
  totalPages: number;
}

export const getAllProductsAction = createAsyncThunk(
  "products/getAll",
  async (query: string, thunkApi) => {
    try {
      const response = await GetAllProducts(query);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

interface IGetBySeller {
  id: string;
  query: string;
}

export const getAllProductsBySellerAction = createAsyncThunk(
  "products/getAllBySeller",
  async (data: IGetBySeller, thunkApi) => {
    try {
      const response = await GetAllProductsBySeller(data.id, data.query);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteProductAction = createAsyncThunk(
  "products/delete",
  async (id: string, thunkApi) => {
    try {
      const response = await DeleteProduct(id);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

export const getProductByIdAction = createAsyncThunk(
  "products/getById",
  async (id: string, thunkApi) => {
    try {
      const response = await GetProductById(id);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

interface IUpdateProduct {
  id: string;
  data: FormData;
}

export const updateProductAction = createAsyncThunk(
  "products/update",
  async (data: IUpdateProduct, thunkApi) => {
    try {
      const response = await UpdateProduct(data.id, data.data);
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
    changePage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    clearProducts(state) {
      state.products = [];
      state.page = 1;
      state.totalPages = 0;
      state.apiState = "COMPLETED";
    },
    clearSellerProducts(state) {
      state.sellerProducts = [];
      state.page = 1;
      state.totalPages = 0;
      state.apiState = "COMPLETED";
    },
    clearEditProduct(state) {
      state.editProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addProductAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(addProductAction.fulfilled, (state) => {
      state.apiState = "COMPLETED";

      toast.success("Product successfully added", {
        position: "top-center",
        autoClose: 2500,
        closeOnClick: true,
        pauseOnHover: false,
      });
    });
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

    builder.addCase(getAllProductsAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      getAllProductsAction.fulfilled,
      (state, action: PayloadAction<IPagedProducts>) => {
        state.apiState = "COMPLETED";
        state.products = [...action.payload.items];
        state.sellerProducts = [];
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      }
    );
    builder.addCase(getAllProductsAction.rejected, (state, action) => {
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

    builder.addCase(getAllProductsBySellerAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      getAllProductsBySellerAction.fulfilled,
      (state, action: PayloadAction<IPagedProducts>) => {
        state.apiState = "COMPLETED";
        state.sellerProducts = [...action.payload.items];
        state.products = [];
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      }
    );
    builder.addCase(getAllProductsBySellerAction.rejected, (state, action) => {
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

    builder.addCase(deleteProductAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(deleteProductAction.fulfilled, (state) => {
      state.apiState = "COMPLETED";

      toast.success("Product has been deleted", {
        position: "top-center",
        autoClose: 2500,
        closeOnClick: true,
        pauseOnHover: false,
      });
    });
    builder.addCase(deleteProductAction.rejected, (state, action) => {
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

    builder.addCase(getProductByIdAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      getProductByIdAction.fulfilled,
      (state, action: PayloadAction<IProduct>) => {
        state.apiState = "COMPLETED";
        state.editProduct = { ...action.payload };
      }
    );
    builder.addCase(getProductByIdAction.rejected, (state, action) => {
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

    builder.addCase(updateProductAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      updateProductAction.fulfilled,
      (state, action: PayloadAction<IProduct>) => {
        state.apiState = "COMPLETED";
        state.editProduct = { ...action.payload };

        toast.success("Product has been updated", {
          position: "top-center",
          autoClose: 2500,
          closeOnClick: true,
          pauseOnHover: false,
        });
      }
    );
    builder.addCase(updateProductAction.rejected, (state, action) => {
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
  clearProducts,
  clearEditProduct,
  clearSellerProducts,
} = productsSlice.actions;
export default productsSlice.reducer;
