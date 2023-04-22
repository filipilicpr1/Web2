import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Register } from "../services/UserService";
import {  IUserRegister } from "../shared/interfaces/userInterfaces";
import { toast } from "react-toastify";
import { ApiCallState } from "../shared/types/enumerations";
import { defaultErrorMessage } from "../constants/Constants";

export interface RegisterState {
  apiState: ApiCallState;
}

const initialState: RegisterState = {
  apiState: "COMPLETED",
};

export const registerAction = createAsyncThunk(
  "register/default",
  async (data: IUserRegister, thunkApi) => {
    try {
      const response = await Register(data);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
        registerAction.fulfilled,
      (state) => {
        state.apiState = "COMPLETED";
        toast.success("You have registered successfully. Try signing in.", {
            position: "top-center",
            autoClose: 2500,
            closeOnClick: true,
            pauseOnHover: false,
          });
      }
    );
    builder.addCase(registerAction.rejected, (state, action) => {
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

export default registerSlice.reducer;
