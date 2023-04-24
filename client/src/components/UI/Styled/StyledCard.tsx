import React, { FC } from "react";
import { Card, SxProps, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";

const MyStyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.35s ease-in-out",
  cursor: "pointer",
  "&:hover": { transform: "scale3d(1.1, 1.1, 1)" },
}));

interface IProps {
    children: React.ReactNode,
    sx: SxProps<Theme> | undefined
}

const StyledCard : FC<IProps> = (props) => {
    return(
        <MyStyledCard sx={props.sx}>
            {props.children}
        </MyStyledCard>
    );
}

export default StyledCard;