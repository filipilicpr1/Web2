import React, { FC, useState, useRef, useEffect } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  Zoom
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import NewProductImagePicker from "./NewProductImagePicker";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { addProductAction } from "../../store/productsSlice";
import { useNavigate } from "react-router-dom";

const NewProductForm: FC = () => {
    const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const id = user ? user.id : "";
  const apiState = useAppSelector((state) => state.products.apiState);
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const [isNameValid, setIsNameValid] = useState<boolean>(false);
  const [isNameTouched, setIsNameTouched] = useState<boolean>(false);
  const [isDescriptionValid, setIsDescriptionValid] = useState<boolean>(false);
  const [isDescriptionTouched, setIsDescriptionTouched] =
    useState<boolean>(false);
  const [isAmountValid, setIsAmountValid] = useState<boolean>(false);
  const [isAmountTouched, setIsAmountTouched] = useState<boolean>(false);
  const [isPriceValid, setIsPriceValid] = useState<boolean>(false);
  const [isPriceTouched, setIsPriceTouched] = useState<boolean>(false);
  const imagePicker = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | undefined>("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const nameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsNameValid(event.target.value.trim().length > 0);
  };

  const nameBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsNameTouched(true);
  };

  const descriptionChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsDescriptionValid(event.target.value.trim().length > 0);
  };

  const descriptionBlurHandler = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    setIsDescriptionTouched(true);
  };

  const amountChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAmountValid(
      !isNaN(event.target.value as unknown as number) &&
        (event.target.value as unknown as number) > 0
    );
  };

  const amountBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsAmountTouched(true);
  };

  const priceChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPriceValid(
      !isNaN(event.target.value as unknown as number) &&
        (event.target.value as unknown as number) > 0
    );
  };

  const priceBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsPriceTouched(true);
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = data.get("name");
    const description = data.get("description");
    const amount = data.get("amount");
    const price = data.get("price");
    if (
      name == null ||
      description == null ||
      amount == null ||
      price == null
    ) {
      return;
    }
    if (uploadedImage !== null) {
      data.append("imageSource", uploadedImage);
    }
    data.append("sellerId", id);
    
    dispatch(addProductAction(data));
    setRequestSent(true);
  };

  useEffect(() => {
    if (!requestSent) {
      return;
    }

    if (!(apiState === "COMPLETED")) {
      return;
    }
    navigate("/");
  }, [apiState, navigate, requestSent]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Zoom in={true}>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "info.main" }}>
            <AddShoppingCartIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add a product
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              error={isNameTouched && !isNameValid}
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              onChange={nameChangeHandler}
              onBlur={nameBlurHandler}
            />
            <TextField
              margin="normal"
              required
              error={isDescriptionTouched && !isDescriptionValid}
              fullWidth
              name="description"
              label="Description"
              id="description"
              autoComplete="description"
              onChange={descriptionChangeHandler}
              onBlur={descriptionBlurHandler}
            />
            <TextField
              margin="normal"
              required
              error={isAmountTouched && !isAmountValid}
              fullWidth
              name="amount"
              label="Amount"
              type="number"
              id="amount"
              autoComplete="amount"
              onChange={amountChangeHandler}
              onBlur={amountBlurHandler}
            />
            <TextField
              margin="normal"
              required
              error={isPriceTouched && !isPriceValid}
              fullWidth
              name="price"
              label="Price"
              type="number"
              id="price"
              autoComplete="price"
              onChange={priceChangeHandler}
              onBlur={priceBlurHandler}
            />
            <NewProductImagePicker
              image={image}
              imagePicker={imagePicker}
              uploadHandler={imageChangeHandler}
              avatarClickHandler={imageUploadHandler}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isNameValid || !isDescriptionValid || !isAmountValid}
              sx={{ mt: 3, mb: 2 }}
            >
              ADD
            </Button>
          </Box>
        </Box>
      </Zoom>
    </Container>
  );
};

export default NewProductForm;
