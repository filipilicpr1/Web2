import { axiosClient } from "./axiosClient";
import { API } from "../constants/Constants";
import { IUserLogin } from "../shared/interfaces/userInterfaces";

export const Login = async (userLogin: IUserLogin) => {
    return await axiosClient.post(`${API}/users/login`, userLogin);
}