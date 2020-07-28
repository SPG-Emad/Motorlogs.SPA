import { Injectable, Output, EventEmitter } from '@angular/core';
import { GlobalConstants } from 'ml-shared/common/global-constants';

import { HttpClient } from '@angular/common/http';
import { AuthService } from 'ml-auth/shared/services/ml-auth/ml-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserProfile } from 'app/shared/services/user-profile.service';

const MYPROFILE_API = `${GlobalConstants.apiURL}User`;
const USERCONFIG_API = `${GlobalConstants.apiURL}UserConfigs`;

export interface GeneralUserDetailsDto {
    email: string;
    picture: string;
    firstName: string;
    lastName: string;
    mobile: string;
    directPhone: string;
}

export interface UserConfigDto {
    name: string;
    value: string;
}

export interface DepartmentAccessDto {
    departmentId: number | null;
    departmentName: string;
    departmentCode: string;
    sales: boolean | null;
    trade: boolean | null;
}

export interface SystemFunctionAccessDto {
    sysFuncCode: string;
    access: boolean;
}

export interface LoginHistoryDto {
    login: string;
    ipAddress: string;
    details: string;
}

export interface ChangePasswordDto {
    password: string;
    vID: string;
}

export interface UserConfig {
    userID: number;
    name: string;
    value: string;
}
export interface UpdateEmailDto {
    userID: number;
    email: string;
    password: string;
}

@Injectable()
export class MyProfileService {

    userProfile: UserProfile;
    general: GeneralUserDetailsDto;

   
    
    /**
     * Constructor
     * 
     *  @param {HttpClient}
     *  @param {AuthService}
     *  @param {MatSnackBar}
     * 
     */
    constructor(
        private _http: HttpClient,
        private _matSnackBar: MatSnackBar,
        private authService: AuthService,
    ) { }

    getUserProfileDetailsById() {
        return this._http
            .get<UserProfile>(MYPROFILE_API + '/' + this.authService.user.userId)
            .map((res: UserProfile) => {
                this.userProfile = res;
                return this.extractData(res);
            });
    }

    updateGeneralInformation(params: GeneralUserDetailsDto) {
        return this._http
            .post(MYPROFILE_API + '/UpdateUserProfile', params)
            .map(this.extractData);
    }

    updateEmailAddress(params: UpdateEmailDto) {
        params.userID = +this.authService.user.userId;
        return this._http
            .post(MYPROFILE_API + '/ChangeEmailAddress', params)
            .map(this.extractData);
    }

    updatePassword(params) {
       
        return this._http
            .post(MYPROFILE_API + '/ChangePassword', params)
            .map(this.extractData);
    }

    updateNotificationsInProfile(params: UserConfig) {
        params.userID = +this.authService.user.userId;
        return this._http
            .post(USERCONFIG_API + '/UpdateUserConfiguration', params)
            .map(this.extractData);
    }

    generateToast(message: string, code: string): void {
        this._matSnackBar.open(message, code, {
            verticalPosition: 'bottom',
            duration: 2000
        });
    }

    private extractData(res) {

        const body = (typeof (res) !== 'object') ? res.json() : res;  // If response is a JSON use json(), If response is a String use text()
        if (body) {
            return body;
        } else {
            return {};
        }
    }

}