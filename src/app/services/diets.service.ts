import { inject, Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { ICreateDietDto, IDiet } from "app/models/diet.interface";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class DietsService {
    private readonly http = inject(HttpService);

    public getAll$(): Observable<IDiet[]> {
        return this.http.get<IDiet[]>("/Diet");
    }

    public add$(createDietDto: ICreateDietDto): Observable<IDiet> {
        const token = localStorage.getItem("access_token");

        return this.http.post<ICreateDietDto, IDiet>("/Diet", createDietDto, {
            Authorization: `Bearer ${token}`,
        });
    }

    public delete$(id: string): Observable<void> {
        const token = localStorage.getItem("access_token");

        return this.http.delete<void>(`/Diet/${id}`, {
            Authorization: `Bearer ${token}`,
        });
    }
}
