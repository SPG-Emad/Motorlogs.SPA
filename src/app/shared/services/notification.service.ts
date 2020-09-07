import { Injectable } from '@angular/core';
import { UserProfileService } from './user-profile.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Store } from 'ml-shared/common/store';
import { GlobalConstants } from 'ml-shared/common/global-constants';
import { map } from 'rxjs/operators';

export interface NotificationDto {
    notificationId: number;
    eventID: string;
    type: string;
    text: string;
}

@Injectable()
export class NotificationService {
    notifications$: Observable<NotificationDto[]> = this.getNotifications()
        .do(next => {
            this.store.set("notifications", next);
        });

    constructor(private http: HttpClient, private store: Store, private userProfileService: UserProfileService) {
      console.log('Notification Service');
    }

    getNotifications(): Observable<NotificationDto[]> {
        console.log('Get Notification');
        return this.http
            .get(GlobalConstants.apiURL + 'user/GetNotifications/' + this.userProfileService.currentUser.userId)
            .pipe(
                map((response: NotificationDto[]) => this.extractData(response)));
    }

    notificationDelete(id) {
        return this.http.post(GlobalConstants.apiURL + 'user/DeleteNotification/' + id, {}).map(this.extractData);
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
