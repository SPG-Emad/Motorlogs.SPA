import { Observable, Subject } from "rxjs";
import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    ViewChild,
    Output,
    EventEmitter,
    OnChanges,
    OnDestroy,
} from "@angular/core";
import { MatTableDataSource, MatTable } from "@angular/material/table";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import {
    IUsersList,
    UsersService,
} from "ml-setup/shared/services/user-access-rights/users.service";
import { DepartmentsService } from "ml-setup/shared/services/departments/departments.service";
import { ToastHandlerService } from "app/shared/services/toast-handler.service";
import { UserStateService } from "ml-setup/shared/ngrx/service/user-state.service";
import { takeUntil } from "rxjs/operators";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";

export interface departmentAccessInterface {
    departmentId: number;
    departmentName: string;
    departmentCode: string;
    sales: boolean;
    trade: boolean;
}
@Component({
    selector: "ml-user-list",
    templateUrl: "./user-list.component.html",
    styleUrls: ["./user-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit, OnChanges, OnDestroy {
    /**
     * Constructor
     *
     *  @param {usersService} - handles User data
     *  @param {DepartmentsService} - handles department data
     *  @param {ToastHandlerService} - handles Toast messages
     *
     */

    constructor(
        public usersService: UsersService,
        private departmentsService: DepartmentsService,
        private toastHandlerService: ToastHandlerService,
        // private store : Store<any>,
        private store: UserStateService
    ) {}

    userStoreData$: Observable<any[]>;
    private _unsubscribeAll = new Subject();

    @Input()
    searchFilters: string;

    @Input()
    reloadList: any;

    @Output()
    openSidePanelForUsers = new EventEmitter<boolean>();

    @Output()
    userId = new EventEmitter<number>();

    departments: object[];

    dataSource: MatTableDataSource<IUsersList>;
    showLoader = true;

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild(MatTable, { static: false })
    table: MatTable<any>; // initialize

    displayedColumns = [
        { def: "id", label: "ID", hide: true },
        { def: "selection", label: "#", hide: false },
        { def: "image", label: "User Image", hide: false },
        { def: "name", label: "User Name", hide: false },
        { def: "role", label: "User Role", hide: false },
        { def: "lastlogin", label: "Last Login", hide: false },
        { def: "isactive", label: "Is Active", hide: false },
        { def: "isEditable", label: "Is Editable", hide: true },
        { def: "isDeleteable", label: "Is Deleteable", hide: true },
        { def: "action", label: "Action", hide: false },
    ];

    obj: IUsersList[] = [];

    userList: IUsersList[] = [];

    ngOnInit(): void {
        this.bindGrid();
    }

    customFilterPredicate(data: any, filters: any): boolean {
        /*Custom Filter for Multiple filtering*/
        for (let i = 0; i < filters.length; i++) {
            if (
                filters[i].column === "departmentAccess" &&
                filters[i].value !== ""
            ) {
                const tableData = data[filters[i].column];
                if (tableData.length > 0) {
                    tableData.map((res) => {
                        if (
                            res.departmentCode.trim().toLowerCase() ===
                            filters[i].value.trim().toLowerCase()
                        ) {
                            const fitsThisFilter = filters[i].value;
                            if (!fitsThisFilter) {
                                return false;
                            }
                        } else {
                            const fitsThisFilter = "";
                            if (!fitsThisFilter) {
                                return false;
                            }
                        }
                    });
                } else {
                    const fitsThisFilter = "";
                    if (!fitsThisFilter) {
                        return false;
                    }
                }
            } else if (
                filters[i].column !== "loginHistory" &&
                filters[i].column !== "functionAccess" &&
                filters[i].column !== "departmentAccess"
            ) {
                const tableData = data[filters[i].column]
                    ? data[filters[i].column].trim().toLowerCase()
                    : data[filters[i].column];

                const fitsThisFilter = tableData
                    ? tableData.includes(filters[i].value)
                    : "";

                if (!fitsThisFilter) {
                    return false;
                }
            }
        }
        /*-----------------------------------*/

        return true;
    }

    ngOnChanges(changes) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case "searchFilters": {
                        /**
                         * generateDepartmentsTable
                         *
                         * @params type (0 = insert new data, 1 = filter)
                         * @params searchedForValue - For searched value
                         * @params response - For inserting new data
                         *
                         * */

                        if (this.searchFilters !== undefined) {
                            console.log("searchFilters:: ", this.searchFilters);
                            // implement some relevant logic to build the filters array
                            this.generateUserTable(
                                1,
                                this.searchFilters,
                                undefined
                            );
                        }
                        break;
                    }
                    case "reloadList": {
                        if (this.reloadList) {
                            this.showLoader = true;
                            this.bindGrid();
                        }
                        /*----------------- */
                        break;
                    }
                    default: {
                        break;
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
    
    originalData: any;

    generateUserTable(type?, filter?, response?) {
        /*Type 0 for loading data and 1 for filtering data */

        if (type === 0) {
            this.dataSource = new MatTableDataSource<IUsersList>(response);
            this.dataSource.filterPredicate = this.customFilterPredicate;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.originalData = [...this.dataSource.data];
        } else {

            this.dataSource.data = this.originalData;

            // this is how you apply a filter
            const filters: any = filter;

            if (filters[2].value !== "") {
                const filteredData = this.dataSource.data.filter((x: any) => x.departmentAccess.some(y => y.sales && y.departmentCode.trim().toLowerCase() === filters[2].value.trim().toLowerCase() ));
                this.dataSource.data = filteredData;
            }
            else{
                this.dataSource.filter = filters;
            }
        }
        /*====================================*/
    }

    bindGrid(data?: any) {
        this.usersService
            .GetUsersListByAllowedDepartmentsFromUserId()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                this.usersService.usersList = response;
                this.userList = response;
                this.generateUserTable(0, undefined, response);
                this.showLoader = false;
            });
    }

    getDisplayedColumns(): string[] {
        return this.displayedColumns
            .filter((cd) => !cd.hide)
            .map((cd) => cd.def);
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onEdit(usersList: IUsersList) {
        this.usersService.selectedUser = Object.assign({}, usersList);
    }

    getDepartments() {
        this.departmentsService
            .getAllDepartments()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.departments = res;
            });
    }

    onRemove(usersList: any) {
        this.showLoader = true;
        this.usersService
            .deleteUser(usersList.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                () => {
                    /*Refresh Grid, Stop loader and Display toast*/
                    this.showLoader = false;
                    this.bindGrid();
                    this.toastHandlerService.generateToast(
                        "Record Deleted Successfully",
                        "OK",
                        2000
                    );
                    /*--------------------------------------------*/
                },
                (err) => {
                    this.showLoader = false;
                    this.toastHandlerService.generateToast(err, "OK", 2000);
                }
            );
    }

    editUserInSidePanel(id: number) {
        this.userId.emit(id);

        /*Fetch User details by Id*/
        const userObj = this.userList.find((el) => el.id === id);
        /*------------------------*/

        /*Fetch Login History Of This User And Set In userObj*/

        this.usersService
            .getLoginHistoryByUserID(id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                const cloneObj = Object.assign({}, userObj);
                cloneObj.loginHistory = response;

                /*If User details are not found it will return undefined */
                if (userObj !== undefined) {
                    /*Reset user state*/
                    this.store.resetUserState();
                    /*-------------------*/

                    /*Add selected user to store*/
                    this.store.addUserToStore(cloneObj);
                    /*------------------------*/

                    this.openSidePanelForUsers.emit(true);
                }
                /*------------------------*/
            });
    }

    // addUserToStore(userObj){
    //     this.store.dispatch(new UserActions.AddUser(userObj))
    // }

    // resetUserStore(){
    //     this.store.dispatch(new UserActions.ResetUser())
    // }

    changeActive(event: any, element: any) {
        const isChecked = event.checked;
        this.showLoader = true;
        this.usersService
            .updateUserStatus(element.id, isChecked)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (res) => {
                    this.showLoader = false;

                    /*Regenerate*/
                    this.bindGrid();
                    /*----------*/

                    /*Display success message*/
                    this.toastHandlerService.generateToast(
                        res.message,
                        "OK",
                        2000
                    );
                    /*-----------------------*/
                },
                (err) => {
                    this.toastHandlerService.generateToast(
                        "Unable to perform action" + err,
                        "OK",
                        2000
                    );
                    this.showLoader = false;
                }
            );
    }
}
