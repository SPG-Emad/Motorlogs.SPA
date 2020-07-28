import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GlobalConstants } from 'ml-shared/common/global-constants';
import { AuthService } from 'ml-auth/shared/services/ml-auth/ml-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface IRole {
    id?: number;
    name?: string;
    code?: string;
    oldCode?: string;
    Deletable?: number;
}

export interface IURole {
    id?: number;
    description?: string;
    code?: string;
    Deletable?: number;
}

const ROLE_API = `${GlobalConstants.apiURL}role`;


@Injectable()
export class RolesService {
    selectedRole: IRole;
    roleList: IRole[];
    userRole: any[];
    updateRolesList = new Subject();
    
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
        private authService: AuthService,
        private _matSnackBar: MatSnackBar

    ) { }


    fetchAllRoles(){
        return this._http
            .get<IRole[]>(ROLE_API)
            .map(this.extractData);
    }


    postRole(params: IRole) {
        return this._http
            .post(ROLE_API,params)
            .map(this.extractData);
    }


    putRole(role) {
        const body = JSON.stringify(role);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const options = {
            headers: headers
        };

        return this._http
            .put(`${ROLE_API}`, body, options)
            .map(this.extractData);
    }


    getRoles() {
        return this._http
            .get(ROLE_API)
            .map((res: IRole) => this.extractData(res));
    }


    deleteRole(id: number){
        return this._http
            .delete(`${ROLE_API}/${id}`)
            .map((res: IRole) => this.extractData(res));
    }
    

    generateToast(message: string, code: string): void {
        this._matSnackBar.open(message, code, {
            verticalPosition: 'bottom',
            duration: 2000
        });
    }

    private extractData(res) {
        const body = (typeof (res) !== 'object')? res.json(): res;  // If response is a JSON use json(), If response is a String use text()
        if (body) {
            return body;
        } else {
            return {};
        }
    }


}


