import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GlobalConstants } from 'ml-shared/common/global-constants';
import { AuthService } from 'ml-auth/shared/services/ml-auth/ml-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface IColValue {
    id?: number;
    colID?: number;
    code?: string;
    valText?: string;
    valNumber?: string;
    details?: string;
}

const COLVALUE_API = GlobalConstants.apiURL + 'ColValues';

@Injectable()
export class ConfigurationService {

    selectedIColValue: IColValue;
    iColValueList: IColValue[];

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private _matSnackBar: MatSnackBar) { }

    get uid() {
        return this.authService.user.userId;
    }

    insertConfiguration(iColValue: IColValue) {
        return this.http.post(COLVALUE_API + '/InsertConfiguration', iColValue).map(this.extractData);
    }

    updateConfiguration(iColValue) {
        return this.http.post(COLVALUE_API + '/UpdateConfiguration', iColValue).map(this.extractData);
    }



    getIColValues(code?) {
        return this.http
            .get(COLVALUE_API + '/' + code)
            .map((res: IColValue[]) => this.extractData(res));
    }

    deleteIColValue(id: number) {
        return this.http.delete(`${COLVALUE_API}/${id}`).map((res) => { console.log(res); return res; });
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


