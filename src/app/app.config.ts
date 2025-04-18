import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideClientHydration, withEventReplay } from "@angular/platform-browser";
import { provideHttpClient } from "@angular/common/http";
import { registerLocaleData } from "@angular/common";
import localeRu from "@angular/common/locales/ru";
import localeRuExtra from "@angular/common/locales/extra/ru";

registerLocaleData(localeRu, "ru-Ru", localeRuExtra);

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: LOCALE_ID, useValue: "ru-Ru" },
        provideHttpClient(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
    ],
};
