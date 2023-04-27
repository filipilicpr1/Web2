import React, { FC } from "react";
import {
  Grid,
  Box,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  Card,
} from "@mui/material";
import { IProduct } from "../../shared/interfaces/productsInterfaces";
import { defaultCurrency } from "../../constants/Constants";

interface IProps {
  item: IProduct;
}

const CheckoutItemContent: FC<IProps> = (props) => {
  return (
    <Grid item xs={7}>
      <Card
        sx={{
          m: 2,
          borderRadius: "25px",
          width: "100%",
          backgroundColor: "#4d4855",
          backgroundImage: "linear-gradient(147deg, #4d4855 0%, #000000 74%)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardMedia
            component="img"
            image={props.item.imageSource}
            alt="pic"
            sx={{ borderRadius: "50px", p: 3, height: "200px" }}
          />
        </Box>
        <CardContent sx={{mt: 0.5}}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            {props.item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.item.description}
          </Typography>
          <Grid container sx={{ display: "flex", flexDirection: "row" }}>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <Typography variant="h6" color="text.primary">
                {props.item.price + defaultCurrency}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "flex-end",
              mt: 2,
            }}
          >
            <Grid item xs={3} mr={2}>
              <Avatar
                src={props.item.seller.imageSource}
                alt="pic"
                sx={{ mt: 1 }}
              />
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
              <Typography
                variant="h6"
                color="text.primary"
                sx={{ mt: 2, mr: 1 }}
              >
                {props.item.seller.username}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CheckoutItemContent;
