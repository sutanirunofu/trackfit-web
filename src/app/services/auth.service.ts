import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { HttpService } from "./http.service";
import { ILoginModel, ILoginSuccessModel } from "app/models/login.interface";
import { BehaviorSubject, catchError, EMPTY, finalize, map, Observable } from "rxjs";
import { IRegisterModel, IRegisterSuccessModel } from "app/models/register.interface";
import { IUser } from "app/models/user.interface";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private readonly http = inject(HttpService);
    private readonly currentUser$ = new BehaviorSubject<IUser | null>(null);
    private readonly isReady$ = new BehaviorSubject<boolean>(true);
    private readonly platformId = inject(PLATFORM_ID);
    
    public getIsReady$(): Observable<boolean> {
        return this.isReady$;
    }

    public getIsAuth$(): Observable<boolean> {
        return this.currentUser$.pipe(map((u) => u !== null));
    }

    public getCurrentUser$(): Observable<IUser | null> {
        return this.currentUser$;
    }

    public setCurrentUser(user: IUser): void {
        this.currentUser$.next(user);
    }

    public login$(loginModel: ILoginModel): Observable<ILoginSuccessModel> {
        return this.http.post("/Auth/Login", loginModel);
    }

    public register$(registerModel: IRegisterModel): Observable<IRegisterSuccessModel> {
        return this.http.post("/Auth/Register", registerModel);
    }

    public me$(): Observable<IUser> {
        if (!isPlatformBrowser(this.platformId)) {
            return EMPTY;
        }

        this.isReady$.next(false);

        const token = localStorage.getItem("access_token");

        return this.http.get<IUser>("/Auth/Me", { Authorization: `Bearer ${token}` }).pipe(
            map((response) => {
                this.currentUser$.next(response);
                return response;
            }),
            catchError((err) => {
                console.error(err);
                return EMPTY;
            }),
            finalize(() => {
                this.isReady$.next(true);
            })
        );
    }

    public logout() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        localStorage.removeItem("access_token");
        this.currentUser$.next(null);
    }
}
