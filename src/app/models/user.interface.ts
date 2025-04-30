import { IDiet } from "./diet.interface";
import { IProduct } from "./product.interface";
import { IWaterDiet } from "./water.interface";

export interface IUserGoalType {
    id: string;
    name: string;
}

export interface IUserGoal {
    id: string;
    type: IUserGoalType;
    weight: number;
}

export interface IUser {
    id: string;
    username: string;
    firstName: string;
    sex: number;
    birthday: string;
    height: number;
    weight: number;
    goal: IUserGoal;
    avatar?: string;
    diets: IDiet[];
    products: IProduct[];
    waterDiets: IWaterDiet[];
    registrationDate: string;
    modificationDate: string;
}

export interface IUserUpdateModel {
    firstName?: string;
    sex?: number;
    birthday?: string;
    height?: number;
    weight?: number;
    goalTypeName?: string;
    goalWeight?: number;
    avatar?: string;
}

export interface ICreateUserProductModel {
    name: string;
    calories?: number;
    proteins?: number;
    fats?: number;
    carbohydrates?: number;
}