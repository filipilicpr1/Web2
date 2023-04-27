import React, { FC, useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Button, Grid, Card, Grow, Zoom } from "@mui/material";
import EditProductFormItem from './EditProductFormItem';
import EditProductImagePicker from './EditProductImagePicker';
import { updateProductAction } from '../../store/productsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { clearEditProduct } from '../../store/productsSlice';

const EditProductForm: FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const product = useAppSelector((state) => state.products.editProduct);
    const imagePicker = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState(product?.imageSource);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const params = useParams();
    const productId = params.productId;

    useEffect(() => {
        return() => {
            dispatch(clearEditProduct());
        }
    }, [dispatch]);

    useEffect(() => {
        setImage(product?.imageSource);
    }, [product]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (product === null) {
            return;
        }

        const data = new FormData(event.currentTarget);
        if (uploadedImage !== null) {
            data.append("image", uploadedImage);
        }

        dispatch(updateProductAction({ id: productId || "", data: data }));
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

    const backHandler = () => {
        navigate("/my-products");
    }

    return (
        <>
            {product !== null && <Grow in={true}>
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
                                <EditProductFormItem
                                    id="name"
                                    label="Name"
                                    initialValue={product?.name}
                                    type="text"
                                />
                                <EditProductFormItem
                                    id="description"
                                    label="Description"
                                    initialValue={product?.description}
                                    type="text"
                                />
                                <EditProductFormItem
                                    id="amount"
                                    label="Amount"
                                    initialValue={product?.amount}
                                    type='number'
                                />
                                <EditProductFormItem
                                    id="price"
                                    label="Price"
                                    initialValue={product?.price}
                                    type='number'
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
                                    height: 340,
                                    boxShadow:
                                        "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
                                }}
                            >
                                <EditProductImagePicker
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
                        <Grid item xs={6} sx={{display: "flex", flexDirection: "row", justifyContent: "flex-start"}}>
                            <Button
                                onClick={backHandler}
                                variant="contained"
                                sx={{
                                    mt: 6,
                                    mb: 2,
                                    ml: -15,
                                    bgcolor: "green",
                                    alignSelf: "flex-end",
                                    width: 140,
                                    height: 40,
                                    backgroundColor: "primary"
                                }}
                            >
                                MY PRODUCTS
                            </Button>
                        </Grid>

                        <Grid item xs={6} sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
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
                    </Grid>
                </Grid>
            </Grow>}
        </>
    );
}

export default EditProductForm;