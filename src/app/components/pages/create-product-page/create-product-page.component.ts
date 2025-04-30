import { Component, inject } from "@angular/core";
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { ICreateUserProductModel } from "app/models/user.interface";
import { UserService } from "app/services/user.service";
import { BehaviorSubject, catchError, EMPTY, finalize } from "rxjs";
import { ToastsService } from "app/services/toasts.service";
import { AuthService } from "app/services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-create-product-page",
    imports: [NavigationComponent, ReactiveFormsModule, RouterLink, CommonModule],
    templateUrl: "./create-product-page.component.html",
    styleUrl: "./create-product-page.component.scss",
})
export class CreateProductPageComponent {
    private readonly authService = inject(AuthService);
    private readonly userService = inject(UserService);
    private readonly toastsService = inject(ToastsService);
    private readonly router = inject(Router);

    public readonly isReady$ = new BehaviorSubject<boolean>(true);

    public readonly form = new FormGroup({
        name: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        calories: new FormControl<number | undefined>(undefined, {
            validators: [Validators.min(0), Validators.max(100_000)],
        }),
        proteins: new FormControl<number | undefined>(undefined, {
            validators: [Validators.min(0), Validators.max(100_000)],
        }),
        fats: new FormControl<number | undefined>(undefined, {
            validators: [Validators.min(0), Validators.max(100_000)],
        }),
        carbohydrates: new FormControl<number | undefined>(undefined, {
            validators: [Validators.min(0), Validators.max(100_000)],
        }),
    });

    public createProduct(): void {
        if (!this.form.valid) {
            return;
        }

        const data = this.form.value;

        const createUserProductModel: ICreateUserProductModel = {
            name: data.name ?? "",
            calories: data.calories ?? undefined,
            proteins: data.proteins ?? undefined,
            fats: data.fats ?? undefined,
            carbohydrates: data.carbohydrates ?? undefined,
        };

        this.isReady$.next(false);

        this.userService
            .createUserProduct$(createUserProductModel)
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
            .subscribe((user) => {
                if (user) {
                    this.authService.setCurrentUser(user);
                    this.toastsService.addToast("Продукт успешно добавлен", "success");
                    this.router.navigate(["/diet/calories"]);
                }
            });
    }
}
