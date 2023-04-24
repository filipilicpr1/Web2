import React, { FC } from "react";
import { CardActions, Typography } from "@mui/material";
import { IProduct } from "../../shared/interfaces/productsInterfaces";
import { useAppDispatch } from "../../store/hooks";
import { addToCart } from "../../store/cartSlice";
import StyledButton from "../UI/Styled/StyledButton";

interface IProps {
  item: IProduct;
}

const SellerProductActions: FC<IProps> = (props) => {
  const dispatch = useAppDispatch();

  const handleAdd = () => {
    dispatch(addToCart(props.item));
  };

  return (
    <CardActions
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <StyledButton
        onClick={handleAdd}
        sx={{
          width: "90%",
          borderRadius: "30%",
          bgcolor: "#ba2d0b",
          backgroundImage:
            "linear-gradient(319deg, #ba2d0b 0%, #fe7f2d 37%, #ffbf46 100%)",
        }}
      >
        <Typography fontWeight={"bold"}>EDIT</Typography>
      </StyledButton>

      <StyledButton
        onClick={handleAdd}
        sx={{
          mt: 2,
          mr: 1,
          mb: 1,
          width: "90%",
          borderRadius: "30%",
          bgcolor: "#c62128",
          backgroundImage:
            "linear-gradient(147deg, #c62128 0%, #a00000 74%)",
        }}
      >
        <Typography fontWeight={"bold"}>DELETE</Typography>
      </StyledButton>
    </CardActions>
  );
};

export default SellerProductActions;
