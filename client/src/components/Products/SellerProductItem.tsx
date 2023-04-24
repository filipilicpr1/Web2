import React, { FC } from "react";
import { IProduct } from "../../shared/interfaces/productsInterfaces";
import { Grid, Grow } from "@mui/material";
import StyledCard from "../UI/Styled/StyledCard";
import ProductCardContent from "./ProductCardContent";
import SellerProductActions from "./SellerProductActions";

interface IProps {
  item: IProduct;
}

const SellerProductItem: FC<IProps> = (props) => {
  return (
    <Grow in={true}>
      <Grid item xs={3}>
        <StyledCard
          sx={{
            m: 2,
            borderRadius: "10%",
            width: "300",
            backgroundColor: "#4d4855",
            backgroundImage: "linear-gradient(147deg, #4d4855 0%, #000000 74%)",
          }}
        >
          <ProductCardContent item={props.item} showSeller={false} />
          <SellerProductActions item={props.item} />
        </StyledCard>
      </Grid>
    </Grow>
  );
};

export default SellerProductItem;
