import { inject, Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { BehaviorSubject, finalize, Observable } from "rxjs";
import { ICreateWaterDietModel, IUpdateWaterDietModel, IWaterDiet } from "app/models/water.interface";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: "root",
})
export class WaterService {
    private readonly http = inject(HttpService);
    private readonly storage = inject(StorageService);
    private readonly isReady$ = new BehaviorSubject<boolean>(true);

    public getIsReady$(): Observable<boolean> {
        return this.isReady$.asObservable();
    }

    public getIsReadyValue(): boolean {
        return this.isReady$.getValue();
    }

    public getAll$(): Observable<IWaterDiet[]> {
        this.isReady$.next(false);

        return this.http
            .get<IWaterDiet[]>("/WaterDiet", {
                Authorization: `Bearer ${this.storage.getAccessToken()}`,
            })
            .pipe(finalize(() => this.isReady$.next(true)));
    }

    public getById$(id: string): Observable<IWaterDiet> {
        this.isReady$.next(false);

        return this.http
            .get<IWaterDiet>(`/WaterDiet/${id}`, {
                Authorization: `Bearer ${this.storage.getAccessToken()}`,
            })
            .pipe(finalize(() => this.isReady$.next(true)));
    }

    public create$(createWaterDietModel: ICreateWaterDietModel): Observable<IWaterDiet> {
        this.isReady$.next(false);

        return this.http
            .post<ICreateWaterDietModel, IWaterDiet>("/WaterDiet", createWaterDietModel, {
                Authorization: `Bearer ${this.storage.getAccessToken()}`,
            })
            .pipe(finalize(() => this.isReady$.next(true)));
    }

    public updateById$(id: string, updateWaterDietModel: IUpdateWaterDietModel): Observable<IWaterDiet> {
        this.isReady$.next(false);

        return this.http
            .patch<IUpdateWaterDietModel, IWaterDiet>(`/WaterDiet/${id}`, updateWaterDietModel, {
                Authorization: `Bearer ${this.storage.getAccessToken()}`,
            })
            .pipe(finalize(() => this.isReady$.next(true)));
    }

    public deleteById$(id: string): Observable<void> {
        this.isReady$.next(false);

        return this.http
            .delete<void>(`/WaterDiet/${id}`, {
                Authorization: `Bearer ${this.storage.getAccessToken()}`,
            })
            .pipe(finalize(() => this.isReady$.next(true)));
    }
}
