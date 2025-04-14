import { Injectable } from "@angular/core";
import { IToast, ToastType } from "app/components/shared/toasts/toast.interface";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ToastsService {
    private readonly TOASTS$ = new BehaviorSubject<IToast[]>([]);

    public getToasts$(): Observable<IToast[]> {
        return this.TOASTS$;
    }

    public addToast(text: string, type: ToastType): void {
        const toast: IToast = {
            id: this.generateToastId(),
            text,
            type,
        };
        this.TOASTS$.next([...this.TOASTS$.getValue(), toast]);

        setTimeout(() => {
            const filteredToasts = this.TOASTS$.getValue().filter((t) => t.id !== toast.id);
            this.TOASTS$.next(filteredToasts);
        }, 4000);
    }

    private generateToastId(): string {
        return `toast_${Math.random()}_${Date.now()}`;
    }
}
