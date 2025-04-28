import { Component, inject } from "@angular/core";
import { AuthService } from "app/services/auth.service";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { UserService } from "app/services/user.service";
import { catchError, EMPTY } from "rxjs";

@Component({
    selector: "app-profile-page",
    imports: [RouterModule, CommonModule, NavigationComponent],
    templateUrl: "./profile-page.component.html",
    styleUrl: "./profile-page.component.scss",
})
export class ProfilePageComponent {
    private readonly authService = inject(AuthService);
    private readonly userService = inject(UserService);

    public user$ = this.authService.getCurrentUser$();

    logout() {
        const isConfirm = confirm("Вы уверены, что хотите выйти из аккаунта?");

        if (isConfirm) {
            this.authService.logout();
        }
    }

    changeAvatar(event: Event) {
        const inputElem = (event as InputEvent).target as HTMLInputElement;

        if (!inputElem.files || (inputElem.files?.length ?? 0) <= 0) {
            return;
        }

        const file = inputElem.files[0];
        const blob = new Blob([file], { type: file.type });

        const reader = new FileReader();
        reader.onload = () => {
            const base64String = (reader as any).result.split(",")[1];

            this.userService
                .update$({ avatar: base64String })
                .pipe(
                    catchError((err) => {
                        console.log(err);
                        return EMPTY;
                    })
                )
                .subscribe((res) => {
                    this.authService.setCurrentUser(res);
                });
        };
        reader.readAsDataURL(blob);
    }

    base64ToUrlSafe(base64: string) {
        return "data:image/jpg;base64," + base64;
    }
}
