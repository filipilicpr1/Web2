import React, { FC } from "react";
import { Box, Typography } from "@mui/material";

const ProfileTitle: FC = () => {
  return (
    <Box sx={{ width: "1430px", marginLeft: "-10rem" }}>
      <Box
        mb={2}
        sx={{
          borderRadius: "20px",
          padding: "2rem",
          textAlign: "center",
          ml: 40,
          mr: 40,
          boxShadow:
            "rgba(255, 255, 255, 0.25) 0px 1px 0px, rgba(27, 31, 35, 0.04) 0px 1px 0px inset",
        }}
      >
        <Typography component="h2" variant="h2" fontFamily={"cursive"}>
          My Profile
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileTitle;
