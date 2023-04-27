import React, { FC } from "react";
import ProfileForm from "../components/Profile/ProfileForm";
import { Container, CssBaseline } from "@mui/material";
import PageTitle from "../components/UI/Title/PageTitle";
import LoadingModal from "../components/UI/Modal/LoadingModal";
import { useAppSelector } from "../store/hooks";

const ProfilePage: FC = () => {
  const apiState = useAppSelector((state) => state.user.apiState);
  return (
    <>
      <Container component="main">
        <CssBaseline />
        <PageTitle title="My Profile" />
        <ProfileForm />
      </Container>
      <LoadingModal show={apiState === "PENDING"} />
    </>
  );
};

export default ProfilePage;
