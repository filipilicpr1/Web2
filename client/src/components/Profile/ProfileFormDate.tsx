import React, { FC } from "react";
import { Grid, Box, InputLabel } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns"

interface IProps {
  id: string;
  label: string;
  initialValue: string | undefined;
  setValue: (value: Date | null) => void
}

const ProfileFormDate: FC<IProps> = (props) => {

  return (
    <Grid
      item
      xs={6}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "left",
      }}
    >
      <Box
        sx={{
          borderRadius: "10px",
          border: "1px solid #AFAFAF",
          mr: 15,
          mt: 2,
          ml: 5,
          height: 55,
          width: 300,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <InputLabel sx={{ mt: 2 }} htmlFor={props.id}>
          {props.label}
        </InputLabel>
      </Box>
      <Box mr={-30} mt={2} width={800}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            defaultValue={new Date(props.initialValue || new Date())}
            format="dd/MM/yyyy"
            onChange={(newValue) => props.setValue(newValue)}
            sx={{ width: 290}}
          />
        </LocalizationProvider>
      </Box>
    </Grid>
  );
};

export default ProfileFormDate;
