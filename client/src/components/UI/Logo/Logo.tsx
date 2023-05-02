import React, { FC } from "react";
import { Typography, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";

const Logo: FC = () => {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const user = useAppSelector((state) => state.user.user);
  const userIsBuyer = user && user.userType === "BUYER";
  const cartAmount = useAppSelector((state) => state.cart.amount);
  const navigate = useNavigate();

  const clickHandler = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    
    if(userIsBuyer)
    {
      navigate("/checkout");
      return;
    }

    navigate("/");
  };

  return (
    <>
      <Badge badgeContent={cartAmount} color="primary">
        <ShoppingCartIcon onClick={clickHandler} sx={{ cursor: "pointer" }} />
      </Badge>
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1, cursor: "default", m: 1.5, ml: 2 }}
      >
        Web Shop
      </Typography>
    </>
  );
};

export default Logo;
