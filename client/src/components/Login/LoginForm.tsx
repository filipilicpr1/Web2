import React, { FC, useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Zoom,
} from "@mui/material";
import { Link } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { emailRegex, minPasswordLength } from "../../constants/Constants";
import { IUserLogin } from "../../shared/interfaces/userInterfaces";
import { useAppDispatch } from "../../store/hooks";
import { loginAction, googleLoginAction } from "../../store/userSlice";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { defaultErrorMessage } from "../../constants/Constants";

const LoginForm: FC = () => {
  const dispatch = useAppDispatch();
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isEmailTouched, setIsEmailTouched] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState<boolean>(false);

  const emailChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEmailValid(emailRegex.test(event.target.value));
  };

  const emailBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsEmailTouched(true);
  };

  const passwordChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsPasswordValid(event.target.value.trim().length >= minPasswordLength);
  };

  const passwordBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsPasswordTouched(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    if (email == null || password == null) {
      return;
    }

    const userLogin: IUserLogin = {
      email: email.toString().trim(),
      password: password.toString().trim(),
    };

    dispatch(loginAction(userLogin));
  };

  const responseMessage = (response: any) => {
    dispatch(googleLoginAction({ token: response.credential }));
  };
  const errorMessage = () => {
    toast.error(defaultErrorMessage, {
      position: "top-center",
      autoClose: 2500,
      closeOnClick: true,
      pauseOnHover: false,
    });
  };

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
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              error={isEmailTouched && !isEmailValid}
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
            />
            <TextField
              margin="normal"
              required
              error={isPasswordTouched && !isPasswordValid}
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isEmailValid || !isPasswordValid}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container sx={{ justifyContent: "flex-end" }}>
              <Grid item sx={{ display: "flex", flexDirection: "column" }}>
                <Link to="/register">{"Don't have an account? Sign Up"}</Link>
                <Box sx={{ mt: 4, width: "100%" }}>
                  <GoogleLogin
                    onSuccess={responseMessage}
                    onError={errorMessage}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Zoom>
    </Container>
  );
};

export default LoginForm;
