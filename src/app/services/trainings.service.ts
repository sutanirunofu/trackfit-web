import { inject, Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { StorageService } from "./storage.service";
import { BehaviorSubject, finalize, Observable } from "rxjs";
import { ICreateTrainingModel, ITraining, IUpdateTrainingModel } from "app/models/training.interface";

@Injectable({
    providedIn: "root",
})
export class TrainingsService {
    private readonly http = inject(HttpService);
    private readonly storage = inject(StorageService);
    private readonly isReady$ = new BehaviorSubject<boolean>(true);

    public getIsReady$(): Observable<boolean> {
        return this.isReady$.asObservable();
    }

    public getIsReadyValue(): boolean {
        return this.isReady$.getValue();
    }

    public getAll$(): Observable<ITraining[]> {
        this.isReady$.next(false);
        return this.http.get<ITraining[]>("/Training").pipe(finalize(() => this.isReady$.next(true)));
    }

    public getById$(trainingId: string): Observable<ITraining> {
        this.isReady$.next(false);
        return this.http.get<ITraining>(`/Training/${trainingId}`).pipe(finalize(() => this.isReady$.next(true)));
    }

    public create$(createTrainingModel: ICreateTrainingModel): Observable<ITraining> {
        this.isReady$.next(false);
        return this.http
            .post<ICreateTrainingModel, ITraining>("/Training", createTrainingModel, {
                Authorization: `Bearer ${this.storage.getAccessToken()}`,
            })
            .pipe(finalize(() => this.isReady$.next(true)));
    }

    public updateById$(trainingId: string, updateTrainingModel: IUpdateTrainingModel): Observable<void> {
        this.isReady$.next(false);
        return this.http
            .patch<IUpdateTrainingModel, void>(`/Training/${trainingId}`, updateTrainingModel, {
                Authorization: `Bearer ${this.storage.getAccessToken()}`,
            })
            .pipe(finalize(() => this.isReady$.next(true)));
    }

    public deleteById$(trainingId: string): Observable<void> {
        this.isReady$.next(false);
        return this.http
            .delete<void>(`/Training/${trainingId}`, {
                Authorization: `Bearer ${this.storage.getAccessToken()}`,
            })
            .pipe(finalize(() => this.isReady$.next(true)));
    }
}
