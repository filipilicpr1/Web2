import React, { FC } from "react";
import { Box, CardMedia } from "@mui/material";

interface IProps {
  image: string;
}

const OrderBuyerPhoto: FC<IProps> = (props) => {
  return (
    <Box
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
      <Box
        sx={{
          position: "relative",
          pb: "100%",
          overflow: "hidden",
          borderRadius: "25px",
        }}
      >
        <CardMedia
          component="img"
          image={props.image}
          height="auto"
          alt="pic"
          sx={{
            transition: "transform 0.35s ease-in-out",
            position: "absolute",
          }}
        />
      </Box>
    </Box>
  );
};

export default OrderBuyerPhoto;
