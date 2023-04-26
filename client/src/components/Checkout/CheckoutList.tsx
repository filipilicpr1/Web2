import React, { FC } from "react";
import {
  Grid,
  Card,
  Grow,
  TextField,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import CheckoutItem from "./CheckoutItem";
import CheckoutActions from "./CheckoutActions";
import { defaultCurrency } from "../../constants/Constants";

const CheckoutList: FC = () => {
  const items = useAppSelector((state) => state.cart.items);
  const cartTotal = useAppSelector((state) => state.cart.price);
  const content = items.map((item) => {
    return (
      <CheckoutItem
        key={item.id}
        id={item.id}
        item={item.item}
        amount={item.amount}
      />
    );
  });
  return (
    <>
      {items.length > 0 && (
        <Grow in={true}>
          <Card
            sx={{
              mt: 4,
              p: 4,
              borderRadius: "25px",
              width: "100%",
              backgroundColor: "#2d3436",
              backgroundImage:
                "linear-gradient(315deg, #2d3436 0%, #000000 74%)",
              boxShadow:
                "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
            }}
          >
            <Grid
              container
              sx={{ display: "flex", flexDirection: "column", width: "1000" }}
            >
              {content}
            </Grid>
            <Grid
              sx={{ display: "flex", flexDirection: "row-reverse", mr: 10 }}
            >
              <TextField
                id="price"
                name="price"
                disabled
                value={cartTotal + defaultCurrency}
                sx={{
                  backgroundColor: "#4d4855",
                  backgroundImage:
                    "linear-gradient(147deg, #4d4855 0%, #000000 74%)",
                  m: 1,
                }}
              />
              <Box
                sx={{
                  borderRadius: "5px",
                  border: "1px solid #AFAFAF",
                  width: "10%",
                  height: "55px",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  mt: 1,
                }}
              >
                <InputLabel sx={{ mt: 2 }} htmlFor={"price"}>
                  <Typography fontWeight={"bold"}>Total:</Typography>
                </InputLabel>
              </Box>
            </Grid>
            <CheckoutActions />
          </Card>
        </Grow>
      )}
    </>
  );
};

export default CheckoutList;
