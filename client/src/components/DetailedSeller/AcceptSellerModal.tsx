import React, { FC } from "react";
import { Typography, Modal, Box, Grid, Grow } from "@mui/material";
import { IUser } from "../../shared/interfaces/userInterfaces";
import StyledButton from "../UI/Styled/StyledButton";
import { useAppDispatch } from "../../store/hooks";
import { verifySellerAction } from "../../store/verificationSlice";

interface IProps {
  seller: IUser;
  open: boolean;
  handleClose: () => void;
}

const AcceptSellerModal: FC<IProps> = (props) => {
  const dispatch = useAppDispatch();

  const handleAccept = () => {
    dispatch(
      verifySellerAction({ id: props.seller.id, data: { isAccepted: true } })
    );
    props.handleClose();
  };

  return (
    <Modal open={props.open}>
      <Grow in={props.open}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "35%",
            left: "30%",
            transform: "translate(-50%, -50%)",
            width: 600,
            backgroundColor: "#485461",
            backgroundImage: "linear-gradient(315deg, #485461 0%, #28313b 74%)",
            border: "2px solid #000",
            borderRadius: "20px",
            boxShadow:
              "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",

            pt: 2,
            pl: 5,
            pb: 3,
          }}
        >
          <Grid container sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h5" fontWeight={"bold"}>
              Are you sure you want to accept seller{" "}
              {props.seller.name + " " + props.seller.lastName + "?"}
            </Typography>
            <Grid item sx={{ display: "flex", flexDirection: "row", mt: 2 }}>
              <Grid item xs={6}>
                <StyledButton
                  onClick={props.handleClose}
                  sx={{
                    width: "80%",
                    borderRadius: "25px",
                    bgcolor: "#29539b",
                    backgroundImage:
                      "linear-gradient(315deg, #29539b 0%, #1e3b70 74%)",
                    order: 3,
                    mb: 2,
                    "&:hover": {
                      "&~.product-image img": {
                        transform: "scale3d(1.09, 1.09, 1)",
                      },
                    },
                  }}
                >
                  <Typography fontWeight={"bold"}>NO</Typography>
                </StyledButton>
              </Grid>
              <Grid item xs={6}>
                <StyledButton
                  onClick={handleAccept}
                  sx={{
                    width: "80%",
                    borderRadius: "25px",
                    bgcolor: "#990000",
                    backgroundImage:
                      "linear-gradient(147deg, #990000 0%, #ff0000 74%)",
                    order: 4,
                    mb: 2,
                    ml: 2,
                    "&:hover": {
                      "&~.product-image img": {
                        transform: "scale3d(1.09, 1.09, 1)",
                      },
                    },
                  }}
                >
                  <Typography fontWeight={"bold"}>YES</Typography>
                </StyledButton>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grow>
    </Modal>
  );
};

export default AcceptSellerModal;
