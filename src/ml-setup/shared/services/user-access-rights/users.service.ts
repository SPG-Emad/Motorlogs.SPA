import { Injectable } from '@angular/core';
import { GlobalConstants } from 'ml-shared/common/global-constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'ml-auth/shared/services/ml-auth/ml-auth.service';
import { Subject } from 'rxjs';

export interface IUsersList {
    id?: number;
    image?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    mobile?: string;
    phone?: string;
    role?: string;
    department?: string;
    roleCode?: string;
    departmentCode?: string;
    lastlogin?: string;
    isactive?: boolean;
    restrictAccess?: boolean;
    signInAccessSaleslog?: boolean;
    deliveriesVisible?: boolean;
    departmentsAccess: [{}];
    departments?: boolean;
    user_access?: boolean;
    configuration?: boolean;
    permissions?: boolean;
    individual_targets?: boolean;
    site_targets?: boolean;
    client_contact_profile?: boolean;
    IsEditable?: boolean;
    IsDeleteable?: boolean;
    loginHistory?: LoginHistoryDto[];
}

export interface LoginHistoryDto {
    login: string;
    ipAddress: string;
    details: string;
}

const USERS_API = GlobalConstants.apiURL + 'User';

@Injectable()
export class UsersService {

    selectedUser: IUsersList;
    usersList: IUsersList[];
    refreshUserList = new Subject();

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    get uid() {
        return this.authService.user.userId;
    }


    getUsers() {
        return this.http.get(USERS_API + '/GetUserslist')
            .map((res: IUsersList) => this.extractData(res));
    }

    GetUsersListByAllowedDepartmentsFromUserId() {
        return this.http.get(USERS_API + '/GetUsersListByAllowedDepartmentsFromUserId/' + this.authService.user.userId)
            .map((res: IUsersList) => this.extractData(res));
    }


    getLoginHistoryByUserID(id: number) {
        return this.http.get(USERS_API + '/GetLoginHistoryByUserID/' + id)
            .map((res: LoginHistoryDto) => this.extractData(res));
    }

    postUser(params: IUsersList) {
        return this.http
            .post(`${USERS_API}/UserNew`, params)
            .map(this.extractData);
    }


    updateUser(params) {
        return this.http
            .post(`${USERS_API}/UserUpdate`, params)
            .map(this.extractData);
    }


    deleteUser(id: number) {
        return this.http
            .post(`${USERS_API}/UserDelete/${id}`, "")
            .map((res: IUsersList) => this.extractData(res));
    }


    updateUserStatus(id: number, body: boolean) {
        return this.http
            .post(`${USERS_API}/Active/${id}/${body}`, {})
            .map((res: any) => this.extractData(res));
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
