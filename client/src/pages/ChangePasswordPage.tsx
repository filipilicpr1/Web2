import React, { FC } from "react";
import ChangePasswordForm from "../components/ChangePassword/ChangePasswordForm";
import { useAppSelector } from "../store/hooks";
import LoadingModal from "../components/UI/Modal/LoadingModal";

const ChangePasswordPage: FC = () => {
  const apiState = useAppSelector((state) => state.user.apiState);
  return (
    <>
      <ChangePasswordForm />
      <LoadingModal show={apiState === "PENDING"} />
    </>
  );
};

export default ChangePasswordPage;
