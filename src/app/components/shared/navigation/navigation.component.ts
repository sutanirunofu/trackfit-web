import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { LogoComponent } from "../logo/logo.component";
import { AuthService } from "app/services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-navigation",
    imports: [RouterLink, LogoComponent, CommonModule],
    templateUrl: "./navigation.component.html",
    styleUrl: "./navigation.component.scss",
})
export class NavigationComponent {
    private readonly authService = inject(AuthService);

    public readonly user$ = this.authService.getCurrentUser$();
}
