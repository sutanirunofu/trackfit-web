export interface IRecipe {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    creationDate: Date;
    modificationDate: Date;
}

export interface ICreateRecipeModel {
    title: string;
    description: string;
    imageUrl: string;
}

export interface IUpdateRecipeModel {
    title?: string;
    description?: string;
    imageUrl?: string;
}