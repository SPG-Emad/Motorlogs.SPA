import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GlobalConstants } from 'ml-shared/common/global-constants';


const PERMISSION_API = `${GlobalConstants.apiURL}ViewsData`;



export interface salesLog {
    ViewId: any;
    RoleId?: any;
    UserId: any;
    
}

@Injectable()
export class SaleslogService {
    selectedPermission: salesLog;
    permissionList: salesLog[];
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


    fetchAllRows(){
        return this._http
            .get<salesLog[]>(PERMISSION_API)
            .map(this.extractData);
    }


    postRows(params: salesLog) {
        return this._http
            .post(`${PERMISSION_API}/AddRowInView`,params)
            .map(this.extractData);
    }

    postColumnName(params: salesLog) {
        return this._http
            .post(`${PERMISSION_API}/UpdateNameForCustomColumn`,params)
            .map(this.extractData);
    }

    getColumnOptionsListing(params: salesLog) {
        return this._http
        .post(`${PERMISSION_API}/GetColumnOptionsListing`,params)
        .map(this.extractData);
    }


 
    resetColumn(params: salesLog) {
        return this._http
            .post(`${PERMISSION_API}/ResetColumnOptions`,params)
            .map(this.extractData);
    }

    updateCell(params) {
        return this._http
            .post(`${PERMISSION_API}/UpdatePermissions`,params)
            .map(this.extractData);
    }


    getAllRows() {
        return this._http
            .get(`${PERMISSION_API}/GetuserPermissions`)
            .map((res: salesLog) => this.extractData(res));
    }


    deleteRow(id: number){
        return this._http
            .delete(`${PERMISSION_API}/${id}`)
            .map((res: salesLog) => this.extractData(res));
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