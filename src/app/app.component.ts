import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastsComponent } from "./components/shared/toasts/toasts.component";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, ToastsComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent {}
