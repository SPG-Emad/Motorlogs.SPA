import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GlobalConstants } from 'ml-shared/common/global-constants';
import { AuthService } from 'ml-auth/shared/services/ml-auth/ml-auth.service';


export interface ClientContactProfileDto {
    entryId: number;
    deptId: number;
    departmentName: string;
    client: string;
    phone: string;
    email: string;
    suburb: string;
}

const CLIENTCONTACTLIST_API = GlobalConstants.apiURL + 'ClientContact';

@Injectable()
export class ClientContactProfileService {

    clientContactList: ClientContactProfileDto[];

    constructor(
        private http: HttpClient) { }

    getClientContactList() {
        return this.http
            .get<ClientContactProfileDto[]>(CLIENTCONTACTLIST_API + "/-1")
            .map(this.extractData);
    }

    getClientContactListByDepId(deptId) {
        return this.http
            .get<ClientContactProfileDto[]>(CLIENTCONTACTLIST_API + '/' + deptId)
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
