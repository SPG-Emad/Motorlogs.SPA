import { Component, OnInit, OnDestroy } from '@angular/core';
import { MyProfileService } from 'ml-others/shared/services/my-profile/my-profile.service';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ml-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],

})
export class NotificationsComponent implements OnInit, OnDestroy {

    weeklyUserActivityReport: boolean;
    dailyDepartmentActivityReport: boolean;
    dailySalesPersonActivityReport: boolean;
    private _unsubscribeAll = new Subject();

    constructor(private toastHandlerService: ToastHandlerService, private myProfileService: MyProfileService) {
    }

    ngOnInit() {
        if (this.myProfileService.userProfile === undefined || null) {
            this.myProfileService.getUserProfileDetailsById()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.bindCheckBoxes();
            });
        } else {
            this.bindCheckBoxes();
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    bindCheckBoxes() {
        this.myProfileService.userProfile.userConfigurations.filter(x => x.name === 'weeklyUserActivityReport')
            .map((v: any) => {
                return this.weeklyUserActivityReport = (v.value as boolean);
            });
        this.myProfileService.userProfile.userConfigurations.filter(x => x.name === 'dailyDepartmentActivityReport')
            .map((v: any) => {
                return this.dailyDepartmentActivityReport = (v.value as boolean);
            });
        this.myProfileService.userProfile.userConfigurations.filter(x => x.name === 'dailySalesPersonActivityReport')
            .map((v: any) => {
                return this.dailySalesPersonActivityReport = (v.value as boolean);
            });
    }

    toggleNotification(option) {
        if (option === 1) {
            this.weeklyUserActivityReport = !this.weeklyUserActivityReport;
            this.updateNotification('weeklyUserActivityReport', this.weeklyUserActivityReport);
        }
        if (option === 2) {
            this.dailyDepartmentActivityReport = !this.dailyDepartmentActivityReport;
            this.updateNotification('dailyDepartmentActivityReport', this.dailyDepartmentActivityReport);
        }
        if (option === 3) {
            this.dailySalesPersonActivityReport = !this.dailySalesPersonActivityReport;
            this.updateNotification('dailySalesPersonActivityReport', this.dailySalesPersonActivityReport);
        }
    }

    updateNotification(name: string, value: boolean) {
        this.myProfileService.updateNotificationsInProfile({
            userID: 0,
            name: name,
            value: value ? 'True' : 'False'
        })
        .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                data => {
                    this.toastHandlerService.generateToast(data.message, 'OK', 2000);

                    this.myProfileService.userProfile.userConfigurations.filter(x => x.name === name).map(x => {
                        return x.value = value ? 'True' : 'False';
                    });

                 
                },
                err => {
                    /* In case of Failure, Display Error Message */
                    this.toastHandlerService.generateToast(err, 'OK', 2000);
                    /*--------------------------------------------*/
                });
    }

}
