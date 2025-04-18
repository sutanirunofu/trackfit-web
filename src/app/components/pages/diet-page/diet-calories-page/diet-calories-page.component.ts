import { CommonModule, NgClass } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { dietTypeEnum, ICreateDietDto, IDiet } from "app/models/diet.interface";
import { IProduct } from "app/models/product.interface";
import { AuthService } from "app/services/auth.service";
import { DietsService } from "app/services/diets.service";
import { ProductsService } from "app/services/products.service";
import { ToastsService } from "app/services/toasts.service";
import { BehaviorSubject, catchError, EMPTY, exhaustMap, first, map, Observable } from "rxjs";

interface ISelectedProduct {
    id: string;
    product: IProduct;
    weight: number;
}

@Component({
    selector: "app-diet-calories-page",
    imports: [NgClass, CommonModule],
    templateUrl: "./diet-calories-page.component.html",
    styleUrl: "./diet-calories-page.component.scss",
})
export class DietCaloriesPageComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly user$ = this.authService.getCurrentUser$();
    private readonly productsService = inject(ProductsService);
    private readonly dietsService = inject(DietsService);
    private readonly toastsService = inject(ToastsService);
    private readonly products$ = this.productsService.getAll$();

    public readonly filteredProducts$ = new BehaviorSubject<IProduct[]>([]);
    public readonly selectedProducts$ = new BehaviorSubject<ISelectedProduct[]>([]);
    public readonly currentDate$ = new BehaviorSubject<Date>(new Date());
    public diets$ = this.dietsService.getAll$().pipe(this.sortDiets.bind(this));
    public totalCalories$ = this.diets$.pipe(this.toTotalCalories.bind(this));

    public option: number = 0;

    ngOnInit(): void {
        this.products$.pipe(first()).subscribe((products) => {
            this.filteredProducts$.next(products);
        });
    }

    public setOption(value: number): void {
        this.option = value;
    }

    public search(event: Event): void {
        const inputElem = event.target as HTMLInputElement;
        const searchText = inputElem.value;

        this.products$
            .pipe(
                first(),
                map((products) =>
                    products.filter((product) => product.name.toLowerCase().includes(searchText.toLowerCase()))
                )
            )
            .subscribe((filteredProducts) => {
                console.log(filteredProducts);
                this.filteredProducts$.next(filteredProducts);
            });
    }

    public selectProduct(product: IProduct): void {
        this.selectedProducts$.next([
            ...this.selectedProducts$.getValue(),
            { id: this.generateId(), product, weight: 100 },
        ]);
    }

    public updateProductWeight(selectedProduct: ISelectedProduct, event: Event): void {
        const inputElem = event.target as HTMLInputElement;
        const newWeight = +inputElem.value;

        const newSelectedProducts = this.selectedProducts$.getValue().map((sp) => {
            if (sp.id === selectedProduct.id) {
                sp.weight = newWeight;
            }

            return sp;
        });

        this.selectedProducts$.next(newSelectedProducts);
    }

    public removeSelectedProduct(selectedProduct: ISelectedProduct): void {
        const newSelectedProducts = this.selectedProducts$.getValue().filter((sp) => sp.id !== selectedProduct.id);
        this.selectedProducts$.next(newSelectedProducts);
    }

    public submit(): void {
        const type = this.option;
        const selectedProducts = this.selectedProducts$.getValue();

        selectedProducts.map((sp) => {
            const createDietDto: ICreateDietDto = {
                type: type,
                productId: sp.product.id,
                weight: sp.weight,
            };

            this.dietsService
                .add$(createDietDto)
                .pipe(
                    catchError((err) => {
                        this.toastsService.addToast(err?.error?.message ?? "Что-то пошло не так", "error");
                        return EMPTY;
                    })
                )
                .subscribe((diet) => {
                    if (diet !== null) {
                        this.toastsService.addToast(`${this.getDietTypeFrom(this.option)} успешно добавлен`, "success");
                        this.selectedProducts$.next([]);
                        this.diets$ = this.dietsService.getAll$().pipe(this.sortDiets.bind(this));
                        this.totalCalories$ = this.diets$.pipe(this.toTotalCalories.bind(this));
                    }
                });
        });
    }

    public deleteDietById(id: string): void {
        const isConfirm = confirm("Вы уверены, что хотите удалить запись?");

        if (isConfirm) {
            this.dietsService
                .delete$(id)
                .pipe(
                    catchError((err) => {
                        this.toastsService.addToast(err?.error?.message ?? "Что-то пошло не так", "error");
                        return EMPTY;
                    })
                )
                .subscribe(() => {
                    this.toastsService.addToast("Запись успешно удалена", "success");
                    this.diets$ = this.dietsService.getAll$().pipe(this.sortDiets.bind(this));
                    this.totalCalories$ = this.diets$.pipe(this.toTotalCalories.bind(this));
                });
        }
    }

    public getDietTypeFrom(value: number): string {
        return dietTypeEnum[value];
    }

    public getNormalCaloriesPerDay$(): Observable<number> {
        return this.user$.pipe(
            map((user) => {
                if (user === null) {
                    return 0;
                }

                let bmr;

                let age = new Date().getFullYear() - new Date(user.birthday).getFullYear();

                if (new Date().getDate() < new Date(user.birthday).getDate()) {
                    age -= 1;
                }

                if (user.sex) {
                    bmr = 10 * user.weight + 6.25 * user.height - 5 * age + 5;
                } else {
                    bmr = 10 * user.weight + 6.25 * user.height - 5 * age - 161;
                }

                return bmr * 1.5;
            })
        );
    }

    public toTotalCalories(allDiets$: Observable<IDiet[]>): Observable<number> {
        return allDiets$.pipe(
            this.sortDiets.bind(this),
            map((filteredDiets) =>
                filteredDiets.reduce((total, diet) => total + (diet.weight / 100) * diet.product.calories, 0)
            )
        );
    }

    public prevDay(): void {
        this.currentDate$.next(new Date(this.currentDate$.getValue().getTime() - 1000 * 60 * 60 * 24));
        this.totalCalories$ = this.diets$.pipe(this.toTotalCalories.bind(this));
    }

    public nextDay(): void {
        this.currentDate$.next(new Date(this.currentDate$.getValue().getTime() + 1000 * 60 * 60 * 24));
        this.totalCalories$ = this.diets$.pipe(this.toTotalCalories.bind(this));
    }

    public getCurrentDateString(): string {
        if (this.isToday(this.currentDate$.getValue())) {
            return "Сегодня";
        }

        const timeDiff = this.currentDate$.getValue().getTime() - new Date().getTime();
        const deltaDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (deltaDays === -2) {
            return "Вчера";
        }

        if (deltaDays === -3) {
            return "Позавчера";
        }

        return this.currentDate$.getValue().toLocaleDateString("ru-Ru");
    }

    private isToday(date: Date): boolean {
        const dietDate = date;
        const dateNow = new Date();
        return (
            dietDate.getFullYear() === dateNow.getFullYear() &&
            dietDate.getMonth() === dateNow.getMonth() &&
            dietDate.getDay() === dateNow.getDay()
        );
    }

    private generateId(): string {
        return `${Date.now()}_${Math.random()}`;
    }

    private sortDiets(dietsToSort$: Observable<IDiet[]>): Observable<IDiet[]> {
        return dietsToSort$.pipe(
            exhaustMap((allDiets) =>
                this.currentDate$.pipe(
                    map((currentDate) =>
                        allDiets.filter((diet) => {
                            const dietDate = new Date(diet.creationDate);

                            return (
                                dietDate.getFullYear() === currentDate.getFullYear() &&
                                dietDate.getMonth() === currentDate.getMonth() &&
                                dietDate.getDay() === currentDate.getDay()
                            );
                        })
                    )
                )
            ),
            map((diets) =>
                diets.sort(
                    (a: IDiet, b: IDiet) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
                )
            )
        );
    }
}
