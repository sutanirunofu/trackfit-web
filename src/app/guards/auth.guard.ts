import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { combineLatest, filter, map } from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return combineLatest([authService.getIsReady$(), authService.getCurrentUser$()]).pipe(
        filter(([isReady]) => isReady),
        map(([_, user]) => {
            console.log(user);
            if (user !== null) {
                return true;
            }

            router.navigate(["/login"]);
            return false;
        })
    );
};
