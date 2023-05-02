import React, { FC, useState } from "react";
import { IProduct } from "../../shared/interfaces/productsInterfaces";
import { Grid, Grow, Card } from "@mui/material";
import ProductCardContent from "./ProductCardContent";
import SellerDeleteAction from "./SellerDeleteAction";
import SellerEditAction from "./SellerEditAction";
import SellerDeleteModal from "./SellerDeleteModal";

interface IProps {
  item: IProduct;
}

const SellerProductItem: FC<IProps> = (props) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

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
          <SellerEditAction item={props.item} />
          <SellerDeleteAction item={props.item} handleClick={handleOpen} />
          <ProductCardContent item={props.item} showSeller={false} />
          <SellerDeleteModal item={props.item} open={open} handleClose={handleClose} />
        </Card>
      </Grid>
    </Grow>
  );
};

export default SellerProductItem;
