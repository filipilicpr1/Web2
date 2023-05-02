import React, { FC } from "react";
import { useAppSelector } from "../../store/hooks";
import { Card, Grow, Box } from "@mui/material";
import DetailedPageItem from "../UI/DetailedPage/DetailedPageItem";
import DetailedPageImage from "../UI/DetailedPage/DetailedPageImage";
import DetailedSellerActions from "./DetailedSellerActions";

const DetailedSeller: FC = () => {
  const seller = useAppSelector((state) => state.verification.detailedSeller);

  return (
    <>
      {seller !== null && (
        <Grow in={true}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Card
              sx={{
                margin: "1rem",
                mt: 6,
                pb: 2,
                pl: 3,
                pt: 2,
                width: "80%",
                borderRadius: "20px",
                backgroundColor: "#2d3436",
                backgroundImage:
                  "linear-gradient(315deg, #2d3436 0%, #000000 74%)",
                boxShadow:
                  "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
              }}
            >
              <DetailedPageImage image={seller.imageSource} />
              <DetailedPageItem
                id="name"
                label="Full Name"
                value={seller.name + " " + seller.lastName}
              />
              <DetailedPageItem
                id="email"
                label="Email"
                value={seller.email}
              />
              <DetailedPageItem
                id="username"
                label="Username"
                value={seller.username}
              />
              <DetailedPageItem
                id="address"
                label="Address"
                value={seller.address}
              />
              <DetailedPageItem
                id="birthDate"
                label="Birth Date"
                value={
                  new Date(seller.birthDate)
                    .toLocaleString("en-GB")
                    .split(",")[0]
                }
              />
              <DetailedPageItem
                id="status"
                label="Status"
                value={seller.verificationStatus}
              />
            </Card>
            <DetailedSellerActions seller={seller} />
          </Box>
        </Grow>
      )}
    </>
  );
};

export default DetailedSeller;
