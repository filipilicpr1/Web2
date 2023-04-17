import React, { FC } from "react";
import LoginForm from "../components/Login/LoginForm";
import { useAppSelector } from "../store/hooks";
import { Commet } from "react-loading-indicators";
import { Modal, Box } from "@mui/material";

const LoginPage: FC = (props) => {
  const apiState = useAppSelector((state) => state.user.apiState);

  return (
    <>
      <LoginForm />
      <Modal open={apiState === "PENDING"}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 165,
            p: 4,
            alignItems: "center"
          }}
        >
          <Commet color="#ffffff" size="large" />
        </Box>
      </Modal>
    </>
  );
};

export default LoginPage;
