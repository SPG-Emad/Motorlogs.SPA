import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: "root",
})
export class ToastHandlerService {
    constructor(private _matSnackBar: MatSnackBar) {}

    generateToast(message: string, code: string, duration: number): void {
        this._matSnackBar.open(message, code, {
            verticalPosition: "bottom",
            duration: duration,
        });
    }

    generateEmptyValuesToast(
        message: string,
        code: string,
        duration: number
    ): void {
        this._matSnackBar.open(message, code, {
            verticalPosition: "bottom",
            duration: null,
        });
    }
}
