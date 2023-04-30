import React, { FC } from "react";
import { Box, Typography } from "@mui/material";
import { OrderStatuses } from "../../shared/types/enumerations";

interface IProps {
  
  orderDate: string;
  status: OrderStatuses;
}

const OrderBottomInfo: FC<IProps> = (props) => {
    const statusColor =
    props.status === "ONGOING"
      ? "orange"
      : props.status === "DELIVERED"
      ? "green"
      : "red";
  return (
    <>
      <Typography color={statusColor}>{props.status}</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          mt: "10px",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {props.orderDate}
        </Typography>
      </Box>
    </>
  );
};

export default OrderBottomInfo;
