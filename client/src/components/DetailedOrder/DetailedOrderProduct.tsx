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

const DetailedOrderProduct: FC<IProps> = (props) => {
  return (
    <Card
      sx={{
        mb: 2,
        mt: 2,
        borderRadius: "25px",
        width: "80%",
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
      <CardContent sx={{ mt: 0.5 }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold" }}
        >
          {props.item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={-1} mb={1}>
          {props.item.description}
        </Typography>
        <Grid container sx={{ display: "flex", flexDirection: "column" }}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Typography variant="h6" color="text.primary">
                {props.item.amount + " X " + props.item.price}
              </Typography>
              <Typography variant="body2" mt={1} ml={0.5}>
                {defaultCurrency}
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Typography variant="h6" color="text.primary">
                {"Total: " + props.item.amount * props.item.price}
              </Typography>
              <Typography variant="body2" mt={1} ml={0.5}>
                {defaultCurrency}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            mt: 2,
          }}
        >
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              mt: -1.5
            }}
          >
            <Typography variant="h6" color="text.primary" sx={{ mt: 2, mr: 1 }}>
              {props.item.seller.username}
            </Typography>
          </Grid>
          <Grid item xs={3} mr={2} mt={-2}>
            <Avatar
              src={props.item.seller.imageSource}
              alt="pic"
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DetailedOrderProduct;
