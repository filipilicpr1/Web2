import React, { FC } from "react";
import { AppBar, Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Logo from "../components/UI/Logo/Logo";

const LoginLayout: FC = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Logo />
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
};

export default LoginLayout;
