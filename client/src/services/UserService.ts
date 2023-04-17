import axios from "axios";
import { API } from "../constants/Constants";
import { IUserLogin } from "../shared/interfaces/userInterfaces";

export const Login = async (userLogin: IUserLogin) => {
    return await axios.post(`${API}/users/login`, userLogin);
}