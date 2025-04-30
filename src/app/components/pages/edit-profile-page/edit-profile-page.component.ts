import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { IUserUpdateModel } from "app/models/user.interface";
import { AuthService } from "app/services/auth.service";
import { ToastsService } from "app/services/toasts.service";
import { UserService } from "app/services/user.service";
import { BehaviorSubject, catchError, EMPTY, finalize, first } from "rxjs";
import { NavigationComponent } from "../../shared/navigation/navigation.component";

@Component({
    selector: "app-edit-profile-page",
    imports: [RouterLink, ReactiveFormsModule, CommonModule, NavigationComponent],
    templateUrl: "./edit-profile-page.component.html",
    styleUrl: "./edit-profile-page.component.scss",
})
export class EditProfilePageComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);
    private readonly userService = inject(UserService);
    private readonly toastsService = inject(ToastsService);

    public readonly isReady$ = new BehaviorSubject<boolean>(true);
    public readonly user$ = this.authService.getCurrentUser$();

    public form = new FormGroup({
        firstName: new FormControl<string>("", {
            validators: [Validators.maxLength(50)],
        }),
        sex: new FormControl<number>(0),
        height: new FormControl<number>(10, {
            validators: [Validators.min(10), Validators.max(300)],
        }),
        weight: new FormControl<number>(10, {
            validators: [Validators.min(10), Validators.max(500)],
        }),
    });

    ngOnInit(): void {
        this.authService.getIsAuth$().subscribe((isAuth) => {
            this.isReady$.next(isAuth);
        });
        this.loadUser();
    }

    public editProfile(): void {
        this.isReady$.next(false);

        if (!this.form.valid) {
            return;
        }

        const data = this.form.value;

        const userUpdateModel: IUserUpdateModel = {
            firstName: data.firstName ?? undefined,
            sex: data.sex ?? undefined,
            height: data.height ?? undefined,
            weight: data.weight ?? undefined,
        };

        this.userService
            .update$(userUpdateModel)
            .pipe(
                catchError((error) => {
                    if (error?.error?.message) {
                        this.toastsService.addToast(error.error.message, "error");
                    } else {
                        this.toastsService.addToast("Что-то пошло не так", "error");
                    }

                    return EMPTY;
                }),
                finalize(() => this.isReady$.next(true))
            )
            .subscribe((newUser) => {
                this.authService.setCurrentUser(newUser);
                this.toastsService.addToast("Изменения успешно сохранены", "success");
                this.router.navigate(["/profile"]);
            });
    }

    public reset(): void {
        this.loadUser();
    }

    private loadUser(): void {
        this.user$.pipe(first()).subscribe((user) => {
            this.form.reset({
                firstName: user?.firstName ?? null,
                sex: user?.sex === 0 ? 0 : 1,
                height: user?.height ?? null,
                weight: user?.weight ?? null,
            });
        });
    }
}
