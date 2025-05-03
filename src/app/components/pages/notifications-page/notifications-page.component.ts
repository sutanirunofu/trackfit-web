import { Component, inject, OnInit } from "@angular/core";
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { NotificationsService } from "app/services/notifications.service";
import { catchError, EMPTY, first } from "rxjs";
import { ToastsService } from "app/services/toasts.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-notifications-page",
    imports: [NavigationComponent, CommonModule],
    templateUrl: "./notifications-page.component.html",
    styleUrl: "./notifications-page.component.scss",
})
export class NotificationsPageComponent implements OnInit {
    private readonly notificationService = inject(NotificationsService);
    private readonly toastsService = inject(ToastsService);

    public readonly notifications$ = this.notificationService.getLocalNotifications$();

    ngOnInit(): void {
        this.readAllNotifications();
    }

    public deleteById(notificationId: string): void {
        this.notificationService
            .deleteById$(notificationId)
            .pipe(
                catchError((error) => {
                    if (error?.error?.message) {
                        this.toastsService.addToast(error.error.message, "error");
                    } else {
                        this.toastsService.addToast("Ну удалось удалить уведомление", "error");
                    }

                    return EMPTY;
                })
            )
            .subscribe(() => {
                this.toastsService.addToast("Уведомление успешно удалено", "success");
                this.notificationService.checkForNewNotifications();
            });
    }

    private readAllNotifications(): void {
        this.notifications$.pipe(first()).subscribe((notifications) => {
            for (const notification of notifications) {
                this.notificationService
                    .readById$(notification.id)
                    .pipe(
                        first(),
                        catchError((error) => {
                            console.error("Notification Error: ", error);
                            return EMPTY;
                        })
                    )
                    .subscribe(() => {
                        this.notificationService.checkForNewNotifications();
                    });
            }
        });
    }
}
