import { axiosClient } from "./axiosClient";
import { API } from "../constants/Constants";

export const AddProduct = async (newProduct: FormData) => {
    return await axiosClient.post(`${API}/products`, newProduct);
}

export const GetAllProducts = async (query: string) => {
    return await axiosClient.get(`${API}/products${query}`);
}

export const GetAllProductsBySeller = async (id:string, query: string) => {
    return await axiosClient.get(`${API}/products/seller/${id}${query}`);
}

export const DeleteProduct = async (id:string) => {
    return await axiosClient.delete(`${API}/products/${id}`);
}

export const GetProductById = async (id: string) => {
    return await axiosClient.get(`${API}/products/${id}`);
}

export const UpdateProduct = async (id: string, product: FormData) => {
    return await axiosClient.put(`${API}/products/${id}`, product);
}