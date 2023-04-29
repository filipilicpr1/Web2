import { axiosClient } from "./axiosClient";
import { API } from "../constants/Constants";
import { ICreateOrder } from "../shared/interfaces/orderInterfaces";

export const CreateOrder = async (data: ICreateOrder) => {
    return await axiosClient.post(`${API}/orders`, data);
}

export const GetDeliveredOrCanceledOrdersBySeller = async (id:string, query: string) => {
    return await axiosClient.get(`${API}/orders/seller/${id}/delivered-or-canceled${query}`);
}

export const GetAllOrders = async (query: string) => {
    return await axiosClient.get(`${API}/orders${query}`);
}