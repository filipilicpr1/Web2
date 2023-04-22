import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Login, GetUserById, UpdateUser, ChangePassword, Register, LoginGoogle } from "../services/UserService";
import { IUser, IUserLogin, IAuth, IUserUpdate, IChangePassword, IUserRegister } from "../shared/interfaces/userInterfaces";
import { toast } from "react-toastify";
import { ApiCallState } from "../shared/types/enumerations";
import { defaultErrorMessage } from "../constants/Constants";

export interface UserState {
  token: string | null;
  isLoggedIn: boolean;
  user: IUser | null;
  apiState: ApiCallState;
}

const initialState: UserState = {
  token: localStorage.getItem("token"),
  isLoggedIn: localStorage.getItem("token") != null,
  user: JSON.parse(localStorage.getItem("user") || "{}"),
  apiState: "COMPLETED",
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

export const getUserByIdAction = createAsyncThunk(
  "user/get",
  async (id: string, thunkApi) => {
    try {
      const response = await GetUserById(id);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

export const updateUserAction = createAsyncThunk(
  "user/update",
  async (data: IUserUpdate , thunkApi) => {
    try {
      const response = await UpdateUser(data.id, data.data);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

export const registerUserAction = createAsyncThunk(
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

interface IChangePasswordAction {
  id: string,
  data: IChangePassword
}

export const changePasswordAction = createAsyncThunk(
  "user/changePassword",
  async (data: IChangePasswordAction , thunkApi) => {
    try {
      const response = await ChangePassword(data.id, data.data);
      return thunkApi.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

export const googleLoginAction = createAsyncThunk(
  "user/googleLogin",
  async (data: IAuth , thunkApi) => {
    try {
      const response = await LoginGoogle(data);
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
    logout(state) {
      state.token = null;
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      loginAction.fulfilled,
      (state, action: PayloadAction<IAuth>) => {
        state.apiState = "COMPLETED";
        const token = action.payload.token;
        state.token = token;
        state.isLoggedIn = true;
        localStorage.setItem("token", token);
      }
    );
    builder.addCase(loginAction.rejected, (state, action) => {
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

    builder.addCase(getUserByIdAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      getUserByIdAction.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.apiState = "COMPLETED";
        state.user = {...action.payload};
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    );
    builder.addCase(getUserByIdAction.rejected, (state, action) => {
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

    builder.addCase(updateUserAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      updateUserAction.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.apiState = "COMPLETED";
        state.user = {...action.payload};
        localStorage.setItem('user', JSON.stringify(action.payload));

        toast.success("Your info has been updated", {
          position: "top-center",
          autoClose: 2500,
          closeOnClick: true,
          pauseOnHover: false,
        });
      }
    );
    builder.addCase(updateUserAction.rejected, (state, action) => {
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

    builder.addCase(changePasswordAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      changePasswordAction.fulfilled,
      (state) => {
        state.apiState = "COMPLETED";

        toast.success("Password changed", {
          position: "top-center",
          autoClose: 2500,
          closeOnClick: true,
          pauseOnHover: false,
        });
      }
    );
    builder.addCase(changePasswordAction.rejected, (state, action) => {
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

    builder.addCase(registerUserAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      registerUserAction.fulfilled,
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
    builder.addCase(registerUserAction.rejected, (state, action) => {
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

    builder.addCase(googleLoginAction.pending, (state) => {
      state.apiState = "PENDING";
    });
    builder.addCase(
      googleLoginAction.fulfilled,
      (state, action: PayloadAction<IAuth>) => {
        state.apiState = "COMPLETED";
        const token = action.payload.token;
        state.token = token;
        state.isLoggedIn = true;
        localStorage.setItem("token", token);
      }
    );
    builder.addCase(googleLoginAction.rejected, (state, action) => {
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

export const { receivedToken, logout } = userSlice.actions;
export default userSlice.reducer;
