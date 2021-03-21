import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { DepartmentsService } from 'ml-setup/shared/services/departments/departments.service';
import { RolesService } from 'ml-setup/shared/services/user-access-rights/roles.service';
import * as UserActions from "../../../shared/ngrx/actions/users.actions";
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ml-user-access-types',
    templateUrl: './user-access-types.component.html',
    styleUrls: ['./user-access-types.component.scss'],

})
export class UserAccessTypesComponent implements OnInit, OnDestroy {

    constructor(
        private departmentsService: DepartmentsService,
        public roleService: RolesService,
        private store: Store<any>
    ) { }

    private _unsubscribeAll = new Subject();

    openSidePanel = false;

    userRoles = [];

    departmentsList = [];

    selectedUser;

    searchedForValue;

    department = "";
    roles = "";
    names = "";

    @Output()
    openSidePanelForUsers = new EventEmitter<boolean>();

    @Output()
    searchFilters = new EventEmitter<any>();


    ngOnInit() {

        /*Get all Departments*/
        this.getAllDepartmentsByUserId();
        /*-------------------*/

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getAllDepartmentsByUserId() {
        this.departmentsService.getAllDepartmentsByUserId()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                res.map(res => {
                    this.departmentsList.push(
                        {
                            id: res.id,
                            description: res.name,
                            code: res.abbr
                        }
                    );
                });
                this.departmentsService.departmentList = res;
            });
    }

    selectedDepartment(event): void {
        console.log('Selected Department: ', event);
        if (event !== "View all") {
            this.department = event;
        } else {
            this.department = "";
        }
        this.applyFilter();
    }

    selectedUserRole(event): void {
        if (event !== "View all") {
            this.roles = event;
        } else {
            this.roles = "";
        }
        this.applyFilter();
    }

    addNewUserInSidePanel(): void {
        this.selectedUser = null;
        this.openSidePanel = true;

        /*Reset User store*/
        this.resetUserStore();
        /*----------------*/


        this.openSidePanelForUsers.emit(true);

    }

    resetUserStore() {
        this.store.dispatch(new UserActions.ResetUser());
    }

    closeSideBar(): void {
        this.openSidePanel = false;
        this.openSidePanelForUsers.emit(false);
    }


    toggleSidePanel($event: boolean): void {
        this.openSidePanel = $event;
        this.openSidePanelForUsers.emit(this.openSidePanel);
    }


    applyFilter(): void {

        this.searchedForValue = [
            {
                column: 'firstName',
                value: this.names.toLowerCase()
            },
            {
                column: 'roleCode',
                value: this.roles.toLowerCase()
            },
            {
                column: 'departmentAccess',
                value: this.department.toLowerCase()
            },
        ];

        this.searchFilters.emit(this.searchedForValue);
    }

    onlyCharacters(evt) {
        const theEvent = evt || window.event;

        // Handle key press
        let key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);

        const regex = /[a-zA-Z ]|\./;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) { theEvent.preventDefault(); }
        }
    }
}
