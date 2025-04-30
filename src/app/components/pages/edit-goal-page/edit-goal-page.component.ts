import { Component, inject, OnInit } from "@angular/core";
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { AuthService } from "app/services/auth.service";
import { Router, RouterLink } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { BehaviorSubject, catchError, EMPTY, finalize, first } from "rxjs";
import { IUserGoalType, IUserUpdateModel } from "app/models/user.interface";
import { UserService } from "app/services/user.service";
import { ToastsService } from "app/services/toasts.service";

@Component({
    selector: "app-edit-goal-page",
    imports: [NavigationComponent, RouterLink, ReactiveFormsModule, CommonModule],
    templateUrl: "./edit-goal-page.component.html",
    styleUrl: "./edit-goal-page.component.scss",
})
export class EditGoalPageComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly userService = inject(UserService);
    private readonly toastsService = inject(ToastsService);
    private readonly router = inject(Router);

    public readonly isReady$ = new BehaviorSubject<boolean>(true);
    public readonly user$ = this.authService.getCurrentUser$();

    public readonly form = new FormGroup({
        goalTypeName: new FormControl<string>("похудеть", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        goalWeight: new FormControl<number>(10, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(10), Validators.max(500)],
        }),
    });

    ngOnInit(): void {
        this.authService.getIsReady$().subscribe((isReady) => {
            this.isReady$.next(isReady);
        });

        this.loadForm();
    }

    public resetChanges(): void {
        this.loadForm();
    }

    public saveChanges(): void {
        if (!this.form.valid) {
            return;
        }

        const data = this.form.value;

        const userUpdateModel: IUserUpdateModel = {
            goalTypeName: data.goalTypeName,
            goalWeight: data.goalWeight,
        };

        this.isReady$.next(false);

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
            .subscribe((user) => {
                if (user) {
                    this.toastsService.addToast("Изменения успешно сохранены", "success");
                    this.authService.setCurrentUser(user);
                    this.router.navigate(["/profile"]);
                }
            });
    }

    private loadForm(): void {
        this.user$.subscribe((user) => {
            this.form.reset({
                goalTypeName: user?.goal.type.name,
                goalWeight: user?.goal.weight,
            });
        });
    }
}
