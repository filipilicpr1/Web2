import { UserType, VerificationStatuses } from "../types/enumerations"

export interface IUser {
    id: string,
    name: string,
    lastName: string,
    username: string,
    email: string,
    address: string,
    birthDate: string,
    userType: UserType,
    isVerified: boolean,
    verificationStatus: VerificationStatuses,
    finishedRegistration: boolean,
    imageSource: string
}

export interface IUserMinimal {
    id: string,
    name: string,
    lastName: string,
    username: string,
    email: string,
    address: string,
    imageSource: string
}

export interface IUserLogin {
    email: string,
    password: string
}

export interface IUserUpdate {
    id: string,
    data: FormData
}

export interface IAuth {
    token: string
}

export interface IJwt {
    id: string
}

export interface IChangePassword {
    currentPassword: string,
    newPassword: string
}

export interface IUserRegister {
    name: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    birthDate: Date,
    address: string,
    userType: UserType
}

export interface IFinishRegistration {
    username: string,
    password: string,
    userType: UserType,
    address: string,
    birthDate: Date
}

export interface IVerifySeller {
    isAccepted: boolean
}