import React, { FC } from "react";
import { useAppSelector } from "../store/hooks";
import LoadingModal from "../components/UI/Modal/LoadingModal";
import FinishRegistrationForm from "../components/FinishRegistration/FinishRegistrationForm";

const FinishRegistrationPage: FC = () => {
  const apiState = useAppSelector((state) => state.user.apiState);


  return (
    <>
      <FinishRegistrationForm />
      <LoadingModal show={apiState === "PENDING"} />
    </>
  );
};

export default FinishRegistrationPage;
