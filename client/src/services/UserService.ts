import { axiosClient } from "./axiosClient";
import { API } from "../constants/Constants";
import { IUserLogin } from "../shared/interfaces/userInterfaces";

export const Login = async (userLogin: IUserLogin) => {
    return await axiosClient.post(`${API}/users/login`, userLogin);
}

export const GetUserById = async (id: string) => {
    return await axiosClient.get(`${API}/users/${id}`);
}

export const UpdateUser = async (id: string, data: FormData) => {
    return await axiosClient.put(`${API}/users/${id}`, data);
}