import { Component, inject, OnInit } from "@angular/core";
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { WaterService } from "app/services/water.service";
import { BehaviorSubject, catchError, EMPTY, first, Observable, of } from "rxjs";
import { CommonModule } from "@angular/common";
import { ICreateWaterDietModel, IUpdateWaterDietModel, IWaterDiet } from "app/models/water.interface";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ToastsService } from "app/services/toasts.service";
import { AuthService } from "app/services/auth.service";

@Component({
    selector: "app-water-page",
    imports: [NavigationComponent, CommonModule, ReactiveFormsModule],
    templateUrl: "./water-page.component.html",
    styleUrl: "./water-page.component.scss",
})
export class WaterPageComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly waterService = inject(WaterService);
    private readonly toastsService = inject(ToastsService);

    public readonly isReady$ = new BehaviorSubject<boolean>(true);
    public readonly waterDiets$ = new BehaviorSubject<IWaterDiet[]>([]);

    public form = new FormGroup({
        count: new FormControl<number | null>(null, {
            validators: [Validators.required, Validators.min(1), Validators.max(100_000)],
        }),
    });

    public selectedDate: Date = new Date();
    public editingRecordId = "";
    public isInputValid = false;

    public totalWater = 0;
    public normalWater = 0;
    public deltaWater = 0;

    ngOnInit(): void {
        this.waterService.getIsReady$().subscribe((isReady) => {
            this.isReady$.next(isReady);

            if (isReady) {
                this.loadWaterDiets();
            }
        });
    }

    public createRecord(): void {
        if (!this.form.valid) {
            return;
        }

        const data = this.form.value;

        const createWaterDietRecordModel: ICreateWaterDietModel = {
            count: data.count ?? -1,
        };

        this.waterService
            .create$(createWaterDietRecordModel)
            .pipe(
                catchError((error) => {
                    if (error.message) {
                        this.toastsService.addToast(error.message, "error");
                    } else {
                        this.toastsService.addToast("Что-то пошло не так", "error");
                    }

                    return EMPTY;
                })
            )
            .subscribe(() => {
                this.toastsService.addToast("Запись успешно добавлена", "success");
                this.authService.me$().subscribe(() => {
                    this.loadWaterDiets();
                });
                this.form.reset();
            });
    }

    public editRecord(recordId: string, value: number): void {
        const updateWaterDietModel: IUpdateWaterDietModel = {
            count: value,
        };

        this.waterService
            .updateById$(recordId, updateWaterDietModel)
            .pipe(
                catchError((error) => {
                    if (error.message) {
                        this.toastsService.addToast(error.message, "error");
                    } else {
                        this.toastsService.addToast("Что-то пошло не так", "error");
                    }

                    return EMPTY;
                })
            )
            .subscribe(() => {
                this.toastsService.addToast("Запись успешно обновлена", "success");
                this.authService.me$().subscribe(() => {
                    this.loadWaterDiets();
                });
            });
    }

    public removeRecord(recordId: string): void {
        const isConfirm = confirm("Вы уверены, что хотите удалить запись?");

        if (isConfirm) {
            this.waterService
                .deleteById$(recordId)
                .pipe(
                    catchError((error) => {
                        if (error.message) {
                            this.toastsService.addToast(error.message, "error");
                        } else {
                            this.toastsService.addToast("Что-то пошло не так", "error");
                        }

                        return EMPTY;
                    })
                )
                .subscribe(() => {
                    this.toastsService.addToast("Запись успешно удалена", "success");
                    this.authService.me$().subscribe(() => {
                        this.loadWaterDiets();
                    });
                });
        }
    }

    public getCurrentDateString(): string {
        if (this.dateEquals(new Date(), this.selectedDate)) {
            return "Сегодня";
        }

        const timeDiff = this.selectedDate.getTime() - new Date().getTime();
        const deltaDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (deltaDays === 0) {
            return "Завтра";
        }

        if (deltaDays === -2) {
            return "Вчера";
        }

        if (deltaDays === -3) {
            return "Позавчера";
        }

        return this.selectedDate.toLocaleDateString("ru-Ru");
    }

    public prevDay() {
        this.selectedDate.setTime(this.selectedDate.getTime() - 1000 * 60 * 60 * 24);
        this.loadWaterDiets();
    }

    public nextDay() {
        this.selectedDate.setTime(this.selectedDate.getTime() + 1000 * 60 * 60 * 24);
        this.loadWaterDiets();
    }

    private loadWaterDiets(): void {
        this.authService
            .getCurrentUser$()
            .pipe(first())
            .subscribe((user) => {
                if (user) {
                    const filtered = user.waterDiets.filter((w) =>
                        this.dateEquals(new Date(w.creationDate), this.selectedDate)
                    );

                    const sorted = filtered.sort((a, b) => {
                        return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
                    });

                    this.totalWater = sorted.reduce((acc, cur) => acc + cur.count, 0);

                    this.authService.getCurrentUser$().subscribe((user) => {
                        if (user) {
                            this.normalWater = user.weight * 35;
                            this.deltaWater =
                                this.normalWater - this.totalWater >= 0 ? this.normalWater - this.totalWater : 0;
                        }
                    });

                    this.waterDiets$.next(sorted);
                }
            });
    }

    private dateEquals(date1: Date, date2: Date): boolean {
        return (
            date1.getDay() === date2.getDay() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    }
}
