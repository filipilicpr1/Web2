import React, { FC } from "react";
import { Box, Typography } from "@mui/material";

interface IProps {
  orderTime: Date;
  deliveryTime: Date;
}

const ActiveOrderBottomInfo: FC<IProps> = (props) => {
  const mins = props.deliveryTime.getMinutes() - new Date().getMinutes();
  const adjustedMins = mins < 0 ? mins + 60 : mins;
  const orderDate = new Date(props.orderTime).toLocaleString("en-GB");

  return (
    <>
      <Typography variant="h6" color={"text.secondary"}>
        {"Ordered at:"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          mt: "10px",
        }}
      >
        <Typography mt={-1} variant="body1" color="text.secondary">
          {orderDate}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <Typography variant="h6" mt={1} color={"green"} textAlign={"left"}>
          {"Arriving in: "}
        </Typography>
        <Typography
          variant="h5"
          ml={1}
          mt={1}
          fontWeight={"bold"}
          color={"green"}
          textAlign={"right"}
        >
          {adjustedMins}
        </Typography>
        <Typography
          variant="body2"
          ml={1}
          mt={2}
          color={"green"}
          textAlign={"right"}
        >
          {" mins"}
        </Typography>
      </Box>
    </>
  );
};

export default ActiveOrderBottomInfo;
