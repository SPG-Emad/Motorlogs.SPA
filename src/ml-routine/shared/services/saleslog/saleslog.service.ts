import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GlobalConstants } from 'ml-shared/common/global-constants';


const SALESLOG_API = `${GlobalConstants.apiURL}ViewsData`;



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


    fetchAllRows(params: any){
        return this._http
            .post<salesLog[]>(`${SALESLOG_API}/GetLiveSheetDataForViews`, params)
            .map(this.extractData);
    }

    duplicateRows(params: any){
        return this._http
            .post<salesLog[]>(`${SALESLOG_API}/DuplicateRowInView/${params.EntryId}`,{})
            .map(this.extractData);
    }


    deleteRows(params: any){
        return this._http
            .post<salesLog[]>(`${SALESLOG_API}/DeleteRowInView`, params)
            .map(this.extractData);
    }

    updateCellColor(params: any){
        return this._http
            .post<salesLog[]>(`${SALESLOG_API}/UpdateColorTagOnCell`, params)
            .map(this.extractData);
    }

    removeCellColor(params: any){
        return this._http
            .post<salesLog[]>(`${SALESLOG_API}/RemoveColorTagFromCell`, params)
            .map(this.extractData);
    }

    getCellHistory(params: any){
        return this._http
            .post<salesLog[]>(`${SALESLOG_API}/GetCellHistory`, params)
            .map(this.extractData);
    }

    exportData(params: any){
        return this._http
            .post<salesLog[]>(`${SALESLOG_API}/ExportData`, params)
            .map(this.extractData);
    }

    insertCellValue(params: any){
        return this._http
            .post<salesLog[]>(`${SALESLOG_API}/AddEntryValue`, params)
            .map(this.extractData);
    }

    postRows(params: salesLog) {
        return this._http
            .post(`${SALESLOG_API}/AddRowInView`,params)
            .map(this.extractData);
    }

    postColumnName(params: salesLog) {
        return this._http
            .post(`${SALESLOG_API}/UpdateNameForCustomColumn`,params)
            .map(this.extractData);
    }

    getColumnOptionsListing(params: salesLog) {
        return this._http
        .post(`${SALESLOG_API}/GetColumnOptionsListing`,params)
        .map(this.extractData);
    }

    updateColumnOptions(params: any) {
        return this._http
            .post(`${SALESLOG_API}/UpdateViewColumnModalOptions`,params)
            .map(this.extractData);
    }
    
 
    updateViewColumnOptions(params: any) {
        return this._http
            .post(`${SALESLOG_API}/UpdateViewColumnOptions`,params)
            .map(this.extractData);
    }

    resetColumn(params: salesLog) {
        return this._http
            .post(`${SALESLOG_API}/ResetColumnOptions`,params)
            .map(this.extractData);
    }

    updateCell(params) {
        return this._http
            .post(`${SALESLOG_API}/UpdatePermissions`,params)
            .map(this.extractData);
    }


    getAllRows() {
        return this._http
            .get(`${SALESLOG_API}/GetuserPermissions`)
            .map((res: salesLog) => this.extractData(res));
    }


    // deleteRow(id: number){
    //     return this._http
    //         .delete(`${SALESLOG_API}/${id}`)
    //         .map((res: salesLog) => this.extractData(res));
    // }
    


    private extractData(res) {
        let body = (typeof (res) != 'object')? res.json(): res;  // If response is a JSON use json(), If response is a String use text()
        if (body) {
            return body;
        } else {
            return {};
        }
    }

}