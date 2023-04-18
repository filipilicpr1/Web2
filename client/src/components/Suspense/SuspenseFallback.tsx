import React, { FC } from "react";
import LoadingModal from "../UI/Modal/LoadingModal";
import {Box} from "@mui/material";

const SuspenseFallback: FC = () => {
  return (
    <Box sx={{ flexGrow: 1, width: "100%", height: "100%", bgcolor: "primary.main" }}>
    <LoadingModal show={true} />
  </Box>
  );
};

export default SuspenseFallback;
