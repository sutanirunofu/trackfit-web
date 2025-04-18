export interface IRegisterModel {
    username: string;
    firstName: string;
    password: string;
    sex: number;
    birthday: string;
    height: number;
    weight: number;
    goalType: string;
    goalWeight: number;
}

export interface IRegisterSuccessModel {
    token: string;
}