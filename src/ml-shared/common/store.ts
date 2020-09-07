import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged, pluck } from "rxjs/operators";
import { IDepartment } from 'ml-setup/shared/services/departments/departments.service';
import { UserProfile } from 'app/shared/services/user-profile.service';
import { NotificationDto } from 'app/shared/services/notification.service';

export interface State {
    user: UserProfile;
    departments: IDepartment[];
    notifications: NotificationDto[];
    [key: string]: any;
}

const state: State = {
    user: undefined,
    departments: undefined,
    notifications: undefined
};

export class Store {
    private subject = new BehaviorSubject<State>(state);
    private store = this.subject.asObservable().pipe(distinctUntilChanged());

    get value() {
        return this.subject.value;
    }

    select<T>(name: string): Observable<T> {
        return this.store.pipe(pluck(name));
    }

    set(name: string, state: any) {
        this.subject.next({ ...this.value, [name]: state });
    }

    constructor() {
      
    }
}
