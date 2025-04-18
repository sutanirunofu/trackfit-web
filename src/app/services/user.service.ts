import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { HttpService } from "./http.service";
import { IUser, IUserUpdateModel } from "app/components/pages/profile-page/user.interface";
import { EMPTY, Observable } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: "root",
})
export class UserService {
    private readonly http = inject(HttpService);
    private readonly platformId = inject(PLATFORM_ID);

    public update(model: IUserUpdateModel): Observable<IUser> {
        if (!isPlatformBrowser(this.platformId)) {
            return EMPTY;
        }

        const token = localStorage.getItem("access_token");

        return this.http.patch<IUserUpdateModel, IUser>("/User", model, { Authorization: `Bearer ${token}` });
    }
}
