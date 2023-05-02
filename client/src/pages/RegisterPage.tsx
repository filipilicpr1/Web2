import React, { FC } from "react";
import RegisterForm from "../components/Register/RegisterForm";
import LoadingModal from "../components/UI/Modal/LoadingModal";
import { useAppSelector } from "../store/hooks";

const RegisterPage: FC = () => {
  const apiState = useAppSelector((state) => state.user.apiState);
  return (
    <>
      <RegisterForm />
      <LoadingModal show={apiState === "PENDING"} />
    </>
  );
};

export default RegisterPage;
