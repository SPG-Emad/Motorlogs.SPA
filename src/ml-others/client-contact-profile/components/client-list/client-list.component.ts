import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClientContactProfileService, ClientContactProfileDto } from 'ml-others/shared/services/client-contact-profile/client-contact-profile.service';
import { DepartmentsService } from 'ml-setup/shared/services/departments/departments.service';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ml-client-list',
    templateUrl: './client-list.component.html',
    styleUrls: ['./client-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientListComponent implements OnInit, OnDestroy {

    dataSource: MatTableDataSource<ClientContactProfileDto>;
    showLoader = true;

    departmentsList = [];
    department = "";

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    searchedForValue;

    displayedColumns = [
        { def: 'departmentName', label: 'Department Name', hide: true },
        { def: 'client', label: 'Client Name', hide: false },
        { def: 'phone', label: 'Phone', hide: false },
        { def: 'suburb', label: 'Suburb', hide: false },
        { def: 'email', label: 'Email', hide: false },
    ];

    constructor(
        private clientContactProfile: ClientContactProfileService,
        private departmentsService: DepartmentsService,
        private toastService: ToastHandlerService) {
    }

    private _unsubscribeAll = new Subject();


    ngOnInit(): void {
        this.getAllDepartmentsByUserId();
        this.bindGrid();
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
                            code: res.name,
                            description: res.name,
                        }
                    );
                });
            });
    }

    selectedDepartment(event): void {
        if (event !== "View all") {
            this.department = event;
        } else {
            this.department = "";
        }
        this.applyFilter(this.department);
    }

    bindGrid() {
        this.showLoader = true;
        if (this.clientContactProfile.clientContactList) {
            this.dataSource = new MatTableDataSource<ClientContactProfileDto>(this.clientContactProfile.clientContactList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.showLoader = false;
        } else {
            this.clientContactProfile.getClientContactList()
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(
                    response => {
                        this.clientContactProfile.clientContactList = response;
                        this.dataSource = new MatTableDataSource<ClientContactProfileDto>(response);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    },
                    err => {
                        /* In case of Failure, Display Error Message */
                        this.toastService.generateToast(err, '400', 2000);
                        /*--------------------------------------------*/
                    },
                    () => {
                        this.showLoader = false;
                    });
        }
    }

    getDisplayedColumns(): string[] {
        return this.displayedColumns.filter(cd => !cd.hide).map(cd => cd.def);
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
