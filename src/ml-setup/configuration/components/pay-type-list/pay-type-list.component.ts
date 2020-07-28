import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IColValue, ConfigurationService } from 'ml-setup/shared/services/configuration/configuration.service';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ml-pay-type-list',
    templateUrl: './pay-type-list.component.html',
    styleUrls: ['./pay-type-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class PayTypeListComponent implements OnInit, OnChanges , OnDestroy{


    @Input()
    searchedForValue: string;

    @Input()
    reloadType: number;

    @Input()
    reloadPayType: any;

    @Output()
    editValue = new EventEmitter();

    dataSource: MatTableDataSource<IColValue>;
    showLoader = true;

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    displayedColumns = [
        { def: 'id', label: 'ID', hide: true },
        { def: 'paytype', label: 'Pay Type', hide: false },
        { def: 'code', label: 'Code', hide: false },
        { def: 'background', label: 'Background', hide: false },
        { def: 'action', label: 'Action', hide: false }
    ];

    private _unsubscribeAll = new Subject();

    constructor(private configurationService: ConfigurationService, private toastHandlerService: ToastHandlerService) {
    }

    ngOnInit(): void {
        /*Generate PayTypes data*/
        this.generatePayTypesGrid();
        /*--------------------*/
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngOnChanges(changes: SimpleChanges) {

        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'searchedForValue': {
                        /**
                         * generatePayTypesTable
                         * 
                         * @params type (0 = insert new data, 1 = filter)
                         * @params searchedForValue - For searched value 
                         * @params response - For inserting new data 
                         * 
                         **/

                        /*If edit values exist, call edit method to display values*/
                        if (this.searchedForValue) {
                            this.generatePayTypesTable(1, this.searchedForValue, undefined);
                        }
                        /*-------------------------------------------------------*/
                    }
                    case 'reloadPayType': {
                        if (this.reloadPayType) {
                            this.showLoader = true;
                            this.generatePayTypesGrid();
                        }
                        /*----------------- */
                    }
                }
            }
        }

        /*------------------------- */
    }


    generatePayTypesGrid() {
        this.configurationService
            .getIColValues('PT')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (response) => {
                    this.configurationService.iColValueList = response;
                    this.generatePayTypesTable(0, undefined, response);
                    this.showLoader = false;
                });
    }

    generatePayTypesTable(type?, filter?, response?) {
        if (type === 0) {
            this.configurationService.iColValueList = response;
            this.dataSource = new MatTableDataSource<IColValue>(response);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        } else {
            this.dataSource.filter = filter;
        }
    }


    getDisplayedColumns(): string[] {
        return this.displayedColumns.filter(cd => !cd.hide).map(cd => cd.def);
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    editPayType(payType: IColValue) {
        this.configurationService.selectedIColValue = Object.assign({}, payType);
        this.editValue.emit(this.configurationService.selectedIColValue);
    }

    parseJson(value) {
        return JSON.parse(value);
    }

    removePayType(payType: IColValue) {
        this.showLoader = true;
        this.configurationService.deleteIColValue(payType.id)
        .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                () => {
                    /* Display Success Message */
                    this.toastHandlerService.generateToast('Record Deleted Successfully', 'OK', 2000);
                    /*--------------------------------------------*/

                    /* Reload PayType data after deletion */
                    this.generatePayTypesGrid();
                    /*--------------------------*/

                },
                err => {
                    this.showLoader = false;

                    /* In case of Failure, Display Error Message */
                    this.toastHandlerService.generateToast(err, 'OK', 2000);
                    /*--------------------------------------------*/
                });
    }
}
