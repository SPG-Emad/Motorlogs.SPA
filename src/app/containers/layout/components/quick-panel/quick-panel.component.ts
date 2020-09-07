import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from 'ml-shared/common/store';
import { NotificationService, NotificationDto } from 'app/shared/services/notification.service';

@Component({
    selector: 'quick-panel',
    templateUrl: './quick-panel.component.html',
    styleUrls: ['./quick-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QuickPanelComponent implements OnInit, OnDestroy {

    date: Date;
    events: any[];
    notes: any[];
    settings: any;
    countNotification: number;

    notifications$: Observable<NotificationDto[]>;
    notificationsArr: NotificationDto[];
    subscription: Subscription;

    constructor(private notificationService: NotificationService, private toastNotification: ToastHandlerService, private store: Store) {
        this.date = new Date();
        this.settings = {
            notify: true
        };
    }

    ngOnInit() {
        console.log('Quick Panel');
        this.subscription = this.notificationService.notifications$.subscribe((data) => this.notificationsArr = data);
        this.notifications$ = this.store.select<NotificationDto[]>('notifications');
    }

    deleteNotification(id: number) {
        this.notificationsArr = this.notificationsArr.filter(x => x.notificationId !== id);
        this.store.set('notifications', this.notificationsArr);

        this.notificationService.notificationDelete(id).subscribe(() => {
            this.toastNotification.generateToast('Marked as Read', 'OK', 2000);
        });
    }

    deleteNotificationByIndex(arr: any[], notificationId: number) {
        return arr = arr.filter(x => x.notificationId !== notificationId);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
