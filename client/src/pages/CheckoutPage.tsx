import React, { FC } from "react";
import CheckoutList from "../components/Checkout/CheckoutList";
import CheckoutTitle from "../components/Checkout/CheckoutTitle";
import { Container, CssBaseline } from "@mui/material";

const CheckoutPage: FC = () => {
  return (
    <>
      <Container component="main">
        <CssBaseline />
        <CheckoutTitle />
        <CheckoutList />
      </Container>
    </>
  );
};

export default CheckoutPage;
