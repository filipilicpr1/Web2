import React, { FC, useState, useEffect } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  Zoom,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { minPasswordLength } from "../../constants/Constants";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { changePasswordAction } from "../../store/userSlice";
import { IChangePassword } from "../../shared/interfaces/userInterfaces";
import { useNavigate } from "react-router-dom";

const ChangePasswordForm: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const id = useAppSelector((state) => state.user.user?.id);
  const apiState = useAppSelector((state) => state.user.apiState);
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const [isNewPasswordValid, setIsNewPasswordValid] = useState<boolean>(false);
  const [isNewPasswordTouched, setIsNewPasswordTouched] =
    useState<boolean>(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] =
    useState<boolean>(false);
  const [isConfirmPasswordTouched, setIsConfirmPasswordTouched] =
    useState<boolean>(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

  const newPasswordChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsNewPasswordValid(
      event.target.value.trim().length >= minPasswordLength
    );
    setPasswordsMatch(true);
  };

  const newPasswordBlurHandler = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    setIsNewPasswordTouched(true);
  };

  const confirmPasswordChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsConfirmPasswordValid(
      event.target.value.trim().length >= minPasswordLength
    );
    setPasswordsMatch(true);
  };

  const confirmPasswordBlurHandler = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    setIsConfirmPasswordTouched(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const password = data.get("password");
    const newPassword = data.get("newPassword");
    const confirmPassword = data.get("confirmPassword");
    if (newPassword == null || password == null || confirmPassword == null) {
      return;
    }

    if (id === undefined) {
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsNewPasswordValid(false);
      setIsConfirmPasswordValid(false);
      setPasswordsMatch(false);
      return;
    }

    const changePasswordData: IChangePassword = {
      currentPassword: password.toString().trim(),
      newPassword: newPassword.toString().trim(),
    };

    dispatch(changePasswordAction({ id: id, data: changePasswordData }));
    setRequestSent(true);
  };

  useEffect(() => {
    if (!requestSent) {
      return;
    }

    if (!(apiState === "COMPLETED")) {
      return;
    }
    navigate("/profile");
  }, [apiState, navigate, requestSent]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Zoom in={true}>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "info.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Change Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              error={isNewPasswordTouched && !isNewPasswordValid}
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              autoComplete="new-password"
              onChange={newPasswordChangeHandler}
              onBlur={newPasswordBlurHandler}
              helperText={!passwordsMatch && "Passwords must match"}
            />
            <TextField
              margin="normal"
              required
              error={isConfirmPasswordTouched && !isConfirmPasswordValid}
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="confirm-password"
              onChange={confirmPasswordChangeHandler}
              onBlur={confirmPasswordBlurHandler}
              helperText={!passwordsMatch && "Passwords must match"}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={
                !isNewPasswordValid ||
                !isConfirmPasswordValid
              }
              sx={{ mt: 3, mb: 2 }}
            >
              Change Password
            </Button>
          </Box>
        </Box>
      </Zoom>
    </Container>
  );
};

export default ChangePasswordForm;
