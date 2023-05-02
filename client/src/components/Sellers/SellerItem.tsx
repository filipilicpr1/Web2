import React, { FC } from "react";
import { IUser } from "../../shared/interfaces/userInterfaces";
import { Grow, Grid, CardContent, Typography, Box } from "@mui/material";
import StyledCard from "../UI/Styled/StyledCard";
import SellerPhoto from "./SellerPhoto";

interface IProps {
  seller: IUser;
  showStatus: boolean;
}

const SellerItem: FC<IProps> = (props) => {
  const statusColor =
    props.seller.verificationStatus === "PENDING"
      ? "orange"
      : props.seller.verificationStatus === "ACCEPTED"
      ? "green"
      : "red";
  const birthDate = new Date(props.seller.birthDate)
    .toLocaleString("en-GB")
    .split(",")[0];

  return (
    <Grow in={true}>
      <Grid item xs={3}>
        <StyledCard
          onClick={() => {}}
          sx={{
            m: 2,
            borderRadius: "25px",
            width: "300",
            backgroundColor: "#4d4855",
            backgroundImage: "linear-gradient(147deg, #4d4855 0%, #000000 74%)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SellerPhoto
            image={props.seller.imageSource}
            name={props.seller.name}
            lastName={props.seller.lastName}
          />
          <CardContent>
            <Box>
              <Typography>{props.seller.email}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {props.seller.username}
              </Typography>
            </Box>
            {props.showStatus && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  mt: "10px",
                }}
              >
                <Typography color={statusColor}>
                  {props.seller.verificationStatus}
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                mt: "15px",
                mb: "-10px"
              }}
            >
              <Typography variant="body1" color="text.secondary">
                {birthDate}
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grow>
  );
};

export default SellerItem;
