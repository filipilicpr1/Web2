import React, { FC, useState } from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  InputLabel,
  Card,
} from "@mui/material";
import ProfileFormItem from "./ProfileFormItem";
import ProfileFormDate from "./ProfileFormDate";

interface IProps {
  children?: React.ReactNode;
}

const BorderedBox: FC<IProps> = (props) => {
  return (
    <Box
      sx={{
        borderRadius: "20px",
        border: "1px solid white",
        padding: "2rem",
        margin: "1rem",
      }}
    >
      {props.children}
    </Box>
  );
};

const ProfileForm: FC = () => {
  const title = (
    <Box
      mb={2}
      sx={{
        borderRadius: "20px",
        border: "1px solid white",
        padding: "2rem",
        boxShadow: "5px 3px 3px",
        textAlign: "center",
        ml: 40,
        mr: 40,
      }}
    >
      <Typography component="h2" variant="h2">
        My Profile
      </Typography>
    </Box>
  );

  const [date, setDate] = useState<Date | null>(new Date("1998-12-18"));

  const dateChangeHandler = (value: Date | null) => {
    setDate(value);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = data.get("name");
    const address = data.get("address");
    console.log(name);
    console.log(address);
    console.log(date);
  };

  return (
    <Container component="main">
      <CssBaseline />
      <Box sx={{ width: "1430px", marginLeft: "-10rem" }}>{title}</Box>
      <Grid component="form" container onSubmit={handleSubmit}>
        <Grid item xs={6}>
          <Card
            sx={{
              margin: "1rem",
              mt: 6,
              pb: 2,
              pl: 3,
              marginLeft: "-8rem",
              borderRadius: "20px",
              bgcolor: "primary",
            }}
          >
            <ProfileFormItem id="name" label="Name" initialValue="Filip" />
            <ProfileFormItem
              id="lastName"
              label="Last Name"
              initialValue="Ilic"
            />
            <ProfileFormItem
              id="address"
              label="Address"
              initialValue="Kostanina 30"
            />
            <ProfileFormDate id="date" label="Date" initialValue="1998-12-18" setValue={dateChangeHandler} />
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card
            sx={{
              margin: "1rem",
              mt: 6,
              marginRight: "-8rem",
              borderRadius: "20px",
              bgcolor: "primary",
            }}
          >
            <BorderedBox></BorderedBox>
          </Card>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
      </Grid>
    </Container>
  );
};

export default ProfileForm;
