import { inject, Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { ILoginModel, ILoginSuccessModel } from "app/components/pages/login-page/login.interface";
import { BehaviorSubject, catchError, EMPTY, map, Observable, of } from "rxjs";
import { IRegisterModel, IRegisterSuccessModel } from "app/components/pages/register-page/register.interface";
import { IUser } from "app/components/pages/profile-page/user.interface";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private readonly http = inject(HttpService);
    private currentUser$: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);
    private isReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    constructor() {}

    public login(loginModel: ILoginModel): Observable<ILoginSuccessModel> {
        return this.http.post("/Auth/Login", loginModel);
    }

    public register(registerModel: IRegisterModel): Observable<IRegisterSuccessModel> {
        return this.http.post("/Auth/Register", registerModel);
    }

    public me(): Observable<IUser> {
        if (!this.isReady$.getValue()) {
            return this.me();
        }

        const u = this.currentUser$.getValue();

        if (u) {
            return of(u);
        }

        this.isReady$.next(false);

        const token = localStorage.getItem("access_token");
        return this.http.get<IUser>("/Auth/Me", { Authorization: `Bearer ${token}` }).pipe(map(response => {
            this.currentUser$.next(response);
            this.isReady$.next(true);
            return response;
        }), catchError(err => {
            console.error(err);
            this.isReady$.next(true);
            return EMPTY;
        }));
    }

    public logout() {
        localStorage.removeItem("access_token");
        this.currentUser$.next(null);
    }
}
