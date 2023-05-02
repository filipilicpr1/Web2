import React, { FC } from "react";
import LoginForm from "../components/Login/LoginForm";
import { useAppSelector } from "../store/hooks";
import LoadingModal from "../components/UI/Modal/LoadingModal";

const LoginPage: FC = (props) => {
  const apiState = useAppSelector((state) => state.user.apiState);

  return (
    <>
      <LoginForm />
      <LoadingModal show={apiState === "PENDING"} />
    </>
  );
};

export default LoginPage;
