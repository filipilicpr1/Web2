import React, { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  Button,
  Grid,
  Card,
  Grow,
  Zoom,
  Box,
  Avatar,
  TextField,
  Typography,
} from "@mui/material";
import DetailedOrderItem from "./DetailedOrderItem";
import DetailedOrderBuyerImage from "./DetailedOrderBuyerImage";
import DetailedOrderProduct from "./DetailedOrderProduct";
import DetailedOrderProductsList from "./DetailedOrderProductsList";
import { defaultCurrency } from "../../constants/Constants";

const DetailedOrder: FC = () => {
  const order = useAppSelector((state) => state.orders.detailedOrder);

  return (
    <>
      {order !== null && (
        <Grow in={true}>
          <Box>
            <Card
              sx={{
                margin: "1rem",
                mt: 6,
                pb: 2,
                pl: 3,
                ml: 13,
                pt: 2,
                width: "80%",
                borderRadius: "20px",
                backgroundColor: "#2d3436",
                backgroundImage:
                  "linear-gradient(315deg, #2d3436 0%, #000000 74%)",
                boxShadow:
                  "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
              }}
            >
              <DetailedOrderItem
                id="name"
                label="Buyer Name"
                value={order.buyer.name + " " + order.buyer.lastName}
              />
              <DetailedOrderItem
                id="username"
                label="Buyer Username"
                value={order.buyer.username}
              />
              <DetailedOrderBuyerImage image={order.buyer.imageSource} />
              <DetailedOrderItem
                id="orderTime"
                label="Order Time"
                value={new Date(order.orderTime).toLocaleString("en-GB")}
              />
              <DetailedOrderItem
                id="deliveryTime"
                label="Delivery Time"
                value={new Date(order.deliveryTime).toLocaleString("en-GB")}
              />
              <DetailedOrderItem
                id="address"
                label="Delivery Address"
                value={order.deliveryAddress}
              />
              <DetailedOrderItem
                id="comment"
                label="Comment"
                value={order.comment}
              />
              <DetailedOrderItem
                id="status"
                label="Order Status"
                value={order.status}
              />
            </Card>
            <Card
              sx={{
                margin: "1rem",
                mt: 6,
                pb: 2,
                pl: 3,
                ml: 13,
                pt: 2,
                width: "80%",
                borderRadius: "20px",
                backgroundColor: "#2d3436",
                backgroundImage:
                  "linear-gradient(315deg, #2d3436 0%, #000000 74%)",
                boxShadow:
                  "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
              }}
            >
              <DetailedOrderProductsList products={order.orderProducts} />
              <Box
                sx={{
                  width: "95%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    borderRadius: "10px",
                    mt: 4,
                    mb: 2,
                    height: 55,
                    width: "90%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    textAlign: "right",
                  }}
                >
                  
                  <Box sx={{ display: "flex", flexDirection: "row", mr: 2 }}>
                  <Typography variant="h5" fontFamily={"cursive"}>
                    {"Total: " + order.price}
                  </Typography>
                    <Typography variant="body2" mt={1.3} ml={0.5}>
                      {defaultCurrency}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Box>
        </Grow>
      )}
    </>
  );
};

export default DetailedOrder;
