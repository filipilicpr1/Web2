import React, { FC } from "react";
import { IOrder } from "../../shared/interfaces/orderInterfaces";
import {
  Grow,
  Grid,
  Box,
  CardContent,
  Typography,
} from "@mui/material";
import StyledCard from "../UI/Styled/StyledCard";
import OrderBuyerPhoto from "./OrderBuyerPhoto";
import OrderProductsList from "./OrderProductsList";

interface IProps {
  item: IOrder;
  sellerId: string;
}

const OrderItem: FC<IProps> = (props) => {
  const orderDate = new Date(props.item.orderTime)
    .toLocaleString("en-GB")
    .split(",")[0];
  const statusColor =
    props.item.status === "ONGOING"
      ? "orange"
      : props.item.status === "DELIVERED"
      ? "green"
      : "red";
  return (
    <Grow in={true}>
      <Grid item xs={3}>
        <StyledCard
          sx={{
            m: 2,
            borderRadius: "25px",
            width: "300",
            backgroundColor: "#4d4855",
            backgroundImage: "linear-gradient(147deg, #4d4855 0%, #000000 74%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <OrderBuyerPhoto image={props.item.buyer.imageSource} />
          <CardContent
            sx={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <Typography
              variant="h5"
              pb={3}
              mt={-3}
              fontWeight={"bold"}
              textAlign={"center"}
            >
              {props.item.buyer.name + " " + props.item.buyer.lastName}
            </Typography>
            <OrderProductsList items={props.item.orderProducts} sellerId={props.sellerId} />
            <Typography variant="h6" mt={2}>
              {"Total: " + props.item.price}
            </Typography>
            <Typography color={statusColor}>{props.item.status}</Typography>
            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end", mt: "10px"}}>
              <Typography variant="body1" color="text.secondary">{orderDate}</Typography>
            </Box>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grow>
  );
};

export default OrderItem;
