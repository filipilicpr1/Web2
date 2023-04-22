import { axiosClient } from "./axiosClient";
import { API } from "../constants/Constants";
import { IUserLogin, IChangePassword, IUserRegister, IAuth } from "../shared/interfaces/userInterfaces";

export const Login = async (userLogin: IUserLogin) => {
    return await axiosClient.post(`${API}/users/login`, userLogin);
}

export const GetUserById = async (id: string) => {
    return await axiosClient.get(`${API}/users/${id}`);
}

export const UpdateUser = async (id: string, data: FormData) => {
    return await axiosClient.put(`${API}/users/${id}`, data);
}

export const ChangePassword = async (id: string, data: IChangePassword) => {
    return await axiosClient.put(`${API}/users/${id}/change-password`, data);
}

export const Register = async (data: IUserRegister) => {
    return await axiosClient.post(`${API}/users`, data);
}

export const LoginGoogle = async (data: IAuth) => {
    return await axiosClient.post(`${API}/users/google-login`, data);
}