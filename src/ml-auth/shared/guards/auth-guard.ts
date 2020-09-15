import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthService } from "../services/ml-auth/ml-auth.service";
import "rxjs/add/operator/map";
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService,private dialogRefs: MatDialog,) { }

    canActivate() {
        return this.authService.authState.map((user) => {
            if (user === false || user === undefined) {
                
                this.dialogRefs.closeAll();
                window.sessionStorage.clear();
                this.router.navigate(["/auth/login"]);
                return false;
            }
            return true;
        });
    }
}
