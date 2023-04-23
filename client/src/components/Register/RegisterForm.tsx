import React, { FC, useState, useEffect } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  MenuItem,
  Box,
  Typography,
  Container,
  Zoom,
} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { emailRegex, minPasswordLength } from "../../constants/Constants";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { registerUserTypes } from "../../constants/Constants";
import { IUserRegister } from "../../shared/interfaces/userInterfaces";
import { UserType } from "../../shared/types/enumerations";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUserAction } from "../../store/userSlice";
import { useNavigate, Link } from "react-router-dom";

const RegisterForm: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const apiState = useAppSelector((state) => state.user.apiState);
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const [isNameValid, setIsNameValid] = useState<boolean>(false);
  const [isNameTouched, setIsNameTouched] = useState<boolean>(false);
  const [isLastNameValid, setIsLastNameValid] = useState<boolean>(false);
  const [isLastNameTouched, setIsLastNameTouched] = useState<boolean>(false);
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false);
  const [isUsernameTouched, setIsUsernameTouched] = useState<boolean>(false);
  const [isAddressValid, setIsAddressValid] = useState<boolean>(false);
  const [isAddressTouched, setIsAddressTouched] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>("");
  const [isUserTypeValid, setIsUserTypeValid] = useState<boolean>(false);
  const [isUserTypeTouched, setIsUserTypeTouched] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isEmailTouched, setIsEmailTouched] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState<boolean>(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] =
    useState<boolean>(false);
  const [isConfirmPasswordTouched, setIsConfirmPasswordTouched] =
    useState<boolean>(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const [date, setDate] = useState<Date | null>(null);
  const [isDateValid, setIsDateValid] = useState<boolean>(false);
  const [isDateTouched, setIsDateTouched] = useState<boolean>(false);
  const dateBorder = isDateTouched && !isDateValid ? "2px solid red" : "";

  const dateChangeHandler = (value: Date | null) => {
    setDate(value);
    setIsDateTouched(true);
    setIsDateValid(value ? value < new Date() : false);
  };

  const userTypeChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUserType(event.target.value);
    setIsUserTypeValid(event.target.value !== "");
  };

  const userTypeBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsUserTypeTouched(true);
  };

  const nameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsNameValid(event.target.value.trim().length > 0);
  };

  const nameBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsNameTouched(true);
  };

  const lastNameChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsLastNameValid(event.target.value.trim().length > 0);
  };

  const lastNameBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsLastNameTouched(true);
  };

  const usernameChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsUsernameValid(event.target.value.trim().length > 0);
  };

  const usernameBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsUsernameTouched(true);
  };

  const addressChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAddressValid(event.target.value.trim().length > 0);
  };

  const addressBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsAddressTouched(true);
  };

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
    setPasswordsMatch(true);
  };

  const passwordBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsPasswordTouched(true);
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
    const email = data.get("email");
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");
    const username = data.get("username");
    const name = data.get("name");
    const lastName = data.get("lastName");
    const address = data.get("address");
    const userType = data.get("userType");
    if (
      email == null ||
      password == null ||
      confirmPassword == null ||
      username == null ||
      name == null ||
      lastName == null ||
      address == null ||
      userType == null ||
      date == null
    ) {
      return;
    }

    if (password !== confirmPassword) {
      setIsPasswordValid(false);
      setIsConfirmPasswordValid(false);
      setPasswordsMatch(false);
      return;
    }

    date.setHours(12);

    const registerUser: IUserRegister = {
      email: email.toString().trim(),
      password: password.toString().trim(),
      username: username.toString().trim(),
      name: name.toString().trim(),
      lastName: lastName.toString().trim(),
      address: address.toString().trim(),
      userType: userType.toString().trim() as UserType,
      birthDate: date
    };

    dispatch(registerUserAction(registerUser));
    setRequestSent(true);
  };

  useEffect(() => {
    if (!requestSent) {
      return;
    }

    if (!(apiState === "COMPLETED")) {
      return;
    }
    navigate("/login");
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
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
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
            <TextField
              margin="normal"
              required
              error={isUsernameTouched && !isUsernameValid}
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              onChange={usernameChangeHandler}
              onBlur={usernameBlurHandler}
            />
            <TextField
              margin="normal"
              required
              error={isNameTouched && !isNameValid}
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              onChange={nameChangeHandler}
              onBlur={nameBlurHandler}
            />
            <TextField
              margin="normal"
              required
              error={isLastNameTouched && !isLastNameValid}
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="lastName"
              onChange={lastNameChangeHandler}
              onBlur={lastNameBlurHandler}
            />
            <TextField
              margin="normal"
              required
              error={isAddressTouched && !isAddressValid}
              fullWidth
              id="address"
              label="Address"
              name="address"
              autoComplete="address"
              onChange={addressChangeHandler}
              onBlur={addressBlurHandler}
            />
              <DesktopDatePicker
                format="dd/MM/yyyy"
                label="Birth Date*"
                sx={{ mt: 2, mb: 1, width: "100%", border: dateBorder }}
                onChange={(newValue) => dateChangeHandler(newValue as Date)}
              />
            <TextField
              id="userType"
              name="userType"
              required
              error={isUserTypeTouched && !isUserTypeValid}
              select
              label="User Type"
              value={userType}
              onChange={userTypeChangeHandler}
              onBlur={userTypeBlurHandler}
              sx={{ width: "100%", mt: 2 }}
            >
              {registerUserTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={
                !isEmailValid ||
                !isPasswordValid ||
                !isConfirmPasswordValid ||
                !isUsernameValid ||
                !isNameValid ||
                !isLastNameValid ||
                !isAddressValid ||
                !isUserTypeValid ||
                !isDateValid
              }
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end", mb: 2}}>
            <Link to="/login">{"Back to login"}</Link>
            </Box>
          </Box>
        </Box>
      </Zoom>
    </Container>
  );
};

export default RegisterForm;
