import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { HttpService } from "./http.service";
import { IUser, IUserUpdateModel } from "app/models/user.interface";
import { EMPTY, Observable } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: "root",
})
export class UserService {
    private readonly http = inject(HttpService);
    private readonly storage = inject(StorageService);
    private readonly platformId = inject(PLATFORM_ID);

    public update$(model: IUserUpdateModel): Observable<IUser> {
        if (!isPlatformBrowser(this.platformId)) {
            return EMPTY;
        }

        return this.http.patch<IUserUpdateModel, IUser>("/User", model, {
            Authorization: `Bearer ${this.storage.getAccessToken()}`,
        });
    }
}
