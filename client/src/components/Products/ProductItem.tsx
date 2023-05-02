import React, { FC } from "react";
import { IProduct } from "../../shared/interfaces/productsInterfaces";
import { Grid, Grow, Card } from "@mui/material";
import ProductCardContent from "./ProductCardContent";
import AddProductActions from "./AddProductActions";

interface IProps {
  item: IProduct;
}

const ProductItem: FC<IProps> = (props) => {
  return (
    <Grow in={true}>
      <Grid item xs={3}>
        <Card
          sx={{
            m: 2,
            borderRadius: "25px",
            width: "300",
            backgroundColor: "#4d4855",
            backgroundImage: "linear-gradient(147deg, #4d4855 0%, #000000 74%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <AddProductActions item={props.item} />
          <ProductCardContent item={props.item} showSeller={true} />
        </Card>
      </Grid>
    </Grow>
  );
};

export default ProductItem;
