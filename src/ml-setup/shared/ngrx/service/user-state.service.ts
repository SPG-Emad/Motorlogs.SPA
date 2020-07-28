import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as UserActions from "../../../shared/ngrx/actions/users.actions";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserStateService {

    userStoreData$: Observable<any>;

    constructor(private store: Store<any>) {

        /*Fetch selected user for editing if exist*/
        this.userStoreData$ = store.select('user');
        /*------------------------------*/
    }

    getUserStore(form: any, params: any) {
        /*Subscribe to store and get user state if exist*/
        this.userStoreData$.subscribe(res => {
            if (res && res.firstName) {
                form.patchValue(res[params][0]);
            }
        });
        /*--------------------------------------------------*/
    }

    getUser() {
        return this.store.select('user');
    }

    setDepartmentAccessForm(form) {
        /*Subscribe to store and get user state if exist*/
        this.userStoreData$.subscribe(res => {
            if (res && res.departmentAccess && res.departmentAccess.length > 0) {
                const obj = {};
                res.departmentAccess.map(res => {
                    obj[res.departmentCode] = {
                        sales: res.sales,
                        trade: res.trade
                    };
                });

                const cloneObj = Object.assign({}, form.getRawValue(), obj);

                form.patchValue(cloneObj);
            }
        });
        /*--------------------------------------------------*/
    }

    addUserToStore(userObj) {
        this.store.dispatch(new UserActions.AddUser(userObj));
    }

    resetUserState() {
        this.store.dispatch(new UserActions.ResetUser());
    }

}
