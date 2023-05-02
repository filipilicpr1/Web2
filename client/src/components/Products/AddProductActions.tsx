import React, { FC } from "react";
import { Typography } from "@mui/material";
import { IProduct } from "../../shared/interfaces/productsInterfaces";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addToCart } from "../../store/cartSlice";
import StyledButton from "../UI/Styled/StyledButton";

interface IProps {
  item: IProduct;
}

const AddProductActions: FC<IProps> = (props) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const userIsBuyer = user && user.userType === "BUYER";

  const handleAdd = () => {
    dispatch(addToCart(props.item));
  };

  return (
    <>
      {userIsBuyer && (
        <StyledButton
          onClick={handleAdd}
          sx={{
            width: "80%",
            borderRadius: "25px",
            bgcolor: "#bdd4e7",
            backgroundImage: "linear-gradient(315deg, #bdd4e7 0%, #8693ab 74%)",
            order: 3,
            mb: 2,
            "&:hover": {
              "&+.product-image img": {
                transform: "scale3d(1.09, 1.09, 1)",
              },
            },
          }}
        >
          <Typography fontWeight={"bold"}>ADD TO CART</Typography>
        </StyledButton>
      )}
    </>
  );
};

export default AddProductActions;
