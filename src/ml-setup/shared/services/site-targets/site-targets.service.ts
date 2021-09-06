import { Injectable } from '@angular/core';
import { GlobalConstants } from 'ml-shared/common/global-constants';
import { AuthService } from 'ml-auth/shared/services/ml-auth/ml-auth.service';
import { HttpClient } from '@angular/common/http';

export interface ISiteTarget {


}

const SITE_TARGET = GlobalConstants.apiURL + 'Sitetargets';


@Injectable()
export class SiteTargetsService {

    selectedTarget: ISiteTarget;
    siteTarget: ISiteTarget[];

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) { }

    getTarget(jsonParams) {
        return this.http.post(SITE_TARGET + '/GetSiteTarget/',jsonParams)
            .map((res: ISiteTarget) => this.extractData(res))
    }

    private setHeaders(params,token) {      
        const accessToken = token;
        const reqData = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        };
        if(params) {
            let reqParams = {};        
            Object.keys(params).map(k =>{
                reqParams[k] = params[k];
            });
            reqData['params'] = reqParams;
        }
        return reqData;
    }
    
    postTarget(params: ISiteTarget) {
        // console.log('postTarget: ', params);
        return this.http
            .post(`${SITE_TARGET}/SiteTargetInsert`,params)
            .map(this.extractData);
    }
    
    
    updateTarget(params) {
        // console.log('updateTarget: ', params);
        return this.http
            .post(`${SITE_TARGET}/SiteTargetInsert`, params)
            .map(this.extractData);
    }


    updateTargetStatus(id: number, body: boolean) {
        return this.http
            .post(`${SITE_TARGET}/Active/${id}`, body)
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