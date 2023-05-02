import React, { FC } from "react";
import { Box, Avatar } from "@mui/material";

interface IProps {
  image: string;
}

const DetailedPageImage: FC<IProps> = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        mb: 8,
      }}
    >
      <Box mt={2}>
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

export default DetailedPageImage;
