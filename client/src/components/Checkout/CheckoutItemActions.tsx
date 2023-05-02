import React, { FC } from "react";
import { Grid, Box, Typography, TextField } from "@mui/material";
import StyledButton from "../UI/Styled/StyledButton";
import { IProduct } from "../../shared/interfaces/productsInterfaces";
import { defaultCurrency } from "../../constants/Constants";
import { useAppDispatch } from "../../store/hooks";
import { increase, decrease, removeItem } from "../../store/cartSlice";

interface IProps {
  item: IProduct;
  amount: number;
}

const CheckoutItemActions: FC<IProps> = (props) => {
  const dispatch = useAppDispatch();

  const increaseHandler = () => {
    dispatch(increase(props.item));
  }

  const decreaseHandler = () => {
    dispatch(decrease(props.item));
  }

  const removeItemHandler = () => {
    dispatch(removeItem(props.item));
  }

  return (
    <Grid item xs={5} sx={{ display: "flex", flexDirection: "column" }}>
      <Grid sx={{ display: "flex", flexDirection: "row", mt: 2 }}>
        <Box sx={{ width: "150px" }}>
          <TextField
            name="amount"
            disabled
            value={props.amount}
            sx={{
              backgroundColor: "#4d4855",
              backgroundImage:
                "linear-gradient(147deg, #4d4855 0%, #000000 74%)",
              m: 1,
              ml: 4,
              widht: "80%",
            }}
          />
        </Box>
        <TextField
          name="price"
          disabled
          value={props.amount * props.item.price + defaultCurrency}
          sx={{
            backgroundColor: "#4d4855",
            backgroundImage: "linear-gradient(147deg, #4d4855 0%, #000000 74%)",
            m: 1,
          }}
        />
      </Grid>
      <Grid sx={{ mt: 2 }}>
        <StyledButton
          onClick={decreaseHandler}
          sx={{
            width: "40%",
            borderRadius: "25px",
            bgcolor: "#a40606",
            backgroundImage: "linear-gradient(315deg, #a40606 0%, #d98324 74%)",
            ml: 4,
          }}
        >
          <Typography variant="h5" fontWeight={"bold"}>
            -
          </Typography>
        </StyledButton>
        <StyledButton
          onClick={increaseHandler}
          sx={{
            width: "40%",
            borderRadius: "25px",
            bgcolor: "#015d00",
            backgroundImage: "linear-gradient(314deg, #015d00 0%, #04bf00 74%)",
            ml: 2,
          }}
        >
          <Typography variant="h5">+</Typography>
        </StyledButton>
      </Grid>
      <StyledButton
        onClick={removeItemHandler}
        sx={{
          width: "85%",
          borderRadius: "25px",
          bgcolor: "#990000",
          backgroundImage: "linear-gradient(147deg, #990000 0%, #ff0000 74%)",
          ml: 4,
          mt: 2,
        }}
      >
        REMOVE
      </StyledButton>
    </Grid>
  );
};

export default CheckoutItemActions;
