import React, { FC } from "react";
import { CardActions, Typography } from "@mui/material";
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
        <CardActions sx={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
          <StyledButton
            onClick={handleAdd}
            sx={{
              width: "90%",
              borderRadius: "30%",
              bgcolor: "#bdd4e7",
              backgroundImage:
                "linear-gradient(315deg, #bdd4e7 0%, #8693ab 74%)",
            }}
          >
            <Typography fontWeight={"bold"}>ADD TO CART</Typography>
          </StyledButton>
        </CardActions>
      )}
    </>
  );
};

export default AddProductActions;
