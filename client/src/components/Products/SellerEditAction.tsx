import React, { FC } from "react";
import { Typography } from "@mui/material";
import { IProduct } from "../../shared/interfaces/productsInterfaces";
import { useAppDispatch } from "../../store/hooks";
import { addToCart } from "../../store/cartSlice";
import StyledButton from "../UI/Styled/StyledButton";

interface IProps {
  item: IProduct;
}

const SellerEditAction: FC<IProps> = (props) => {
  const dispatch = useAppDispatch();

  const handleAdd = () => {
    dispatch(addToCart(props.item));
  };

  return (
    <StyledButton
      onClick={handleAdd}
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
      <Typography fontWeight={"bold"}>EDIT</Typography>
    </StyledButton>
  );
};

export default SellerEditAction;
