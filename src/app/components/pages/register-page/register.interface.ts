export interface IRegisterModel {
    username: string;
    firstName: string;
    password: string;
    birthday: string;
    height: number;
    weight: number;
    goalType: string;
    goalWeight: number;
}

export interface IRegisterSuccessModel {
    token: string;
}