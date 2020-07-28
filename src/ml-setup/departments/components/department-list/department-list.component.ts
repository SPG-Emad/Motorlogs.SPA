import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IDepartment, DepartmentsService } from 'ml-setup/shared/services/departments/departments.service';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ml-department-list',
    templateUrl: './department-list.component.html',
    styleUrls: ['./department-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentListComponent implements OnInit {

    @Input() searchedForValue: string;
    @Input() refreshGrid: any;
    private _unsubscribeAll = new Subject();

    @Output()
    editValue = new EventEmitter();

    dataSource: MatTableDataSource<IDepartment>;
    showLoader = true;
    base64 = "data:image/png;base64,";

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    displayedColumns = [
        { def: 'id', label: 'ID', hide: true },
        { def: 'logo', label: 'Logo', hide: true },
        { def: 'picture', label: 'Logo', hide: false },
        { def: 'name', label: 'Name', hide: false },
        { def: 'abbr', label: 'Abbreviation', hide: false },
        { def: 'isactive', label: 'Is Active', hide: false },
        { def: 'action', label: 'Action', hide: false }
    ];

    constructor(
        private departmentService: DepartmentsService,
        private toastHandlerService: ToastHandlerService
    ) { }

    ngOnInit(): void {
        this.generateDepartmentGrid();
        this.departmentService.refreshDepartmentList
        .pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
            this.generateDepartmentGrid();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    changeActive(event: any, element: any) {
        const isChecked = event.checked;
        this.showLoader = true;
        this.departmentService.updateDeptStatus(element.id, isChecked)
        .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {

                this.showLoader = false;

                /*Regenerate*/
                this.generateDepartmentGrid();
                /*----------*/

                /*Display success message*/
                this.toastHandlerService.generateToast(res.message, 'OK', 2000);
                /*-----------------------*/

            }, err => {
                this.toastHandlerService.generateToast('Unable to perform action' + err, 'OK', 2000);
                this.showLoader = false;
            });
    }

    ngOnChanges(changes: SimpleChanges) {

        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'searchedForValue': {
                        /**
                         * generateDepartmentsTable
                         * 
                         * @params type (0 = insert new data, 1 = filter)
                         * @params searchedForValue - For searched value 
                         * @params response - For inserting new data 
                         * 
                         * */

                        /*If edit values exist, call edit method to display values*/
                        if (this.searchedForValue) {
                            this.generateDepartmentsTable(1, this.searchedForValue, undefined);
                        }
                        /*-------------------------------------------------------*/
                    }
                    case 'refreshGrid': {
                        if (this.refreshGrid) {
                            this.showLoader = true;
                            this.reloadDepartment(0);
                        }
                        /*----------------- */
                    }
                }
            }
        }

        /*------------------------- */
    }



    generateDepartmentsTable(type?, filter?, response?) {
        if (type === 0) {
            this.dataSource = new MatTableDataSource<IDepartment>(response);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        } else {
            this.dataSource.filter = filter;
        }
    }

    getDisplayedColumns(): string[] {
        return this.displayedColumns.filter(cd => !cd.hide).map(cd => cd.def);
    }

    editDepartment(department: IDepartment) {
        this.departmentService.selectedDepartment = Object.assign({}, department);
        this.editValue.emit(this.departmentService.selectedDepartment);
    }

    removeDepartment(department: IDepartment) {
        this.showLoader = true;
        this.departmentService.deleteDepartment(department.id)
        .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                res => {
                    /* Display Success Message */
                    this.departmentService.generateToast('Record Deleted Successfully', 'OK');
                    /*--------------------------------------------*/

                    /* Reload Department data after deletion */
                    const reloadType = 0;
                    this.reloadDepartment(reloadType);
                    /*--------------------------*/
                },
                err => {
                    /* In case of Failure, Display Error Message */
                    this.departmentService.generateToast('Unable to delete record' + err, 'OK');
                    /*--------------------------------------------*/
                },
                () => {
                    this.showLoader = false;
                });
    }

    generateDepartmentGrid() {
        this.departmentService
            .getDepartments()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (response) => {
                    this.departmentService.departmentList = response;
                    this.generateDepartmentsTable(0, undefined, response);
                    this.showLoader = false;
                    this.departmentService.refreshDepartmentDropDown.next();
                });
    }

    reloadDepartment(reloadType: number, departList?) {
        this.generateDepartmentGrid();
    }

}
