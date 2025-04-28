import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class StorageService {
    private readonly ACCESS_TOKEN_NAME = "FITNESS_ACCESS_TOKEN";

    public getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_NAME);
    }

    public setAccessToken(token: string): void {
        localStorage.setItem(this.ACCESS_TOKEN_NAME, token);
    }

    public clearAccessToken(): void {
        localStorage.removeItem(this.ACCESS_TOKEN_NAME);
    }

    public getItem(key: string): string | null {
        return localStorage.getItem(key);
    }

    public setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    public removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    public clearAll(): void {
        localStorage.clear();
    }
}
