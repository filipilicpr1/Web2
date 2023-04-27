import React, { FC, useState, useRef } from "react";
import { Button, Grid, Card, Grow, Zoom } from "@mui/material";
import ProfileFormItem from "./ProfileFormItem";
import ProfileFormDate from "./ProfileFormDate";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { updateUserAction } from "../../store/userSlice";
import ProfileImagePicker from "./ProfileImagePicker";
import ProfileVerificationIcon from "./ProfileVerificationIcon";

const ProfileForm: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const [date, setDate] = useState<Date | null>(user ? new Date(user.birthDate) : new Date());
  const imagePicker = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState(user?.imageSource);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const dateChangeHandler = (value: Date | null) => {
    setDate(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user === null) {
      return;
    }

    const data = new FormData(event.currentTarget);
    if (date !== null) {
      date.setHours(12);
      data.append("birthDate", date.toISOString());
    }
    if (uploadedImage !== null) {
      data.append("image", uploadedImage);
    }

    dispatch(updateUserAction({ id: user.id, data: data }));
  };

  const imageUploadHandler = () => {
    if (!imagePicker.current) {
      return;
    }
    (imagePicker.current.children[0] as HTMLInputElement).click();
  };

  const imageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      setUploadedImage(file);
      reader.readAsDataURL(file);
      reader.onloadend = function (e) {
        setImage(reader.result?.toString());
      };
    }
  };

  return (
    <Grow in={true}>
      <Grid component="form" container onSubmit={handleSubmit}>
        <Zoom in={true}>
          <Grid item xs={6}>
            <Card
              sx={{
                margin: "1rem",
                mt: 6,
                pb: 2,
                pl: 3,
                marginLeft: "-8rem",
                borderRadius: "20px",
                backgroundColor: "#2d3436",
                backgroundImage: "linear-gradient(315deg, #2d3436 0%, #000000 74%)",
                boxShadow:
                  "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
              }}
            >
              <ProfileFormItem
                id="name"
                label="Name"
                initialValue={user?.name}
              />
              <ProfileFormItem
                id="lastName"
                label="Last Name"
                initialValue={user?.lastName}
              />
              <ProfileFormItem
                id="address"
                label="Address"
                initialValue={user?.address}
              />
              <ProfileFormDate
                id="date"
                label="Date"
                initialValue={user?.birthDate}
                setValue={dateChangeHandler}
              />
            </Card>
          </Grid>
        </Zoom>
        <Zoom in={true}>
          <Grid item xs={6}>
            <Card
              sx={{
                margin: "1rem",
                mt: 6,
                marginRight: "-8rem",
                borderRadius: "20px",
                backgroundColor: "#2d3436",
                backgroundImage: "linear-gradient(315deg, #2d3436 0%, #000000 74%)",
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                textAlign: "center",
                justifyContent: "center",
                height: 330,
                boxShadow:
                  "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
              }}
            >
              <ProfileImagePicker
                image={image}
                imagePicker={imagePicker}
                uploadHandler={imageChangeHandler}
                avatarClickHandler={imageUploadHandler}
              />
            </Card>
          </Grid>
        </Zoom>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 6,
              mb: 2,
              mr: -15,
              bgcolor: "green",
              alignSelf: "flex-end",
              width: 120,
              height: 40,
            }}
          >
            Save
          </Button>
        </Grid>
        <ProfileVerificationIcon
          verificationStatus={user?.verificationStatus}
        />
      </Grid>
    </Grow>
  );
};

export default ProfileForm;
