import React, { FC, useState } from "react";
import { IconButton, Box, Input, Avatar } from "@mui/material";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

interface IProps {
  image: string | undefined;
  avatarClickHandler: () => void;
  imagePicker: React.RefObject<HTMLInputElement>;
  uploadHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const NewProductImagePicker: FC<IProps> = (props) => {
    const [imageUploaded, setImageUploaded] = useState<boolean>(false);

    const imageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageUploaded(true);
        props.uploadHandler(event);
      };

  return (
    <>
      <IconButton
        sx={{ width: "220px", height: "220px", ml: 11 }}
        onClick={props.avatarClickHandler}
      >
        <Avatar
          sx={{ width: "200px", height: "200px" }}
          alt="pic"
          src={props.image}
        >
            {!imageUploaded && <AddAPhotoIcon />}
        </Avatar>
      </IconButton>
      <Box sx={{ display: "none" }}>
        <Input
          ref={props.imagePicker}
          type="file"
          onChange={imageChangeHandler}
          inputProps={{ accept: ".png, .jpg, .jpeg" }}
        />
      </Box>
    </>
  );
};

export default NewProductImagePicker;
