import { IUserMinimal } from "./userInterfaces"

export interface IProduct {
    id: string,
    name: string,
    description: string,
    amount: number,
    price: number,
    imageSource: string,
    seller: IUserMinimal
}