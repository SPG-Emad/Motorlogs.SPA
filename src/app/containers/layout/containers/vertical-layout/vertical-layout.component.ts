import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { navigation } from 'app/shared/navigation/navigation';
import { AuthService } from 'ml-auth/shared/services/ml-auth/ml-auth.service';
import { Store } from 'ml-shared/common/store';
import { UserProfile } from 'app/shared/services/user-profile.service';

@Component({
    selector: 'vertical-layout',
    templateUrl: './vertical-layout.component.html',
    styleUrls: ['./vertical-layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VerticalLayoutComponent implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;

    user$: Observable<UserProfile>;
    subscription: Subscription;

    isLeftLayout: boolean;
    isAuthenticated: boolean;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private store: Store,
        private authService: AuthService
    ) {
        // Set the defaults
        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.isAuthenticated = false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to config changes

        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
                this.isLeftLayout = this.fuseConfig.layout.navbar.position === 'left';
            });

        this.subscription = this.authService.auth$.subscribe();
        this.user$ = this.store.select<UserProfile>("user");
        this.user$.subscribe((data) => {
            if (data) {
                this.isAuthenticated = data.authenticated;
            }
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.subscription.unsubscribe();
    }
}
