import React, { FC } from "react";
import StyledButton from "../UI/Styled/StyledButton";
import { Grid, Typography } from "@mui/material";
import { useAppDispatch } from "../../store/hooks";
import { clearCart } from "../../store/cartSlice";

const CheckoutActions: FC = () => {
  const dispatch = useAppDispatch();

  const clearHandler = () => {
    dispatch(clearCart());
  };

  return (
    <Grid container sx={{ display: "flex", flexDirection: "row", mt: 2 }}>
      <Grid item xs={6}>
        <StyledButton
          onClick={clearHandler}
          sx={{
            width: "70%",
            borderRadius: "25px",
            bgcolor: "#990000",
            backgroundImage: "linear-gradient(147deg, #990000 0%, #ff0000 74%)",
            ml: 11,
          }}
        >
          <Typography fontWeight={"bold"}>CLEAR CART</Typography>
        </StyledButton>
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <StyledButton
          onClick={() => {}}
          sx={{
            width: "70%",
            borderRadius: "25px",
            bgcolor: "#0cbaba",
            backgroundImage: "linear-gradient(315deg, #0cbaba 0%, #380036 74%)",
            mr: 11,
          }}
        >
          <Typography fontWeight={"bold"}>ORDER</Typography>
        </StyledButton>
      </Grid>
    </Grid>
  );
};

export default CheckoutActions;
