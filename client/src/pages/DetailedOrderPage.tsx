import React, { FC, useEffect } from "react";
import { Container, CssBaseline } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import LoadingModal from "../components/UI/Modal/LoadingModal";
import PageTitle from "../components/UI/Title/PageTitle";
import { getByIdAction, clearDetailedOrder } from "../store/ordersSlice";
import { useParams } from "react-router-dom";
import DetailedOrder from "../components/DetailedOrder/DetailedOrder";

const DetailedOrderPage: FC = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const id = params.orderId || "";
  const order = useAppSelector((state) => state.orders.detailedOrder);

  const apiState = useAppSelector((state) => state.orders.apiState);

  useEffect(() => {
    dispatch(getByIdAction(id));
  }, [dispatch, id]);

  useEffect(() => {
    return () => {
      dispatch(clearDetailedOrder());
    };
  }, [dispatch]);

  return (
    <>
      <Container component="main">
        <CssBaseline />
        {order !== null && <PageTitle title="Order Details" />}
        <DetailedOrder />
      </Container>
      <LoadingModal show={apiState === "PENDING"} />
    </>
  );
};

export default DetailedOrderPage;
