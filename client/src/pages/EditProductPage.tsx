import React, { FC, useEffect } from 'react';
import { Container, CssBaseline } from "@mui/material";
import EditProductForm from '../components/EditProduct/EditProductForm';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import LoadingModal from '../components/UI/Modal/LoadingModal';
import PageTitle from '../components/UI/Title/PageTitle';
import { getProductByIdAction } from '../store/productsSlice';
import { useParams } from 'react-router-dom';

const EditProductPage: FC = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const id = params.productId || "";

    const apiState = useAppSelector((state) => state.products.apiState);

    useEffect(() => {
        dispatch(getProductByIdAction(id));
    }, [dispatch, id]);

    return (
        <>
            <Container component="main">
                <CssBaseline />
                <PageTitle title="Edit Product" />
                <EditProductForm />
            </Container>
            <LoadingModal show={apiState === "PENDING"} />
        </>
    );
}

export default EditProductPage;