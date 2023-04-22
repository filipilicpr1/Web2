import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}>
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
);
