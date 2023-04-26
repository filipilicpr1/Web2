import React, { FC } from "react";
import {
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Box,
} from "@mui/material";
import { IProduct } from "../../shared/interfaces/productsInterfaces";

interface IProps {
  item: IProduct;
  showSeller: boolean;
}

const ProductCardContent: FC<IProps> = (props) => {
  return (
    <>
      <Box
        className={"product-image"}
        sx={{
          height: "auto",
          width: "100%",
          p: 3,
          m: "28",
          position: "relative",
          display: "inline-block",
          overflow: "hidden",
        }}
      >
        <Box sx={{position: "relative", pb: "100%", overflow: "hidden", borderRadius: "25px"}}>

        <CardMedia
          component="img"
          image={props.item.imageSource}
          height="auto"
          alt="pic"
          sx={{ transition: "transform 0.35s ease-in-out", position: "absolute" }}
          />
          </Box>
      </Box>
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold", width: "200px" }}
        >
          {props.item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.item.description}
        </Typography>
        <Grid container sx={{ display: "flex", flexDirection: "row" }}>
          <Grid item xs={6}>
            <Typography variant="h6" color="text.secondary">
              {props.item.amount + " left"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Typography variant="h6" color="text.primary">
              {props.item.price + " RSD"}
            </Typography>
          </Grid>
        </Grid>
        {props.showSeller && (
          <Grid
            container
            sx={{ display: "flex", flexDirection: "row-reverse", mt: 2 }}
          >
            <Grid item xs={3}>
              <Avatar
                src={props.item.seller.imageSource}
                alt="pic"
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Typography
                variant="h6"
                color="text.primary"
                sx={{ mt: 2, mr: 1 }}
              >
                {props.item.seller.username}
              </Typography>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </>
  );
};

export default ProductCardContent;
