import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ILoginModel, ILoginSuccessModel } from "../../../models/login.interface";
import { AuthService } from "app/services/auth.service";
import { Router, RouterModule } from "@angular/router";
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { ToastsService } from "app/services/toasts.service";
import { catchError, EMPTY } from "rxjs";
import { StorageService } from "app/services/storage.service";

interface ILoginFormGroup {
    username: FormControl<string>;
    password: FormControl<string>;
}

@Component({
    selector: "app-login-page",
    imports: [CommonModule, ReactiveFormsModule, RouterModule, NavigationComponent],
    templateUrl: "./login-page.component.html",
    styleUrl: "./login-page.component.scss",
})
export class LoginPageComponent {
    private readonly storage = inject(StorageService);
    private readonly authService = inject(AuthService);
    private readonly toastsService = inject(ToastsService);
    private readonly router = inject(Router);

    public readonly loginForm: FormGroup<ILoginFormGroup> = new FormGroup<ILoginFormGroup>({
        username: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(100)],
        }),
        password: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(100)],
        }),
    });

    public errors: string[] = [];

    onSubmit() {
        const loginModel: ILoginModel = {
            username: this.loginForm.value.username ?? "",
            password: this.loginForm.value.password ?? "",
        };

        if (!this.loginForm.valid) {
            return;
        }

        this.authService
            .login$(loginModel)
            .pipe(
                catchError((err) => {
                    this.toastsService.addToast(err?.error?.message ?? "Что-то пошло не так", "error");
                    return EMPTY;
                })
            )
            .subscribe((response: ILoginSuccessModel) => {
                if (response.token) {
                    this.storage.setAccessToken(response.token);

                    this.authService.me$().subscribe((user) => {
                        if (user !== null) {
                            this.toastsService.addToast("Успешный вход", "success");
                            this.authService.setCurrentUser(user);
                            this.router.navigate(["/profile"]);
                        }
                    });
                }
            });
    }
}
