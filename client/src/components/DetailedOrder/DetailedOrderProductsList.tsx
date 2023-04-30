import React, { FC } from "react";
import { IProduct } from "../../shared/interfaces/productsInterfaces";
import { Box, Typography } from "@mui/material";
import DetailedOrderProduct from "./DetailedOrderProduct";

interface IProps {
  products: IProduct[];
}

const DetailedOrderProductsList: FC<IProps> = (props) => {
  return (
    <>
      <Box
        sx={{
          width: "95%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            borderRadius: "10px",
            border: "1px solid #AFAFAF",
            mt: 4,
            mb: 6,
            height: 55,
            width: "90%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontFamily={"cursive"}>
            Order Products
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: -2
        }}
      >
        {props.products.map((product) => (
          <DetailedOrderProduct key={product.id} item={product} />
        ))}
      </Box>
    </>
  );
};

export default DetailedOrderProductsList;
