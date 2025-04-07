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
    birthday: string;
    height: number;
    weight: number;
    goal: IUserGoal;
}