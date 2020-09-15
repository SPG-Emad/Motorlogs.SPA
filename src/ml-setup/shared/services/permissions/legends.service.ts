import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GlobalConstants } from 'ml-shared/common/global-constants';


const LEGENDS_API = `${GlobalConstants.apiURL}ColValues`;

export interface ILegends {

}


@Injectable({
    providedIn: 'root'
})
export class LegendsService {

    selectedLegend: ILegends;
    LegendList: ILegends[];

    constructor(
        private _http: HttpClient,
    ) { }

    getLegends() {
        return this._http
            .get(LEGENDS_API + "/GetLegends")
            .map((res: ILegends) => this.extractData(res));
    }


    private extractData(res) {
        let body = (typeof (res) != 'object') ? res.json() : res;  // If response is a JSON use json(), If response is a String use text()
        if (body) {
            return body;
        } else {
            return {};
        }
    }

}
