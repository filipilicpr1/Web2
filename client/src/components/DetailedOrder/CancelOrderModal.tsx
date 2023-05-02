import React, { FC, useState, useEffect } from "react";
import { Typography, Modal, Box, Grid, Grow } from "@mui/material";
import { IOrder } from "../../shared/interfaces/orderInterfaces";
import StyledButton from "../UI/Styled/StyledButton";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { cancelOrderAction } from "../../store/ordersSlice";
import { useNavigate } from "react-router-dom";

interface IProps {
  order: IOrder;
  open: boolean;
  handleClose: () => void;
}

const CancelOrderModal: FC<IProps> = (props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const apiState = useAppSelector((state) => state.orders.apiState);
  const [requestSent, setRequestSent] = useState<boolean>(false);

  const handleCancel = () => {
    dispatch(cancelOrderAction(props.order.id));
    setRequestSent(true);
    props.handleClose();
  };
  
  useEffect(() => {
    if (!requestSent) {
      return;
    }

    if (!(apiState === "COMPLETED")) {
      return;
    }

    navigate("/active-orders");
  }, [requestSent, dispatch, navigate, apiState]);

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
              You are about to cancel your order. Proceed?
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
                  onClick={handleCancel}
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

export default CancelOrderModal;
