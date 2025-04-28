import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { IRegisterModel, IRegisterSuccessModel } from "../../../models/register.interface";
import { AuthService } from "app/services/auth.service";
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { ToastsService } from "app/services/toasts.service";
import { catchError, EMPTY } from "rxjs";
import { StorageService } from "app/services/storage.service";

type goalType = "Похудеть" | "Набрать" | "Норма";

interface IRegisterForm {
    username: FormControl<string>;
    firstName: FormControl<string>;
    password: FormControl<string>;
    sex: FormControl<number>;
    birthday: FormControl<string>;
    height: FormControl<number | null>;
    weight: FormControl<number | null>;
    goalType: FormControl<goalType>;
    goalWeight: FormControl<number | null>;
}

@Component({
    selector: "app-register-page",
    imports: [RouterModule, ReactiveFormsModule, NavigationComponent],
    templateUrl: "./register-page.component.html",
    styleUrl: "./register-page.component.scss",
})
export class RegisterPageComponent {
    private readonly storage = inject(StorageService);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly toastsService = inject(ToastsService);

    public step: number = 0;

    public readonly registerForm: FormGroup<IRegisterForm> = new FormGroup({
        username: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
        }),
        firstName: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
        }),
        password: new FormControl<string>("", {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(100),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/),
            ],
        }),
        sex: new FormControl<number>(0, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(0), Validators.max(1)],
        }),
        birthday: new FormControl<string>(new Date().toISOString(), {
            nonNullable: true,
            validators: [
                Validators.required,
                (control) => {
                    const value = control.value;
                    if (!value) return null;

                    const birthDate = new Date(value);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();

                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }

                    return age >= 16 ? null : { underage: true };
                },
            ],
        }),
        height: new FormControl<number | null>(null, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(10), Validators.max(300)],
        }),
        weight: new FormControl<number | null>(null, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(10), Validators.max(500)],
        }),
        goalType: new FormControl<goalType>("Похудеть", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        goalWeight: new FormControl<number | null>(0, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(10), Validators.max(500)],
        }),
    });

    prevStep() {
        this.step--;
    }

    nextStep() {
        this.step++;
    }

    onSubmit() {
        const data = this.registerForm.value;

        const registerModel: IRegisterModel = {
            username: data.username ?? "",
            firstName: data.firstName ?? "",
            password: data.password ?? "",
            sex: data.sex ?? 0,
            birthday: data.birthday ?? new Date().toISOString(),
            height: data.height ?? 0,
            weight: data.weight ?? 0,
            goalType: data.goalType ?? "",
            goalWeight: data.goalWeight ?? 0,
        };

        if (!this.registerForm.valid) {
            return;
        }

        this.authService
            .register$(registerModel)
            .pipe(
                catchError((err) => {
                    this.toastsService.addToast(err?.error?.message ?? "Что-то пошло не так", "error");
                    return EMPTY;
                })
            )
            .subscribe((response: IRegisterSuccessModel) => {
                if (response.token) {
                    this.storage.setAccessToken(response.token);

                    this.authService.me$().subscribe((me) => {
                        this.toastsService.addToast("Успешная регистрация", "success");
                        this.router.navigate(["/profile"]);
                    });
                }
            });
    }
}
