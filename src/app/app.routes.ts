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
        path: "profile/edit",
        title: "Редактирование профиля - TrackFit",
        loadComponent: () =>
            import("./components/pages/edit-profile-page/edit-profile-page.component").then(
                (m) => m.EditProfilePageComponent
            ),
        canActivate: [authGuard],
    },
    {
        path: "goal-edit",
        title: "Редактирование цели - TrackFit",
        loadComponent: () =>
            import("./components/pages/edit-goal-page/edit-goal-page.component").then((m) => m.EditGoalPageComponent),
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
        path: "trainings",
        title: "Тренировки - TrackFit",
        loadComponent: () =>
            import("./components/pages/trainings-page/trainings-page.component").then((m) => m.TrainingsPageComponent),
        canActivate: [authGuard],
    },
    {
        path: "trainings/:id",
        title: "Тренировка - TrackFit",
        loadComponent: () =>
            import("./components/pages/training-page/training-page.component").then((m) => m.TrainingPageComponent),
        canActivate: [authGuard],
    },
    {
        path: "create-product",
        title: "Создание продукта - TrackFit",
        loadComponent: () =>
            import("./components/pages/create-product-page/create-product-page.component").then(
                (m) => m.CreateProductPageComponent
            ),
        canActivate: [authGuard],
    },
    {
        path: "notifications",
        title: "Уведомления - TrackFit",
        loadComponent: () =>
            import("./components/pages/notifications-page/notifications-page.component").then(
                (m) => m.NotificationsPageComponent
            ),
        canActivate: [authGuard],
    },
    {
        path: "create-training",
        title: "Публикация тренировки - TrackFit",
        loadComponent: () =>
            import("./components/pages/create-training-page/create-training-page.component").then(
                (m) => m.CreateTrainingPageComponent
            ),
        canActivate: [authGuard],
    },
    {
        path: "**",
        redirectTo: "home",
        pathMatch: "full",
    },
];
