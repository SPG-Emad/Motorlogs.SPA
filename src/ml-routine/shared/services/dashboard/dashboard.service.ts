import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { GlobalConstants } from 'ml-shared/common/global-constants';


const DASHBOARD_API = `${GlobalConstants.apiURL}Dashboard`;



export interface IDashboard {
    ViewId: any;
    RoleId?: any;
    UserId: any;
    
}

@Injectable()
export class DashboardService {
    selectedPermission: IDashboard;
    permissionList: IDashboard[];
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


    generatePivotData(params: any){
        return this._http
            .post<IDashboard[]>(`${DASHBOARD_API}/GeneratePivotTable`, params)
            .map(this.extractData);
    }

    generateSalesGraphUser(params: any){
        return this._http
            .post<IDashboard[]>(`${DASHBOARD_API}/GenerateSalesGraphUser`, params)
            .map(this.extractData);
    }


    generateSalesGraph(params: any){
        return this._http
            .post<IDashboard[]>(`${DASHBOARD_API}/GenerateSalesGraph`, params)
            .map(this.extractData);
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