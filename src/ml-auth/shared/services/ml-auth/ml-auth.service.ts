import { Injectable } from "@angular/core";

import { Store } from "ml-shared/common/store";
import { BehaviorSubject, empty } from "rxjs";
import { of } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
import { GlobalConstants } from "ml-shared/common/global-constants";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";

import "rxjs/add/operator/do";
import { LocalStorageHandlerService } from "app/shared/services/local-storage-handler.service";
import {
    UserProfile,
    UserProfileService,
} from "app/shared/services/user-profile.service";
import { navigation } from "app/shared/navigation/navigation";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class AuthService {
    jwtHelper = new JwtHelperService();
    authenticatedState = new BehaviorSubject<UserProfile>(null);
    deviceInfo = null;

    constructor(
        private store: Store,
        private http: HttpClient,
        private router: Router,
        private _deviceService: DeviceDetectorService,
        private cookieHandler: LocalStorageHandlerService,
        private userProfile: UserProfileService,
        private cookieService: CookieService
    ) {
        if (this.validToken) {
            navigation.splice(0, navigation.length);
            const user: any = this.cookieHandler.getSession("userObj");
            this.authenticatedState.next(user);
            this.userProfile.currentUser = user;
            this.userProfile.generateApplicationMenu();
        }
    }

    auth$ = this.authenticatedState.do((next) => {
        if (!next) {
            this.store.set("user", null);
            return;
        }
        this.store.set("user", this.userProfile.currentUser);
    });

    get authState() {
        const token = this.cookieHandler.getToken();
        return of(!this.jwtHelper.isTokenExpired(token));
    }

    get user() {
        return this.userProfile.currentUser;
    }

    get validToken() {
        return this.cookieHandler.getToken() != null ? true : false;
    }

    loginUser(email: string, password: string) {
        const promise = new Promise<void>((resolve, reject) => {
            this.http
                .post(GlobalConstants.apiURL + `auth/login`, {
                    login: email,
                    password,
                    deviceDetails: this.getDeviceInformation(),
                })
                .toPromise()
                .then(
                    (response: any) => {
                        const user = response;
                        if (user) {
                            this.userProfile.currentUser = user;

                            /*Decode Token */
                            this.userProfile.currentUser.decodedToken = this.jwtHelper.decodeToken(
                                user.token
                            );
                            /*-------------*/

                            /*Assign properties from response to currentUser subject */
                            this.userProfile.currentUser.authenticated = true;
                            this.authenticatedState.next(
                                this.userProfile.currentUser
                            );
                            /*------------------------------------------*/

                            localStorage.setItem(
                                "userObj",
                                JSON.stringify(this.userProfile.currentUser)
                            );

                            console.log(
                                "Non parsed",
                                localStorage.getItem("userObj")
                            );
                            console.log(
                                "Parsed ",
                                JSON.parse(localStorage.getItem("userObj"))
                            );

                            /*Set Authentication Token in session storage for API */
                            localStorage.setItem("token", user.token);
                            /*----------------------------------------------------*/

                            /*Store Auth User session data*/
                            this.userProfile.generateApplicationMenu();
                        }
                        resolve();
                    },
                    (err) => {
                        reject(err);
                    }
                );
        });
        return promise;
    }

    logoutUser() {
        navigation.splice(0, navigation.length);
        this.http.post(GlobalConstants.apiURL + `auth/logout`, {}).subscribe();
        this.userProfile.currentUser = null;
        localStorage.clear();
        this.cookieService.deleteAll();

        this.authenticatedState.next(null);
        this.store.set("notifications", null);
        this.router.navigate(["/auth/login"]);
    }

    getDeviceInformation() {
        this.deviceInfo = this._deviceService.getDeviceInfo();

        if (this._deviceService.isMobile()) {
            this.deviceInfo.device = "Mobile";
        } else if (this._deviceService.isTablet()) {
            this.deviceInfo.device = "Tablet";
        } else {
            this.deviceInfo.device = "Desktop";
        }
        return JSON.stringify(this.deviceInfo);
    }
}
