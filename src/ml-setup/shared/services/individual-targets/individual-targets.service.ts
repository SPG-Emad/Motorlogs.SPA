import { Injectable } from '@angular/core';
import { GlobalConstants } from 'ml-shared/common/global-constants';
import { AuthService } from 'ml-auth/shared/services/ml-auth/ml-auth.service';
import { HttpClient } from '@angular/common/http';

export interface IindividualTarget {


}

const SITE_TARGET = GlobalConstants.apiURL + 'individualtarget';


@Injectable()
export class IndividualTargetsService {

    selectedTarget: IindividualTarget;
    siteTarget: IindividualTarget[];

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) { }

    getTarget(jsonParams) {
        return this.http.post(SITE_TARGET + '/GetIndividualTarget/',jsonParams)
            .map((res: IindividualTarget) => this.extractData(res))
    }

    
    updateTarget(params) {
        return this.http
            .post(`${SITE_TARGET}/IndividualTargetInsert`, params)
            .map(this.extractData);
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