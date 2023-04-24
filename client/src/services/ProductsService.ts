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