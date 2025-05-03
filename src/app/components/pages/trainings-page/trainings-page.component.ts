import { Component, inject, OnInit } from "@angular/core";
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { CommonModule } from "@angular/common";
import { BehaviorSubject } from "rxjs";
import { TrainingsService } from "app/services/trainings.service";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-trainings-page",
    imports: [NavigationComponent, CommonModule, RouterLink],
    templateUrl: "./trainings-page.component.html",
    styleUrl: "./trainings-page.component.scss",
})
export class TrainingsPageComponent implements OnInit {
    private readonly trainingService = inject(TrainingsService);

    public readonly isReady$ = new BehaviorSubject<boolean>(true);
    public readonly trainings$ = this.trainingService.getAll$();

    ngOnInit(): void {
        this.trainingService.getIsReady$().subscribe((isReady) => {
            this.isReady$.next(isReady);
        });
    }

    public base64ToUrlSafe(base64: string) {
      return "data:image/jpg;base64," + base64;
  }
}
