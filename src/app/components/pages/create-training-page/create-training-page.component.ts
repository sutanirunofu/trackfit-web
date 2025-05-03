import { Component, inject } from "@angular/core";
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { Router, RouterLink } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ICreateTrainingModel } from "app/models/training.interface";
import { TrainingsService } from "app/services/trainings.service";
import { ToastsService } from "app/services/toasts.service";
import { BehaviorSubject, catchError, EMPTY, finalize } from "rxjs";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
    selector: "app-create-training-page",
    imports: [NavigationComponent, RouterLink, ReactiveFormsModule],
    templateUrl: "./create-training-page.component.html",
    styleUrl: "./create-training-page.component.scss",
})
export class CreateTrainingPageComponent {
    private readonly trainingsService = inject(TrainingsService);
    private readonly toastsService = inject(ToastsService);
    private readonly router = inject(Router);
    private readonly sanitizer = inject(DomSanitizer);

    public readonly isReady$ = new BehaviorSubject<boolean>(true);

    public readonly form = new FormGroup({
        title: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
        }),
        body: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(50), Validators.maxLength(5000)],
        }),
        previewUrl: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        videoUrl: new FormControl<string | null>(null),
    });

    public publish(): void {
        if (!this.form.valid) {
            return;
        }

        const data = this.form.value;

        const createTrainingModel: ICreateTrainingModel = {
            title: data.title ?? "",
            body: data.body ?? "",
            previewUrl: data.previewUrl ?? "",
            videoUrl: data.videoUrl ?? undefined,
        };

        this.isReady$.next(false);

        this.trainingsService
            .create$(createTrainingModel)
            .pipe(
                catchError((error) => {
                    if (error?.error?.message) {
                        this.toastsService.addToast(error.error.message, "error");
                    } else {
                        this.toastsService.addToast("Не удалось опубликовать тренировку", "error");
                    }

                    return EMPTY;
                }),
                finalize(() => this.isReady$.next(true))
            )
            .subscribe((training) => {
                if (training) {
                    this.toastsService.addToast("Тренировка успешно опубликована", "success");
                    this.router.navigate([`/trainings/${training.id}`]);
                }
            });
    }

    public selectPreviewImage(event: Event): void {
        const inputElem = (event as InputEvent).target as HTMLInputElement;

        if (!inputElem.files || (inputElem.files?.length ?? 0) <= 0) {
            return;
        }

        const file = inputElem.files[0];
        const blob = new Blob([file], { type: file.type });

        const reader = new FileReader();
        reader.onload = () => {
            const base64String = (reader as any).result.split(",")[1];
            this.form.controls.previewUrl.setValue(base64String);
        };
        reader.readAsDataURL(blob);
    }

    public base64ToUrlSafe(base64: string) {
        return "data:image/jpg;base64," + base64;
    }

    public removePreview(): void {
        this.form.controls.previewUrl.reset();
    }

    getSafeYoutubeUrl(url: string): SafeResourceUrl {
        const resultUrl = `https://www.youtube.com/embed/${url.split("youtu.be/")[1]}`;

        if ((resultUrl && resultUrl.includes("youtube.com")) || resultUrl.includes("youtu.be")) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(resultUrl);
        }
        return this.sanitizer.bypassSecurityTrustResourceUrl("about:blank");
    }
}
