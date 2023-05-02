import React, { FC } from "react";
import { IOrder } from "../../shared/interfaces/orderInterfaces";
import {
  Grow,
  Grid,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import StyledCard from "../UI/Styled/StyledCard";
import OrderBuyerPhoto from "./OrderBuyerPhoto";
import OrderProductsList from "./OrderProductsList";
import { useAppSelector } from "../../store/hooks";
import OrderBottomInfo from "./OrderBottomInfo";
import ActiveOrderBottomInfo from "./ActiveOrderBottomInfo";
import { defaultCurrency } from "../../constants/Constants";
import { useNavigate } from "react-router-dom";

interface IProps {
  item: IOrder;
}

const OrderItem: FC<IProps> = (props) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const userIsSeller = user?.userType === "SELLER";
  const id = user !== null ? user.id : "";
  const userIsBuyer = user?.userType === "BUYER";
  const userIsAdmin = user?.userType === "ADMIN";

  const orderDate = new Date(props.item.orderTime)
    .toLocaleString("en-GB")
    .split(",")[0];

  const clickHandler = () => {
    navigate("/orders/" + props.item.id);
  };

  return (
    <Grow in={true}>
      <Grid item xs={3}>
        <StyledCard
          onClick={clickHandler}
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
            <Button
              size="large"
              variant="contained"
              disabled
              sx={{
                cursor: "auto",
                width: "110%",
                bgcolor: "#bdd4e7",
                backgroundImage:
                  "linear-gradient(315deg, #bdd4e7 0%, #8693ab 74%)",
                mb: 2,
                mt: 2,
              }}
            >
              <Typography fontWeight={"bold"} color={"black"}>
                MY ORDER
              </Typography>
            </Button>
          )}
          <CardContent
            sx={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <OrderProductsList
              items={props.item.orderProducts}
              sellerId={userIsSeller ? id : ""}
            />
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Typography variant="h6" mt={2}>
                {"Total: " + props.item.price}
              </Typography>
              <Typography variant="body2" mt={3} ml={0.5} >
                {defaultCurrency}
              </Typography>
            </Box>
            {(userIsAdmin || props.item.status !== "ONGOING") && (
              <OrderBottomInfo
                orderDate={orderDate}
                status={props.item.status}
              />
            )}
            {!userIsAdmin && props.item.status === "ONGOING" && (
              <ActiveOrderBottomInfo
                orderTime={new Date(props.item.orderTime)}
                deliveryTime={new Date(props.item.deliveryTime)}
              />
            )}
          </CardContent>
        </StyledCard>
      </Grid>
    </Grow>
  );
};

export default OrderItem;
