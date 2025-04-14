import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { first, Observable } from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    return new Observable((subscriber) => {
        authService.getIsReady$().subscribe((isReady) => {
            if (isReady) {
                authService
                    .getIsAuth$()
                    .subscribe((isAuth) => {
                        if (isAuth) {
                            subscriber.next(isAuth);
                            subscriber.complete();
                        } else {
                            console.log("nav");
                            router.navigate(["/login"]);
                        }
                    });
            }
        });
    });
};
