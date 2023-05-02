import React, { FC, useState } from "react";
import { Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { IOrder } from "../../shared/interfaces/orderInterfaces";
import CancelOrderModal from "./CancelOrderModal";

interface IProps {
  order: IOrder;
}

const DetailedOrderActions: FC<IProps> = (props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user.user);
  const showCancel =
    user !== null &&
    user.userType === "BUYER" &&
    user.id === props.order.buyer.id &&
    props.order.canCancel;

  const backHandler = () => {
    navigate(-1);
  };

  const closeHandler = () => {
    setOpen(false);
  };

  const openHandler = () => {
    setOpen(true);
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
          {showCancel && (
            <Button
              onClick={openHandler}
              variant="contained"
              sx={{
                mt: 6,
                mb: 2,
                mr: -15,
                bgcolor: "red",
                alignSelf: "flex-end",
                width: 120,
                height: 40,
              }}
            >
              Cancel
            </Button>
          )}
        </Grid>
      </Grid>
      <CancelOrderModal open={open} order={props.order} handleClose={closeHandler} />
    </>
  );
};

export default DetailedOrderActions;
