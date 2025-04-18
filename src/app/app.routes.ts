import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";

export const routes: Routes = [
    {
        path: "home",
        title: "Главная - TrackFit",
        loadComponent: () =>
            import("./components/pages/home-page/home-page.component").then((m) => m.HomePageComponent),
    },
    {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
    },
    {
        path: "login",
        title: "Вход - TrackFit",
        loadComponent: () =>
            import("./components/pages/login-page/login-page.component").then((m) => m.LoginPageComponent),
    },
    {
        path: "register",
        title: "Регистрация - TrackFit",
        loadComponent: () =>
            import("./components/pages/register-page/register-page.component").then((m) => m.RegisterPageComponent),
    },
    {
        path: "profile",
        title: "Профиль - TrackFit",
        loadComponent: () =>
            import("./components/pages/profile-page/profile-page.component").then((m) => m.ProfilePageComponent),
        canActivate: [authGuard],
    },
    {
        path: "diet",
        title: "Рацион - TrackFit",
        loadComponent: () =>
            import("./components/pages/diet-page/diet-page.component").then((m) => m.DietPageComponent),
        children: [
            {
                path: "calories",
                loadComponent: () =>
                    import("./components/pages/diet-page/diet-calories-page/diet-calories-page.component").then(
                        (m) => m.DietCaloriesPageComponent
                    ),
                title: "Калории - Рацион - TrackFit",
            },
            {
                path: "bju",
                loadComponent: () =>
                    import("./components/pages/diet-page/diet-bju-page/diet-bju-page.component").then(
                        (m) => m.DietBjuPageComponent
                    ),
                title: "БЖУ - Рацион - TrackFit",
            },
            {
                path: "recipes",
                loadComponent: () =>
                    import("./components/pages/diet-page/diet-recipes-page/diet-recipes-page.component").then(
                        (m) => m.DietRecipesPageComponent
                    ),
                title: "Рецепты - Рацион - TrackFit",
            },
            {
                path: "**",
                redirectTo: "calories",
                pathMatch: "full",
            },
        ],
        canActivate: [authGuard],
    },
    {
        path: "water",
        title: "Вода - TrackFit",
        loadComponent: () =>
            import("./components/pages/water-page/water-page.component").then((m) => m.WaterPageComponent),
        canActivate: [authGuard],
    },
    {
        path: "**",
        redirectTo: "home",
        pathMatch: "full",
    },
];
