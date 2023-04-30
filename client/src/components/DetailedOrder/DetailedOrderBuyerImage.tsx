import React, { FC } from "react";
import { Box, Avatar, InputLabel } from "@mui/material";

interface IProps {
  image: string;
}

const DetailedOrderBuyerImage: FC<IProps> = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "left",
        mb: 8
      }}
    >
      <Box
        sx={{
          borderRadius: "10px",
          mr: 15,
          mt: 2,
          ml: 5,
          height: "auto",
          width: 200,
          alignItems: "center",
          justifyContent: "flex-start",
          textAlign: "center",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        <Box
          sx={{
            borderRadius: "10px",
            border: "1px solid #AFAFAF",
            height: 55,
            width: 200,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <InputLabel sx={{ mt: 2 }} htmlFor={"image"}>
            Buyer Image
          </InputLabel>
        </Box>
      </Box>
      <Box mr={-30} mt={2}>
        <Avatar
          id="image"
          alt="pic"
          src={props.image}
          sx={{ width: "200px", height: "200px" }}
        />
      </Box>
    </Box>
  );
};

export default DetailedOrderBuyerImage;
