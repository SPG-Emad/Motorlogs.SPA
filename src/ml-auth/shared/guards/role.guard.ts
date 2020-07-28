import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserProfileService } from 'app/shared/services/user-profile.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(private _userProfileService: UserProfileService, private router: Router) { }

    grantAccess() {
        return true;
    }

    denyAccess() {
        this.router.navigate(['404']);
        return false;
    }

    compare(str1: string, str2: string) {
        return str1.trim().toLowerCase() === str2.trim().toLowerCase() ? true : false;
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const departments = this._userProfileService.currentUser.routineMenuAccess;
        const sysFunctions = this._userProfileService.currentUser.systemFunctionMenuAccess;

        if (state.url.includes('routine')) {
            if (departments.length > 0) {
                if (state.url.includes('trade-in-log')) {
                    this._userProfileService.currentUser.tradeInArriving ?
                        this.grantAccess() : this.denyAccess();
                } else {
                    departments.filter(
                        data => data.rights.filter(
                            child =>
                                this.compare(child.url, state.url)).length > 0
                    ).length > 0 ?
                        this.grantAccess() : this.denyAccess();
                }
            }
            else {
                this.denyAccess();
            }
        }
        else {
            if (sysFunctions.length > 0) {
                // * means its is a vendor or a super user which has all the rights regardless of database records

                sysFunctions.filter
                    (data =>
                        this.compare(data.url, state.url)).length > 0 ? this.grantAccess() : this.denyAccess();

            }
            else {
                this.denyAccess();
            }
        }
        return true;
    }
}
