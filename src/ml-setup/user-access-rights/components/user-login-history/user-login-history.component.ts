import { Component, OnInit, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ml-user-login-history',
    templateUrl: './user-login-history.component.html',
    styleUrls: ['./user-login-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLoginHistoryComponent implements OnInit, OnDestroy {

    history: any[] = [];

    constructor(
        private store: Store<any>
    ) { }

    userStoreData$: Observable<any>;
    dataSource: MatTableDataSource<any>;
    showLoader = true;
    private _unsubscribeAll = new Subject();

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    displayedColumns = [
        { def: 'login', label: 'Login', hide: false },
        { def: 'ipAddress', label: 'Ip Address', hide: false },
        { def: 'device', label: 'Device Types', hide: false },
        { def: 'browser', label: 'Browser', hide: false },
    ];

    ngOnInit() {
        this.loginHistory();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loginHistory() {

        /*Fetch selected user for editing if exist*/
        this.userStoreData$ = this.store.select('user');
        /*------------------------------*/

        this.userStoreData$
        .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (response) => {

                    let loginHistory = [];
                    loginHistory = response.loginHistory;

                    if (loginHistory) {
                        loginHistory.map(res => {
                            const details = JSON.parse(res.details);

                            this.history.push({
                                login: res.login,
                                ipAddress: res.ipAddress,
                                device: details.device,
                                browser: details.browser,
                            });
                        });
                    }

                    this.dataSource = new MatTableDataSource<any>(this.history);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                });
    }

    getDisplayedColumns(): string[] {
        return this.displayedColumns.filter(cd => !cd.hide).map(cd => cd.def);
    }
}
