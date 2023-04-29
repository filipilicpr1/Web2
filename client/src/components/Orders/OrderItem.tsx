import React, { FC } from "react";
import { IOrder } from "../../shared/interfaces/orderInterfaces";
import { Grow, Grid, Box, CardContent, Typography, Button } from "@mui/material";
import StyledCard from "../UI/Styled/StyledCard";
import OrderBuyerPhoto from "./OrderBuyerPhoto";
import OrderProductsList from "./OrderProductsList";
import { useAppSelector } from "../../store/hooks";

interface IProps {
  item: IOrder;
}

const OrderItem: FC<IProps> = (props) => {
  const user = useAppSelector((state) => state.user.user);
  const userIsSeller = user?.userType === "SELLER";
  const id = user !== null ? user.id : "";
  const userIsBuyer = user?.userType === "BUYER";

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
          {!userIsBuyer && (
            <OrderBuyerPhoto
              image={props.item.buyer.imageSource}
              name={props.item.buyer.name}
              lastName={props.item.buyer.lastName}
            />
          )}
          {userIsBuyer && (
            <Button size="large" variant="contained" disabled sx={{
              cursor: "auto",
              width: "110%",
              bgcolor: "#bdd4e7",
              backgroundImage: "linear-gradient(315deg, #bdd4e7 0%, #8693ab 74%)",
              mb: 2,
              mt: 2,
            }}>

              <Typography fontWeight={"bold"} color={"black"}>MY ORDER</Typography>
            </Button>
            
          )}
          <CardContent
            sx={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <OrderProductsList
              items={props.item.orderProducts}
              sellerId={userIsSeller ? id : ""}
            />
            <Typography variant="h6" mt={2}>
              {"Total: " + props.item.price}
            </Typography>
            <Typography color={statusColor}>{props.item.status}</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                mt: "10px",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                {orderDate}
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grow>
  );
};

export default OrderItem;
