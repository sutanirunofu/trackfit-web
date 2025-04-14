import { Component, inject, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { LogoComponent } from "../../shared/logo/logo.component";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ILoginModel, ILoginSuccessModel } from "./login.interface";
import { AuthService } from "app/services/auth.service";
import { Router, RouterModule } from "@angular/router";
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { ToastsService } from "app/services/toasts.service";
import { catchError, EMPTY } from "rxjs";

interface ILoginFormGroup {
    username: FormControl<string>;
    password: FormControl<string>;
}

@Component({
    selector: "app-login-page",
    imports: [CommonModule, ReactiveFormsModule, RouterModule, NavigationComponent],
    providers: [AuthService],
    templateUrl: "./login-page.component.html",
    styleUrl: "./login-page.component.scss",
})
export class LoginPageComponent implements OnInit {
    private readonly titleService = inject(Title);
    private readonly authService = inject(AuthService);
    private readonly toastsService = inject(ToastsService);
    private readonly router = inject(Router);

    public readonly loginForm: FormGroup<ILoginFormGroup> = new FormGroup<ILoginFormGroup>({
        username: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(100), Validators.minLength(2)],
        }),
        password: new FormControl<string>("", {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/),
                Validators.minLength(8),
                Validators.maxLength(100),
            ],
        }),
    });

    public errors: string[] = [];

    ngOnInit(): void {
        this.titleService.setTitle("Вход - TrackFit");
    }

    onSubmit(event: SubmitEvent) {
        const loginModel: ILoginModel = {
            username: this.loginForm.value.username ?? "",
            password: this.loginForm.value.password ?? "",
        };

        if (!this.loginForm.valid) {
            console.log("Invalid!", loginModel);
            return;
        }

        console.log("Login with: ", loginModel);

        this.authService
            .login$(loginModel)
            .pipe(
                catchError((err) => {
                    console.dir(err);
                    this.toastsService.addToast(err?.error?.message ?? "Что-то пошло не так", "error");
                    return EMPTY;
                })
            )
            .subscribe((response: ILoginSuccessModel) => {
                console.log("Login response: ", response);

                if (response.token) {
                    localStorage.setItem("access_token", response.token);

                    this.authService.me$().subscribe((user) => {
                        console.log(user);

                        if (user.id) {
                            this.toastsService.addToast("Успешный вход", "success")
                            this.router.navigate(["/profile"]);
                        }
                    });
                }
            });
    }
}
