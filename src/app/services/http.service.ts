import { HttpClient, HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class HttpService {
    private readonly API_URL = environment.apiUrl;
    private readonly http = inject(HttpClient);

    constructor() {}

    public get<T>(url: string, headers?: any): Observable<T> {
        return this.http.get<T>(this.API_URL + url, { headers });
    }

    public post<T, K>(url: string, data: T, headers?: any): Observable<K> {
        return this.http.post<K>(this.API_URL + url, data, { headers });
    }

    public patch<T, K>(url: string, data: T, headers?: any): Observable<K> {
        return this.http.patch<K>(this.API_URL + url, data, { headers });
    }
    
    public delete<T>(url: string, headers?: any): Observable<T> {
      return this.http.delete<T>(this.API_URL + url, { headers });
  }
}
