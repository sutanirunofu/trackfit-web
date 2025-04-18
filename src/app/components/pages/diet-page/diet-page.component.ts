import { Component, inject, OnInit } from "@angular/core";
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from "@angular/router";
import { BehaviorSubject, filter } from "rxjs";
import { CommonModule, NgClass } from "@angular/common";

@Component({
    selector: "app-diet-page",
    imports: [NavigationComponent, RouterOutlet, RouterLink, NgClass, CommonModule],
    templateUrl: "./diet-page.component.html",
    styleUrl: "./diet-page.component.scss",
})
export class DietPageComponent implements OnInit {
    private readonly router = inject(Router);

    public readonly url$ = new BehaviorSubject<string>("");

    ngOnInit(): void {
        this.url$.next(this.router.url.split("/").at(-1)?.trim() ?? "");

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.url$.next(this.router.url.split("/").at(-1)?.trim() ?? "");
        });
    }
}
