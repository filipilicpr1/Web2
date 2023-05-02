import React, { FC, useState } from "react";
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
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { minPasswordLength } from "../../constants/Constants";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { registerUserTypes } from "../../constants/Constants";
import { IFinishRegistration } from "../../shared/interfaces/userInterfaces";
import { UserType } from "../../shared/types/enumerations";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { finishRegistrationAction } from "../../store/userSlice";

const FinishRegistrationForm: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const id = user?.id || "";
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false);
  const [isUsernameTouched, setIsUsernameTouched] = useState<boolean>(false);
  const [isAddressValid, setIsAddressValid] = useState<boolean>(false);
  const [isAddressTouched, setIsAddressTouched] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>("");
  const [isUserTypeValid, setIsUserTypeValid] = useState<boolean>(false);
  const [isUserTypeTouched, setIsUserTypeTouched] = useState<boolean>(false);
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
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");
    const username = data.get("username");
    const address = data.get("address");
    const userType = data.get("userType");
    if (
      password == null ||
      confirmPassword == null ||
      username == null ||
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

    const registerUser: IFinishRegistration = {
      password: password.toString().trim(),
      username: username.toString().trim(),
      address: address.toString().trim(),
      userType: userType.toString().trim() as UserType,
      birthDate: date,
    };

    dispatch(finishRegistrationAction({ id: id, data: registerUser }));
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
          <Avatar sx={{ m: 1, bgcolor: "info.main", mb: 2 }}>
            <ManageAccountsIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Finish Registration
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
                !isPasswordValid ||
                !isConfirmPasswordValid ||
                !isUsernameValid ||
                !isAddressValid ||
                !isUserTypeValid ||
                !isDateValid
              }
              sx={{ mt: 3, mb: 2 }}
            >
              Finish
            </Button>
          </Box>
        </Box>
      </Zoom>
    </Container>
  );
};

export default FinishRegistrationForm;
