import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { IUser } from "../shared/interfaces/userInterfaces";
import { Login } from "../services/UserService";
import { IUserLogin } from "../shared/interfaces/userInterfaces";
import {toast} from "react-toastify";
import { ApiCallState } from "../shared/types/enumerations";

export interface UserState {
  token: string | null,
  isLoggedIn: boolean,
  user: IUser | null,
  apiState: ApiCallState
}

const initialState: UserState = {
  token: localStorage.getItem("token"),
  isLoggedIn: localStorage.getItem("token") != null,
  user: JSON.parse(localStorage.getItem("user") || "{}"),
  apiState: "COMPLETED"
};

export const loginAction = createAsyncThunk(
  "user/login",
  async (user: IUserLogin, thunkApi) => {
    try {
      const response = await Login(user);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    receivedToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("token", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAction.pending, (state) => {
        state.apiState = "PENDING";
    });
    builder.addCase(
      loginAction.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.apiState = "COMPLETED";
        const token = action.payload.token;
        state.token = token;
        state.isLoggedIn = true;
        localStorage.setItem("token", token);
      }
    );
    builder.addCase(loginAction.rejected, (state, action) => {
        state.apiState = "COMPLETED";
        let error: string = "";
        if(typeof action.payload === "string")
        {
            error = action.payload;
        }
        toast.error(error, {
            position: "top-center",
            autoClose: 2500,
            closeOnClick: true,
            pauseOnHover: false
          });
    });
  },
});

export const { receivedToken } = userSlice.actions;
export default userSlice.reducer;
