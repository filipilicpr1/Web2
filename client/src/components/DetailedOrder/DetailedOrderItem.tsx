import React, { FC } from "react";
import { Box, InputLabel, TextField } from "@mui/material";

interface IProps {
  id: string;
  label: string;
  value: string;
}

const DetailedOrderItem: FC<IProps> = (props) => {
  return (
    <Box
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
          width: 200,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <InputLabel sx={{ mt: 2 }} htmlFor={props.id}>
          {props.label}
        </InputLabel>
      </Box>
      <Box mr={-30}>
        <TextField
          margin="normal"
          disabled
          value={props.value}
          id={props.id}
          name={props.id}
          color="error"
          sx={{ mr: 10, width: "150%" }}
        />
      </Box>
    </Box>
  );
};

export default DetailedOrderItem;
