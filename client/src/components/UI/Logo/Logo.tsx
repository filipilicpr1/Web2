import React, { FC } from "react";
import { Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

const Logo: FC = () => {
  const navigate = useNavigate();

  const clickHandler = () => {
    navigate("/");
  };

  return (
    <>
      <ShoppingCartIcon onClick={clickHandler} sx={{ cursor: "pointer" }} />
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1, cursor: "default", m: 1.5 }}
      >
        Web Shop
      </Typography>
    </>
  );
};

export default Logo;
