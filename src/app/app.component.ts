import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastsComponent } from "./components/shared/toasts/toasts.component";
import { AuthService } from "./services/auth.service";
import { NotificationsService } from "./services/notifications.service";
import { interval, Subscription } from "rxjs";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, ToastsComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit, OnDestroy {
    private readonly authService = inject(AuthService);
    private readonly notificationService = inject(NotificationsService);
    private subscription!: Subscription;

    ngOnInit(): void {
        this.authService.me$().subscribe();

        this.notificationService.checkForNewNotifications();

        setInterval(() => {
            this.notificationService.checkForNewNotifications();
        }, 1000 * 60);
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
