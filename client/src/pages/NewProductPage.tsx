import React, { FC } from "react";
import NewProductForm from "../components/NewProduct/NewProductForm";
import { useAppSelector } from "../store/hooks";
import LoadingModal from "../components/UI/Modal/LoadingModal";

const NewProductPage: FC = () => {
  const apiState = useAppSelector((state) => state.products.apiState);
  return (
    <>
      <NewProductForm />
      <LoadingModal show={apiState === "PENDING"} />
    </>
  );
};

export default NewProductPage;
