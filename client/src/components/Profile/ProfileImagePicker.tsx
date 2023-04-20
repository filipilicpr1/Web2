import React, { FC } from "react";
import { IconButton, Box, Input, Avatar } from "@mui/material";

interface IProps {
  image: string | undefined;
  avatarClickHandler: () => void;
  imagePicker: React.RefObject<HTMLInputElement>;
  uploadHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileImagePicker: FC<IProps> = (props) => {
  return (
    <>
      <IconButton
        sx={{ width: "320px", height: "320px", ml: 22 }}
        onClick={props.avatarClickHandler}
      >
        <Avatar
          sx={{ width: "300px", height: "300px" }}
          alt="pic"
          src={props.image}
        />
      </IconButton>
      <Box sx={{ display: "none" }}>
        <Input
          ref={props.imagePicker}
          type="file"
          onChange={props.uploadHandler}
          inputProps={{ accept: ".png, .jpg, .jpeg" }}
        />
      </Box>
    </>
  );
};

export default ProfileImagePicker;
