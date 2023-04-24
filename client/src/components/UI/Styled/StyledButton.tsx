import React, { FC } from "react";
import { Button, SxProps, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";

const MyStyledButton = styled(Button)(({ theme }) => ({
  transition: "transform 0.35s ease-in-out",
  cursor: "pointer",
  "&:hover": { transform: "scale3d(1.1, 1.1, 1)" },
}));

interface IProps {
    children: React.ReactNode,
    sx: SxProps<Theme> | undefined,
    onClick: () => void
}

const StyledButton : FC<IProps> = (props) => {
    return(
        <MyStyledButton size="large" variant="contained" onClick={props.onClick} sx={props.sx}>
            {props.children}
        </MyStyledButton>
    );
}

export default StyledButton;