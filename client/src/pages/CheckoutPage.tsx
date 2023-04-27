import React, { FC } from "react";
import CheckoutList from "../components/Checkout/CheckoutList";
import PageTitle from "../components/UI/Title/PageTitle";
import { Container, CssBaseline } from "@mui/material";
import { useAppSelector } from "../store/hooks";
import LoadingModal from "../components/UI/Modal/LoadingModal";

const CheckoutPage: FC = () => {
  const apiState = useAppSelector((state) => state.orders.apiState);
  return (
    <>
      <Container component="main">
        <CssBaseline />
        <PageTitle title="Checkout" />
        <CheckoutList />
      </Container>
      <LoadingModal show={apiState === "PENDING"} />
    </>
  );
};

export default CheckoutPage;
