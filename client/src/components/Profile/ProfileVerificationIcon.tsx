import React, { FC } from "react";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import { Typography, Box } from "@mui/material";

interface IProps {
  verificationStatus: string | undefined;
}

const acceptedIcon = (
  <>
    <VerifiedUserIcon color="success" sx={{ width: 60, height: 60 }} />
    <Typography fontSize={20} color="success.dark" sx={{ mt: 2, ml: 2 }}>
      You have been accepted
    </Typography>
  </>
);

const rejectedIcon = (
  <>
    <CancelIcon color="error" sx={{ width: 60, height: 60 }} />
    <Typography fontSize={20} color="error" sx={{ mt: 2, ml: 2 }}>
      You have been rejected
    </Typography>
  </>
);

const pendingIcon = (
  <>
    <PendingIcon color="warning" sx={{ width: 60, height: 60 }} />
    <Typography fontSize={20} color="warning.light" sx={{ mt: 2, ml: 2 }}>
      Verification request pending
    </Typography>
  </>
);

const ProfileVerificationIcon: FC<IProps> = (props) => {
  const icon =
    props.verificationStatus !== undefined &&
    ((props.verificationStatus === "REJECTED" && rejectedIcon) ||
      (props.verificationStatus === "ACCEPTED" && acceptedIcon) ||
      (props.verificationStatus === "PENDING" && pendingIcon));
  return (
    <Box
      sx={{
        mt: -8,
        ml: -15,
        width: 350,
        display: "flex",
        flexDirection: "row",
      }}
    >
      {icon}
    </Box>
  );
};

export default ProfileVerificationIcon;
