import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { AuthService } from "app/services/auth.service";
import { DietsService } from "app/services/diets.service";
import { BehaviorSubject, combineLatest } from "rxjs";

@Component({
    selector: "app-diet-bju-page",
    imports: [CommonModule],
    templateUrl: "./diet-bju-page.component.html",
    styleUrl: "./diet-bju-page.component.scss",
})
export class DietBjuPageComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly dietsService = inject(DietsService);
    private readonly userDiets$ = this.dietsService.getAll$();

    public readonly currentDate$ = new BehaviorSubject<Date>(new Date());

    public readonly isReady$ = new BehaviorSubject<boolean>(true);
    public readonly user$ = this.authService.getCurrentUser$();

    public readonly proteins$ = new BehaviorSubject<number>(0);
    public readonly fats$ = new BehaviorSubject<number>(0);
    public readonly carbohydrates$ = new BehaviorSubject<number>(0);

    ngOnInit(): void {
        this.authService.getIsReady$().subscribe((isReady) => {
            this.isReady$.next(isReady);
        });

        this.loadPfc();
    }

    public prevDay(): void {
        this.currentDate$.next(new Date(this.currentDate$.getValue().getTime() - 1000 * 60 * 60 * 24));
        this.loadPfc();
    }

    public nextDay(): void {
        this.currentDate$.next(new Date(this.currentDate$.getValue().getTime() + 1000 * 60 * 60 * 24));
        this.loadPfc();
    }

    public getCurrentDateString(): string {
        if (this.equalsDate(this.currentDate$.getValue(), new Date())) {
            return "Сегодня";
        }

        const timeDiff = this.currentDate$.getValue().getTime() - new Date().getTime();
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

        return this.currentDate$.getValue().toLocaleDateString("ru-Ru");
    }

    private equalsDate(date1: Date, date2: Date): boolean {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDay() === date2.getDay()
        );
    }

    private loadPfc(): void {
        combineLatest([this.userDiets$, this.currentDate$]).subscribe(([diets, date]) => {
            const [p, f, c] = diets.reduce(
                (result, diet) => {
                    if (this.equalsDate(new Date(diet.creationDate), date)) {
                        return [
                            result[0] + diet.product.proteins,
                            result[1] + diet.product.fats,
                            result[2] + diet.product.carbohydrates,
                        ];
                    }

                    return result;
                },
                [0, 0, 0]
            );

            this.proteins$.next(+p.toFixed(2));
            this.fats$.next(+f.toFixed(2));
            this.carbohydrates$.next(+c.toFixed(2));
        });
    }
}
