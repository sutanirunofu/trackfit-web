import { IDiet } from "./diet.interface";

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
    registrationDate: string;
    modificationDate: string;
}

export interface IUserUpdateModel {
    firstName?: string;
    sex?: number;
    birthday?: string;
    height?: number;
    weight?: number;
    goal?: IUserGoal;
    avatar?: string;
}