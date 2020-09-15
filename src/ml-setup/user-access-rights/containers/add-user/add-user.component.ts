import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, ViewChild, SimpleChanges, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { UsersService } from 'ml-setup/shared/services/user-access-rights/users.service';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import { UserStateService } from 'ml-setup/shared/ngrx/service/user-state.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ml-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class AddUserComponent implements OnInit, OnDestroy {

    userStoreData$: Observable<any>;
    loading: boolean;
    private _unsubscribeAll = new Subject();

    constructor(
        private store: UserStateService,
        private usersService: UsersService,
        private toastHandlerService: ToastHandlerService,

    ) { }

    userObj = {
        username: '',
        email: '',
        picture: ''
    };

    @Input() user;
    @Input() userID: number;
    @Input() userRoles = [];

    @Output() reloadList = new EventEmitter();
    @Output() toggleSidePanel = new EventEmitter();

    /*Parent and Child Forms*/
    @ViewChild('userInitials', { static: true }) userInitialForm;
    @ViewChild('userCheckboxes', { static: true }) userCheckboxesForm;
    @ViewChild('userDepartmentAccess', { static: true }) userDepartmentAccess;
    @ViewChild('userSysFunction', { static: true }) userSysFunction;
    /*--------------------*/

    data = false;
    step = 0;


    /*Privileges available to the roles. By default all available*/
    rolePrivileges: any[] = [false, false];
    /*-----------------------------------*/

    showLoginHistoryPanel = true;


    // Display Message
    public message: string;

    ngOnInit() {
        this.userObj.username = "";
        this.userObj.email = "";
        this.userObj.picture = "";

        /*Fetch selected user for editing if exist*/
        this.userStoreData$ = this.store.getUser();
        /*------------------------------*/

        if (this.userStoreData$ == null || !this.userStoreData$) {
            this.showLoginHistoryPanel = false;
        }

        this.userStoreData$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(res => {
            this.showLoginHistoryPanel = false;
            if (res && res.firstName) {
                this.userObj.username = res.firstName + " " + res.lastName;
                this.userObj.email = res.email;
                this.userObj.picture = res.picture;
                this.showLoginHistoryPanel = true;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'userID': {
                        /**                   * 
                         * @rolePrivileges type (0 = Sales, 1 = Trade )
                         * 
                         * */

                    }
                }
            }
        }
    }


    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeSideBar(): void {
        this.store.resetUserState();
        this.userID = undefined;
        this.toggleSidePanel.emit(false);
    }

    setStep(index: number): void {
        this.step = index;
    }

    nextStep(): void {
        this.step++;
    }

    prevStep(): void {
        this.step--;
    }

    createUpdateUser() {
        this.data = true;

        /**
         * Check current and child component form validation. If all required
         * Form fields are filled, then Form Status will return true else false
         * 
         * userInitialForm      ( 0 = Form status, 1 = Form input values )
         * userCheckboxesForm   ( 0 = Form status, 1 = Form input values )
         * userDepartmentAccess ( 0 = Form status, 1 = Form input values )
         * 
         **/

        if (this.userInitialForm.submitForm()[0] &&
            this.userCheckboxesForm.submitForm()[0] &&
            this.userDepartmentAccess.submitForm()[0] &&
            this.userSysFunction.submitForm()[0]
        ) {
            const resultObj = {
                ...this.userInitialForm.submitForm()[1],
                ...this.userCheckboxesForm.submitForm()[1],
                departmentAccess: this.userDepartmentAccess.submitForm()[1],
                functionAccess: this.userSysFunction.submitForm()[1]
            };

            /*If UserId doesn't Exist Create New User else update User*/
            if (this.showLoginHistoryPanel === false) {
                this.createUser(resultObj);
            } else {
                this.updateUser(resultObj);
            }
            /*-----------------------------*/
        }
        /*-------------------------------------------------*/
    }

    createUser(resultObj) {
        this.loading = true;
        this.usersService.postUser(resultObj)
        .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                this.reloadList.emit(Object.assign({}, true));
                this.toastHandlerService.generateToast('User Created Successfully', 'OK', 2000);
                this.closeSideBar();
                this.loading = false;
            }, err => {
                this.toastHandlerService.generateToast(err, 'OK', 2000);
                this.loading = false;
            });
    }

    updateUser(resultObj) {
        this.loading = true;
        this.usersService.updateUser(resultObj)
        .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                this.reloadList.emit(Object.assign({}, true));
                this.toastHandlerService.generateToast('User Updated Successfully', 'OK', 2000);
                this.closeSideBar();
                this.loading = false;
            }, err => {
                this.toastHandlerService.generateToast(err, 'OK', 2000);
                this.loading = false;
            });
    }

    buttonText() {
        if (this.loading) {
            return "PLEASE WAIT";
        }
        else {
            if (this.showLoginHistoryPanel === false) {
                return "SAVE";
            } else {
                return "UPDATE";
            }
        }
    }
}
