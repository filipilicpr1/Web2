import React, { FC } from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Outlet, useNavigate } from "react-router-dom";

const LoginLayout: FC = () => {
  const navigate = useNavigate();

  const clickHandler = () => {
    navigate("/");
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <ShoppingCartIcon
              onClick={clickHandler}
              sx={{ cursor: "pointer" }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, cursor: "default", m: 1.5 }}
            >
              Web Shop
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
};

export default LoginLayout;
