import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GlobalConstants } from 'ml-shared/common/global-constants';

export interface Log {
    sysActionCode: string;
    details: string;
    message: string;
}

@Injectable({
    providedIn: "root",
})
export class LoggingService {
    constructor(private http: HttpClient) { }

    logError(message: string) {
        // Send errors to server here
        console.log("LoggingService: " + message);
    }

    logAction(model: Log) {
        console.log('logAction: ', model);
        this.http.post(GlobalConstants.apiURL + `logs/AddLog`, model).subscribe((res) => console.log('log action response: ', res));
    }

    //   component open logging
    //   fields based logging
    //   service based logging on back-end
    //   login logout logging
    //   old and new values logging

    // 2 type of logging
    // service based logging (e.g loading departments)
    // ui based logging
}
