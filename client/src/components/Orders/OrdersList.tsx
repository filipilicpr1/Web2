import React, { FC } from "react";
import { Grid, Card, Container, CssBaseline, Grow } from "@mui/material";
import OrderItem from "./OrderItem";
import { IOrder } from "../../shared/interfaces/orderInterfaces";
import PageTitle from "../UI/Title/PageTitle";
import { useAppSelector } from "../../store/hooks";

interface IProps {
  orders: IOrder[];
}

const OrdersList: FC<IProps> = ({ orders }) => {
  const apiState = useAppSelector((state) => state.orders.apiState);
  const items = orders.map((order) => (
    <OrderItem
      key={order.id}
      item={order}
    />
  ));
  return (
    <>
      {orders.length > 0 && (
        <Grow in={true}>
          <Container
            component="main"
            sx={{ display: "flex", flexDirection: "row" }}
          >
            <CssBaseline />
            <Card
              sx={{
                mt: 4,
                p: 4,
                borderRadius: "20px",
                backgroundColor: "#a399b2",
                backgroundImage:
                  "linear-gradient(147deg, #a399b2 0%, #4d4855 74%)",
                width: "100%",
                boxShadow:
                  "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
              }}
            >
              <Grid
                container
                sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "1000" }}
              >
                {items}
              </Grid>
            </Card>
          </Container>
        </Grow>
      )}
      {(orders.length <= 0 && apiState === "COMPLETED") && <PageTitle title="WOW SUCH EMPTY" />}
    </>
  );
};

export default OrdersList;
