import { axiosClient } from "./axiosClient";
import { API } from "../constants/Constants";

export const AddProduct = async (newProduct: FormData) => {
    return await axiosClient.post(`${API}/products`, newProduct);
}