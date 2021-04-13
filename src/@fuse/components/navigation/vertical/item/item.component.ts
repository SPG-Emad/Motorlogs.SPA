import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseNavigationItem } from '@fuse/types';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Component({
    selector: 'fuse-nav-vertical-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class FuseNavVerticalItemComponent implements OnInit, OnDestroy {
    @HostBinding('class')
    classes = 'nav-item';

    @Input()
    item: FuseNavigationItem;


    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {

        // This code manages the hiding of menu items here ..
        // if (this._userProfileService.userProfile) {
        //     if (this.item.url !== '/dashboard' &&
        //         this.item.url !== '/others/my-profile' &&
        //         !this.item.url.includes('/routine')) {
        //         // * means he is a vendor or a super user who has all the system functions rights regardless of database
        //         if (!this._userProfileService.userProfile.isSuperUser) {
        //             if (this._userProfileService.assignedSystemFunctions
        //                 .filter(x => x.trim().toLowerCase() === this.item.url.trim().toLowerCase()).length < 1) {
        //                 this.item.hidden = true;
        //             }
        //         }
        //     }
        // }

        // Subscribe to navigation item
        merge(
            this._fuseNavigationService.onNavigationItemAdded,
            this._fuseNavigationService.onNavigationItemUpdated,
            this._fuseNavigationService.onNavigationItemRemoved
        ).pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
