import React, { FC } from "react";
import {
  Typography,
  Modal,
  Box,
  Grid,
  Button,
  Grow,
  TextField,
} from "@mui/material";
import StyledButton from "../UI/Styled/StyledButton";

interface IProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (deliveryAddress: string, comment: string) => void;
}

const CheckoutModal: FC<IProps> = (props) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const address = data.get("address");
    const comment = data.get("comment");
    if (address === null || comment === null) {
      return;
    }

    props.handleSubmit(address.toString(), comment.toString());
    props.handleClose();
  };
  return (
    <Modal open={props.open}>
      <Grow in={props.open}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "30%",
            left: "30%",
            transform: "translate(-50%, -50%)",
            width: 600,
            backgroundColor: "#4d4855",
            backgroundImage: "linear-gradient(147deg, #4d4855 0%, #000000 74%)",
            border: "2px solid #000",
            borderRadius: "20px",
            boxShadow:
              "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",

            pt: 2,
            pl: 6,
            pb: 3,
          }}
        >
          <Grid
            component={"form"}
            onSubmit={handleSubmit}
            container
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Typography
              variant="h5"
              fontWeight={"bold"}
              textAlign={"center"}
              sx={{ mr: 3 }}
            >
              Finish Checkout
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="address"
              label="Delivery Address"
              name="address"
              autoComplete="address"
              sx={{
                pr: 6,
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="comment"
              label="Comment"
              name="comment"
              autoComplete="comment"
              sx={{
                pr: 6,
              }}
            />
            <Grid item sx={{ display: "flex", flexDirection: "row", mt: 2 }}>
              <Grid item xs={6}>
                <StyledButton
                  onClick={props.handleClose}
                  sx={{
                    width: "80%",
                    borderRadius: "25px",
                    bgcolor: "#3f0d12",
                    backgroundImage:
                      "linear-gradient(315deg, #3f0d12 0%, #a71d31 74%)",
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
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  sx={{
                    transition: "transform 0.35s ease-in-out",
                    cursor: "pointer",
                    "&:hover": { transform: "scale3d(1.09, 1.09, 1)" },
                    width: "80%",
                    borderRadius: "25px",
                    bgcolor: "#0cbaba",
                    backgroundImage:
                      "linear-gradient(315deg, #0cbaba 0%, #380036 74%)",
                    order: 4,
                    mb: 2,
                    ml: 1,
                  }}
                >
                  <Typography fontWeight={"bold"}>ORDER</Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grow>
    </Modal>
  );
};

export default CheckoutModal;
