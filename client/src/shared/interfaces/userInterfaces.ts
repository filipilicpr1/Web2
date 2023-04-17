import { UserType } from "../types/enumerations"

export interface IUser {
    id: string,
    name: string,
    lastName: string,
    username: string,
    email: string,
    userType: UserType,
    isVerified: boolean,
    imageSource: string
}

export interface IUserLogin {
    email: string,
    password: string
}