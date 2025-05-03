import { IUser } from "./user.interface";

export interface ITraining {
    id: string;
    author: IUser;
    title: string;
    body: string;
    previewUrl: string;
    videoUrl?: string;
    creationDate: Date;
    modificationDate: Date;
}

export interface ICreateTrainingModel {
    title: string;
    body: string;
    previewUrl: string;
    videoUrl?: string;
}

export interface IUpdateTrainingModel {
    title?: string;
    body?: string;
    previewUrl?: string;
    videoUrl?: string;
}