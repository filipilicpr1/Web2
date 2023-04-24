import React, { FC } from "react";
import { useAppSelector } from "../../store/hooks";
import SellerProductItem from "./SellerProductItem";
import { Grid, Card, Container, CssBaseline } from "@mui/material";

const SellerProductsList: FC = () => {
  const sellerProducts = useAppSelector(
    (state) => state.products.sellerProducts
  );
  const items = sellerProducts.map((product) => (
    <SellerProductItem key={product.id} item={product} />
  ));
  return (
    <>
      {sellerProducts.length > 0 && (
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
              sx={{ display: "flex", flexDirection: "row", width: "1000" }}
            >
              {items}
            </Grid>
          </Card>
        </Container>
      )}
    </>
  );
};

export default SellerProductsList;
