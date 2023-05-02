import React, { FC } from "react";
import { Box, CardMedia, Typography } from "@mui/material";

interface IProps {
  image: string;
  name: string;
  lastName: string;
}

const SellerPhoto: FC<IProps> = (props) => {
  return (
    <>
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
      <Typography variant="h5" pb={1} fontWeight={"bold"} textAlign={"center"}>
        {props.name + " " + props.lastName}
      </Typography>
    </>
  );
};

export default SellerPhoto;
