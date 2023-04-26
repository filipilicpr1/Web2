import React, { FC } from "react";
import { IProduct } from "../../shared/interfaces/productsInterfaces";
import {
  Grid,
  Grow,
} from "@mui/material";
import StyledCard from "../UI/Styled/StyledCard";
import CheckoutItemContent from "./CheckoutItemContent";
import CheckoutItemActions from "./CheckoutItemActions";

interface IProps {
  item: IProduct;
  id: string;
  amount: number;
}

const CheckoutItem: FC<IProps> = (props) => {
  return (
    <Grow in={true} mountOnEnter unmountOnExit>
      <Grid item xs={10}>
        <StyledCard
          sx={{
            m: 2,
            ml: 11,
            borderRadius: "25px",
            width: "100%",
            backgroundColor: "#000000",
            backgroundImage: "linear-gradient(315deg, #000000 0%, #7f8c8d 74%)",
            display: "flex",
            flexDirection: "row",
            padding: 1,
          }}
        >
          <CheckoutItemContent item={props.item} />
          <CheckoutItemActions item={props.item} amount={props.amount} />
        </StyledCard>
      </Grid>
    </Grow>
  );
};

export default CheckoutItem;
