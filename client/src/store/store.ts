import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import registerReducer from "./registerSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    register: registerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
