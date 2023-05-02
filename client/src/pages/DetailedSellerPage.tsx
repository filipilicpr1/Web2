import React, { FC, useEffect } from "react";
import { Container, CssBaseline } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import LoadingModal from "../components/UI/Modal/LoadingModal";
import PageTitle from "../components/UI/Title/PageTitle";
import { getByIdAction, clearDetailedSeller } from "../store/verificationSlice";
import { useParams } from "react-router-dom";
import DetailedSeller from "../components/DetailedSeller/DetailedSeller";

const DetailedSellerPage: FC = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const id = params.sellerId || "";
  const seller = useAppSelector((state) => state.verification.detailedSeller);

  const apiState = useAppSelector((state) => state.verification.apiState);

  useEffect(() => {
    dispatch(getByIdAction(id));
  }, [dispatch, id]);

  useEffect(() => {
    return () => {
      dispatch(clearDetailedSeller());
    };
  }, [dispatch]);

  return (
    <>
      <Container component="main">
        <CssBaseline />
        {seller !== null && <PageTitle title="Seller Details" />}
        <DetailedSeller />
      </Container>
      <LoadingModal show={apiState === "PENDING"} />
    </>
  );
};

export default DetailedSellerPage;
