
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GlobalConstants } from 'ml-shared/common/global-constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'ml-auth/shared/services/ml-auth/ml-auth.service';

export interface IDepartment {
    id?: number | null;
    name?: string;
    abbr?: string;
    picture?: string;
    logo?: string;
    deptId?: number | null;
    enabled?: boolean;
    userId?: number | null;
}

const DEPARTMENT_API = `${GlobalConstants.apiURL}depts`;

@Injectable()
export class DepartmentsService {

    selectedDepartment: IDepartment;
    departmentList: IDepartment[];
    refreshDepartmentList = new Subject();
    refreshDepartmentDropDown = new Subject();

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
        private authService: AuthService
    ) {

    }

    getAllDepartments() {
        return this._http
            .get<IDepartment[]>(DEPARTMENT_API)
            .map(this.extractData);
    }

    getAllDepartmentsByUserId() {
        return this._http
            .get<IDepartment[]>(DEPARTMENT_API + '/AssignedDeptsByUserID/' + this.authService.user.userId)
            .map(this.extractData);
    }

    postDepartment(params: IDepartment) {
        const model = Object.assign({}, params);
        model.userId = this.authService.user.userId;
        return this._http
            .post(DEPARTMENT_API, model)
            .map(this.extractData);
    }

    updateDeptStatus(id: number, body: boolean) {
        return this._http
            .post(`${DEPARTMENT_API}/Active/${id}/${body}`, {})
            .map((res: any) => this.extractData(res));
    }


    putDepartment(department) {

        const body = JSON.stringify(department);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const options = {
            headers: headers
        };

        return this._http
            .put(`${DEPARTMENT_API}`, body, options)
            .map(this.extractData);
    }

    getDepartments() {
        return this._http
            .get(DEPARTMENT_API)
            .map((res: IDepartment) => this.extractData(res));
    }

    deleteDepartment(id: number) {
        return this._http
            .delete(`${DEPARTMENT_API}/${id}`)
            .map((res: IDepartment) => this.extractData(res));
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