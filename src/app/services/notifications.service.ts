import { inject, Injectable, OnInit } from "@angular/core";
import { HttpService } from "./http.service";
import { StorageService } from "./storage.service";
import { BehaviorSubject, combineLatest, finalize, first, Observable, take } from "rxjs";
import { INotification } from "app/models/notification.interface";
import { ToastsService } from "./toasts.service";

@Injectable({
    providedIn: "root",
})
export class NotificationsService {
    private readonly http = inject(HttpService);
    private readonly storage = inject(StorageService);
    private readonly isReady$ = new BehaviorSubject<boolean>(true);
    private readonly notifications$ = new BehaviorSubject<INotification[]>([]);
    private readonly toastsService = inject(ToastsService);

    public getIsReady$(): Observable<boolean> {
        return this.isReady$.asObservable();
    }

    public getIsReadyValue(): boolean {
        return this.isReady$.getValue();
    }

    public getLocalNotifications$(): Observable<INotification[]> {
        return this.notifications$.asObservable();
    }

    public getAll$(): Observable<INotification[]> {
        this.isReady$.next(false);

        return this.http
            .get<INotification[]>("/Notification", {
                Authorization: `Bearer ${this.storage.getAccessToken()}`,
            })
            .pipe(finalize(() => this.isReady$.next(true)));
    }

    public getById$(notificationId: string): Observable<INotification> {
        this.isReady$.next(false);

        return this.http
            .get<INotification>(`/Notification/${notificationId}`, {
                Authorization: `Bearer ${this.storage.getAccessToken()}`,
            })
            .pipe(finalize(() => this.isReady$.next(true)));
    }

    public readById$(notificationId: string): Observable<void> {
        this.isReady$.next(false);

        return this.http
            .patch<null, void>(`/Notification/Read/${notificationId}`, null, {
                Authorization: `Bearer ${this.storage.getAccessToken()}`,
            })
            .pipe(finalize(() => this.isReady$.next(true)));
    }

    public deleteById$(notificationId: string): Observable<void> {
        this.isReady$.next(false);

        return this.http
            .delete<void>(`/Notification/${notificationId}`, {
                Authorization: `Bearer ${this.storage.getAccessToken()}`,
            })
            .pipe(finalize(() => this.isReady$.next(true)));
    }

    public checkForNewNotifications(): void {
        const subscription = combineLatest([this.notifications$.pipe(take(1)), this.getAll$().pipe(take(1))])
            .pipe(take(1))
            .subscribe({
                next: ([currentNotifications, newNotifications]) => {
                    console.log(currentNotifications, newNotifications);

                    const filtered = newNotifications.filter(
                        (nn) => !currentNotifications.some((cn) => cn.id === nn.id)
                    );

                    if (filtered.length > 0) {
                        this.toastsService.addToast(filtered[0].text, "info");
                    }

                    this.notifications$.next(newNotifications);
                },
                error: (err) => console.error("Error checking notifications:", err),
                complete: () => subscription.unsubscribe(),
            });
    }
}
