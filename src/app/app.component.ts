import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastsComponent } from "./components/shared/toasts/toasts.component";
import { AuthService } from "./services/auth.service";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, ToastsComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
    private readonly authService = inject(AuthService);

    ngOnInit(): void {
        this.authService.me$().subscribe();
    }
}
