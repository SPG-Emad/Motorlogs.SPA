import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthService } from "../services/ml-auth/ml-auth.service";
import "rxjs/add/operator/map";
import { MatDialog } from "@angular/material/dialog";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        private dialogRefs: MatDialog,
        private cookieService: CookieService
    ) {}

    canActivate() {
        return this.authService.authState.map((user) => {
            if (user === false || user === undefined) {
                this.dialogRefs.closeAll();
                localStorage.clear();
                this.cookieService.deleteAll();
                this.router.navigate(["/auth/login"]);
                return false;
            }
            return true;
        });
    }
}
