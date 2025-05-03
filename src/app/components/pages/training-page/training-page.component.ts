import { Component, inject, OnInit } from "@angular/core";
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { TrainingsService } from "app/services/trainings.service";
import { BehaviorSubject, finalize, first } from "rxjs";
import { ITraining } from "app/models/training.interface";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
    selector: "app-training-page",
    imports: [NavigationComponent, RouterLink, CommonModule],
    templateUrl: "./training-page.component.html",
    styleUrl: "./training-page.component.scss",
})
export class TrainingPageComponent implements OnInit {
    private readonly trainingsService = inject(TrainingsService);
    private readonly route = inject(ActivatedRoute);
    private readonly sanitizer = inject(DomSanitizer);

    public readonly isReady$ = new BehaviorSubject<boolean>(true);
    public readonly training$ = new BehaviorSubject<ITraining | null>(null);

    ngOnInit(): void {
        this.route.params.pipe(first()).subscribe((params) => {
            const trainingId = params["id"];
            this.loadTrainingById(trainingId);
        });

        this.isReady$.subscribe(console.log)
    }

    public base64ToUrlSafe(base64: string) {
        return "data:image/jpg;base64," + base64;
    }

    public getSafeYoutubeUrl(url: string): SafeResourceUrl {
        const resultUrl = `https://www.youtube.com/embed/${url.split("youtu.be/")[1]}`;

        if ((resultUrl && resultUrl.includes("youtube.com")) || resultUrl.includes("youtu.be")) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(resultUrl);
        }
        return this.sanitizer.bypassSecurityTrustResourceUrl("about:blank");
    }

    private loadTrainingById(trainingId: string): void {
        this.isReady$.next(false);

        this.trainingsService
            .getById$(trainingId)
            .pipe(
                first(),
                finalize(() => this.isReady$.next(true))
            )
            .subscribe((training) => {
                this.training$.next(training);
            });
    }
}
