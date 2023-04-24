import React, { FC } from "react";
import { IProduct } from "../../shared/interfaces/productsInterfaces";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Grow,
  Avatar,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

interface IProps {
  item: IProduct;
}

const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.35s ease-in-out",
  cursor: "pointer",
  "&:hover": { transform: "scale3d(1.1, 1.1, 1)" },
}));

const ProductItem: FC<IProps> = (props) => {
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
          <Box sx={{ height: "200" }}>
            <CardMedia
              component="img"
              image={props.item.imageSource}
              height="260"
              alt="pic"
              sx={{ borderRadius: "20%", p: 2, m: "28" }}
            />
          </Box>
          <CardContent>
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
            <Grid
              container
              sx={{ display: "flex", flexDirection: "row", mt: 2 }}
            >
              <Grid item xs={3}>
                <Avatar
                  src={props.item.seller.imageSource}
                  alt="pic"
                  sx={{ mt: 1 }}
                />
              </Grid>
              <Grid item xs={9}>
                <Typography variant="h6" color="text.primary" sx={{ mt: 2 }}>
                  {props.item.seller.username}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          {/*<CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
  </CardActions> */}
        </StyledCard>
      </Grid>
    </Grow>
  );
};

export default ProductItem;
