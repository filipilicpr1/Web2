import React, { FC, useState } from "react";
import { Grid, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../shared/interfaces/userInterfaces";
import AcceptSellerModal from "./AcceptSellerModal";
import RejectSellerModal from "./RejectSellerModal";

interface IProps {
  seller: IUser;
}

const DetailedSellerActions: FC<IProps> = (props) => {
  const navigate = useNavigate();
  const [openAccept, setOpenAccept] = useState<boolean>(false);
  const [openReject, setOpenReject] = useState<boolean>(false);
  const showButtons = props.seller.verificationStatus === "PENDING";

  const backHandler = () => {
    navigate(-1);
  };

  const closeAcceptHandler = () => {
    setOpenAccept(false);
  };

  const openAcceptHandler = () => {
    setOpenAccept(true);
  };

  const closeRejectHandler = () => {
    setOpenReject(false);
  };

  const openRejectHandler = () => {
    setOpenReject(true);
  };

  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          width: "58%",
        }}
      >
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Button
            onClick={backHandler}
            variant="contained"
            sx={{
              mt: 6,
              mb: 2,
              ml: -15,
              bgcolor: "green",
              alignSelf: "flex-end",
              width: 140,
              height: 40,
              backgroundColor: "primary",
            }}
          >
            GO BACK
          </Button>
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
          {showButtons && (
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Box>
                <Button
                  onClick={openRejectHandler}
                  variant="contained"
                  sx={{
                    mt: 6,
                    mb: 2,
                    mr: 2,
                    bgcolor: "red",
                    width: 120,
                    height: 40,
                  }}
                >
                  REJECT
                </Button>
              </Box>
              <Box>
                <Button
                  onClick={openAcceptHandler}
                  variant="contained"
                  sx={{
                    mt: 6,
                    mb: 2,
                    mr: -15,
                    bgcolor: "green",
                    width: 120,
                    height: 40,
                  }}
                >
                  ACCEPT
                </Button>
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
      <AcceptSellerModal
        open={openAccept}
        seller={props.seller}
        handleClose={closeAcceptHandler}
      />
      <RejectSellerModal
        open={openReject}
        seller={props.seller}
        handleClose={closeRejectHandler}
      />
    </>
  );
};

export default DetailedSellerActions;
