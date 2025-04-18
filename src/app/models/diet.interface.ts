import { IProduct } from "./product.interface";

export enum dietTypeEnum {
    "Завтрак",
    "Обед",
    "Ужин",
    "Перекус",
}

export interface IDiet {
    id: string;
    type: dietTypeEnum;
    product: IProduct;
    weight: number;
    creationDate: string;
}

export interface ICreateDietDto {
    type: dietTypeEnum;
    productId: string;
    weight: number;
}
