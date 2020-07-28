import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GlobalConstants } from 'ml-shared/common/global-constants';


const PERMISSION_API = `${GlobalConstants.apiURL}ColValues`;


export interface IPermissions {
    
}

@Injectable()
export class PermissionsService {
    selectedPermission: IPermissions;
    permissionList: IPermissions[];
    columnId: number  = null;
    gridApi:any;
    gridColumnApi:any;

   /**
    * Constructor
    * 
    *  @param {HttpClient}
    * 
    */
    constructor(
        private _http: HttpClient,
    ) { }


    fetchAllPermissions(){
        return this._http
            .get<IPermissions[]>(PERMISSION_API)
            .map(this.extractData);
    }


    postPermission(params: IPermissions) {
        return this._http
            .post(`${PERMISSION_API}/AddCustomColumn`,params)
            .map(this.extractData);
    }

    postColumnName(params: IPermissions) {
        return this._http
            .post(`${PERMISSION_API}/UpdateNameForCustomColumn`,params)
            .map(this.extractData);
    }

    updatePermission(params) {
        return this._http
            .post(`${PERMISSION_API}/UpdatePermissions`,params)
            .map(this.extractData);
    }


    getPermissions() {
        return this._http
            .get(`${PERMISSION_API}/GetuserPermissions`)
            .map((res: IPermissions) => this.extractData(res));
    }


    deletePermission(id: number){
        return this._http
            .delete(`${PERMISSION_API}/${id}`)
            .map((res: IPermissions) => this.extractData(res));
    }
    


    private extractData(res) {
        let body = (typeof (res) != 'object')? res.json(): res;  // If response is a JSON use json(), If response is a String use text()
        if (body) {
            return body;
        } else {
            return {};
        }
    }

}