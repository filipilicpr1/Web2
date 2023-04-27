import { axiosClient } from "./axiosClient";
import { API } from "../constants/Constants";
import { ICreateOrder } from "../shared/interfaces/orderInterfaces";

export const CreateOrder = async (data: ICreateOrder) => {
    return await axiosClient.post(`${API}/orders`, data);
}