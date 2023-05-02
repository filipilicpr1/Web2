import React, { FC, useEffect } from "react";
import ProfileForm from "../components/Profile/ProfileForm";
import { Container, CssBaseline } from "@mui/material";
import PageTitle from "../components/UI/Title/PageTitle";
import LoadingModal from "../components/UI/Modal/LoadingModal";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { getUserByIdAction } from "../store/userSlice";

const ProfilePage: FC = () => {
  const dispatch = useAppDispatch();
  const apiState = useAppSelector((state) => state.user.apiState);
  const user = useAppSelector((state) => state.user.user);
  const id = user !== null ? user.id : "";
  const status = user !== null ? user.verificationStatus : "";

  useEffect(() => {
    if (status !== "PENDING") {
      return;
    }

    dispatch(getUserByIdAction(id));
  }, [dispatch, id, status]);

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
