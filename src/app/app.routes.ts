import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: "home",
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
        loadComponent: () =>
            import("./components/pages/login-page/login-page.component").then((m) => m.LoginPageComponent),
    },
    {
        path: "register",
        loadComponent: () =>
            import("./components/pages/register-page/register-page.component").then((m) => m.RegisterPageComponent),
    },
    {
        path: "profile",
        loadComponent: () =>
            import("./components/pages/profile-page/profile-page.component").then((m) => m.ProfilePageComponent),
    },
    {
        path: "**",
        redirectTo: "home",
        pathMatch: "full",
    },
];
