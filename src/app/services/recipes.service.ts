import { inject, Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { StorageService } from "./storage.service";
import { BehaviorSubject, finalize, Observable } from "rxjs";
import { ICreateRecipeModel, IRecipe, IUpdateRecipeModel } from "app/models/recipe.interface";

@Injectable({
    providedIn: "root",
})
export class RecipesService {
    private readonly http = inject(HttpService);
    private readonly storage = inject(StorageService);
    private readonly isReady$ = new BehaviorSubject<boolean>(true);

    public getIsReady$(): Observable<boolean> {
        return this.isReady$.asObservable();
    }

    public getIsReadyValue(): boolean {
        return this.isReady$.getValue();
    }

    public getAll$(): Observable<IRecipe[]> {
        this.isReady$.next(false);
        return this.http.get<IRecipe[]>("/Recipe").pipe(finalize(() => this.isReady$.next(true)));
    }

    public getById$(id: string): Observable<IRecipe> {
        this.isReady$.next(false);
        return this.http.get<IRecipe>(`/Recipe/${id}`).pipe(finalize(() => this.isReady$.next(true)));
    }

    public add$(createRecipeModel: ICreateRecipeModel): Observable<void> {
        this.isReady$.next(false);
        return this.http
            .post<ICreateRecipeModel, void>("/Recipe", createRecipeModel)
            .pipe(finalize(() => this.isReady$.next(true)));
    }

    public updateById$(id: string, updateRecipeModel: IUpdateRecipeModel): Observable<void> {
        this.isReady$.next(false);
        return this.http
            .patch<IUpdateRecipeModel, void>(`/Recipe/${id}`, updateRecipeModel)
            .pipe(finalize(() => this.isReady$.next(true)));
    }

    public deleteById$(id: string): Observable<void> {
        this.isReady$.next(false);
        return this.http.delete<void>(`/Recipe/${id}`).pipe(finalize(() => this.isReady$.next(true)));
    }
}
