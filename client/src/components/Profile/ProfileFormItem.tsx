import React, { FC, useState } from "react";
import { TextField, Grid, Box, InputLabel } from "@mui/material";

interface IProps {
  id: string;
  label: string;
  initialValue: string | undefined;
}

const ProfileFormItem: FC<IProps> = (props) => {
  const [value, setValue] = useState(props.initialValue);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

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
          alignItems:"center",
          justifyContent:"center",
          textAlign: "center"
        }}
      >
        <InputLabel sx={{mt: 2}} htmlFor={props.id}>{props.label}</InputLabel>
      </Box>
      <Box mr={-30} width={800}>
        <TextField
          margin="normal"
          required
          fullWidth
          value={value}
          onChange={changeHandler}
          id={props.id}
          name={props.id}
        />
      </Box>
    </Grid>
  );
};

export default ProfileFormItem;
