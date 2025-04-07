import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { IRegisterModel, IRegisterSuccessModel } from "./register.interface";
import { AuthService } from "app/services/auth.service";
import { NavigationComponent } from "../../shared/navigation/navigation.component";

type goalType = "Похудеть" | "Набрать" | "Норма";

interface IRegisterForm {
    username: FormControl<string>;
    firstName: FormControl<string>;
    password: FormControl<string>;
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
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

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
        birthday: new FormControl<string>(new Date().toISOString(), {
            nonNullable: true,
            validators: [Validators.required],
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
            birthday: data.birthday ?? new Date().toISOString(),
            height: data.height ?? 0,
            weight: data.weight ?? 0,
            goalType: data.goalType ?? "",
            goalWeight: data.goalWeight ?? 0,
        };

        if (!this.registerForm.valid) {
            console.log("Invalid!", registerModel);
            return;
        }

        console.log("Register with: ", registerModel);

        this.authService.register(registerModel).subscribe((response: IRegisterSuccessModel) => {
            console.log("register response: ", response);

            if (response.token) {
              localStorage.setItem("access_token", response.token);
              this.router.navigate(["/profile"]);
            }
        });
    }
}
