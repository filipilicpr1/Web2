import React, { Suspense } from "react";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from '@mui/material/styles';
import theme from "./styles/theme";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <ThemeProvider theme={theme}>
        <AppRoutes />
        <ToastContainer theme="dark"/>
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
