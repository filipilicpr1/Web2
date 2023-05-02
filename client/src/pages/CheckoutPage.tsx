import React, { FC } from "react";
import CheckoutList from "../components/Checkout/CheckoutList";
import PageTitle from "../components/UI/Title/PageTitle";
import { Container, CssBaseline } from "@mui/material";
import { useAppSelector } from "../store/hooks";
import LoadingModal from "../components/UI/Modal/LoadingModal";

const CheckoutPage: FC = () => {
  const apiState = useAppSelector((state) => state.orders.apiState);
  const cartItems = useAppSelector((state) => state.cart.items);
  const pageTitle = cartItems.length > 0 ? "Checkout" : "YOUR CART IS EMPTY";
  return (
    <>
      <Container component="main">
        <CssBaseline />
        <PageTitle title={pageTitle} />
        <CheckoutList />
      </Container>
      <LoadingModal show={apiState === "PENDING"} />
    </>
  );
};

export default CheckoutPage;
