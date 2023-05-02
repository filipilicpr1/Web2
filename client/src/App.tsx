import React, { Suspense } from "react";
import SuspenseFallback from "./components/Suspense/SuspenseFallback";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function App() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <AppRoutes />
          <ToastContainer theme="dark" />
        </ThemeProvider>
      </LocalizationProvider>
    </Suspense>
  );
}

export default App;
