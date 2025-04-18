import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";

export const routes: Routes = [
    {
        path: "home",
        loadComponent: () =>
            import("./components/pages/home-page/home-page.component").then((m) => m.HomePageComponent),
        title: "Главная - TrackFit",
    },
    {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
        title: "Главная - TrackFit",
    },
    {
        path: "login",
        loadComponent: () =>
            import("./components/pages/login-page/login-page.component").then((m) => m.LoginPageComponent),
        title: "Вход - TrackFit",
    },
    {
        path: "register",
        loadComponent: () =>
            import("./components/pages/register-page/register-page.component").then((m) => m.RegisterPageComponent),
        title: "Регистрация - TrackFit",
    },
    {
        path: "profile",
        loadComponent: () =>
            import("./components/pages/profile-page/profile-page.component").then((m) => m.ProfilePageComponent),
        canActivate: [authGuard],
        title: "Профиль - TrackFit",
    },
    {
        path: "diet",
        loadComponent: () =>
            import("./components/pages/diet-page/diet-page.component").then((m) => m.DietPageComponent),
        canActivate: [authGuard],
        title: "Рацион - TrackFit",
    },
    {
        path: "water",
        loadComponent: () =>
            import("./components/pages/water-page/water-page.component").then((m) => m.WaterPageComponent),
        canActivate: [authGuard],
        title: "Вода - TrackFit",
    },
    {
        path: "**",
        redirectTo: "home",
        pathMatch: "full",
    },
];
