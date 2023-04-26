import React, { FC } from "react";
import { Typography } from "@mui/material";
import { IProduct } from "../../shared/interfaces/productsInterfaces";
import StyledButton from "../UI/Styled/StyledButton";

interface IProps {
  item: IProduct;
  handleClick: () => void
}

const SellerDeleteAction: FC<IProps> = (props) => {

  return (
    <StyledButton
      onClick={props.handleClick}
      sx={{
        width: "80%",
        borderRadius: "25px",
        bgcolor: "#990000",
        backgroundImage: "linear-gradient(147deg, #990000 0%, #ff0000 74%)",
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
  );
};

export default SellerDeleteAction;
