import { IUserMinimal } from "./userInterfaces"
import { IProduct } from "./productsInterfaces"

export interface IOrderProduct {
    productId: string,
    amount: number
}

export interface ICreateOrder {
    buyerId: string,
    deliveryAddress: string,
    comment: string,
    orderProducts: IOrderProduct[]
}

export interface IOrder {
    id: string,
    deliveryAddress: string,
    comment: string,
    price: number,
    buyer: IUserMinimal,
    orderTime: string,
    deliveryTime: string,
    isCanceled: boolean,
    status: string,
    orderProducts: IProduct[]
}