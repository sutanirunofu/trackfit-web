export type ToastType = "info" | "success" | "warning" | "error";

export interface IToast {
    id: string;
    text: string;
    type: ToastType;
}