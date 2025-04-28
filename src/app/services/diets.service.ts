import { inject, Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { ICreateDietDto, IDiet } from "app/models/diet.interface";
import { Observable } from "rxjs";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: "root",
})
export class DietsService {
    private readonly storage = inject(StorageService);
    private readonly http = inject(HttpService);

    public getAll$(): Observable<IDiet[]> {
        return this.http.get<IDiet[]>("/Diet");
    }

    public add$(createDietDto: ICreateDietDto): Observable<IDiet> {
        return this.http.post<ICreateDietDto, IDiet>("/Diet", createDietDto, {
            Authorization: `Bearer ${this.storage.getAccessToken()}`,
        });
    }

    public delete$(id: string): Observable<void> {
        return this.http.delete<void>(`/Diet/${id}`, {
            Authorization: `Bearer ${this.storage.getAccessToken()}`,
        });
    }
}
