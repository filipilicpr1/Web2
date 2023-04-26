import React, { FC, useEffect, useState } from "react";
import { Typography, Modal, Box, Grid, CardMedia } from "@mui/material";
import StyledButton from "../UI/Styled/StyledButton";
import { IProduct } from "../../shared/interfaces/productsInterfaces";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { deleteProductAction, getAllProductsBySellerAction } from "../../store/productsSlice";
import { changePage } from "../../store/productsSlice";

interface IProps {
  open: boolean;
  handleClose: () => void;
  item: IProduct;
}

const SellerDeleteModal: FC<IProps> = (props) => {
  const dispatch = useAppDispatch();
  const page = useAppSelector((state) => state.products.page);
  const user = useAppSelector((state) => state.user.user);
  const id = user !== null ? user.id : "";
  const apiState = useAppSelector((state) => state.products.apiState);
  const [requestSent, setRequestSent] = useState<boolean>(false);

  const handleDelete = () => {
    dispatch(deleteProductAction(props.item.id));
    setRequestSent(true);
    props.handleClose();
  };

  useEffect(() => {
    if(!requestSent)
    {
        return;
    }

    if (!(apiState === "COMPLETED")) {
        return;
      }

    if(page !== 1)
    {
        dispatch(changePage(1));
        setRequestSent(false);
        return;
    }
    
    dispatch(getAllProductsBySellerAction({id: id, query: ""}));
    setRequestSent(false);
  }, [requestSent,dispatch, page, id, apiState]);



  return (
    <Modal open={props.open}>
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          backgroundColor: "#4d4855",
          backgroundImage: "linear-gradient(147deg, #4d4855 0%, #000000 74%)",
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
            Are you sure you want to delete the product:
          </Typography>
          <Box
            className={"product-image"}
            sx={{
              height: "auto",
              width: "50%",
              p: 3,
              m: "28",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Box
              sx={{
                borderRadius: "25px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <CardMedia
                component="img"
                image={props.item.imageSource}
                height="auto"
                alt="pic"
                sx={{
                  transition: "transform 0.35s ease-in-out",
                  borderRadius: "25px",
                }}
              />
            </Box>
            <Typography variant="h5" fontWeight={"bold"} ml={4} mt={1}>
              {props.item.name}
            </Typography>
          </Box>
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
                <Typography fontWeight={"bold"}>CANCEL</Typography>
              </StyledButton>
            </Grid>
            <Grid item xs={6}>
              <StyledButton
                onClick={handleDelete}
                sx={{
                  width: "80%",
                  borderRadius: "25px",
                  bgcolor: "#990000",
                  backgroundImage:
                    "linear-gradient(147deg, #990000 0%, #ff0000 74%)",
                  order: 4,
                  mb: 2,
                  "&:hover": {
                    "&~.product-image img": {
                      transform: "scale3d(1.09, 1.09, 1)",
                    },
                  },
                }}
              >
                <Typography fontWeight={"bold"}>DELETE</Typography>
              </StyledButton>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default SellerDeleteModal;
