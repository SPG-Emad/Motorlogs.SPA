import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ml-user-checkboxes',
    templateUrl: './user-checkboxes.component.html',
    styleUrls: ['./user-checkboxes.component.scss'],
})
export class UserCheckboxesComponent implements OnInit, OnDestroy {

    userStoreData$: Observable<any>;
    private _unsubscribeAll = new Subject();

    constructor(
        private fb: FormBuilder,
        store: Store<any>
    ) {

        /*Fetch selected user for editing if exist*/
        this.userStoreData$ = store.select('user');
        /*------------------------------*/

        this.userStoreData$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if (res && res.firstName) {
                    const editparam = {
                        restrictedAccess: res.restrictedAccess,
                        canSignInAccessOwnSalesLog: res.canSignInAccessOwnSalesLog,
                        canSeeAllDeliveriesWithinDepartment: res.canSeeAllDeliveriesWithinDepartment,
                    };

                    const cloneObj = Object.assign({}, this.userCheckboxesForm.getRawValue(), editparam);
                    this.userCheckboxesForm.patchValue(cloneObj);
                }
            });

    }

    @ViewChild('f', { static: true }) myNgForm: NgForm;

    // Display Message
    public message: string;

    userCheckboxesForm = this.fb.group({
        restrictedAccess: [""],
        canSignInAccessOwnSalesLog: [""],
        canSeeAllDeliveriesWithinDepartment: [""],
    });


    ngOnInit() {
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /*Getters for Fetching Form values*/
    get restrictAccess() {
        return this.userCheckboxesForm.get('restrictedAccess').value;
    }

    get canSignInAccessOwnSalesLog() {
        return this.userCheckboxesForm.get('canSignInAccessOwnSalesLog').value;
    }

    get canSeeAllDeliveriesWithinDepartment() {
        return this.userCheckboxesForm.get('canSeeAllDeliveriesWithinDepartment').value;
    }
    /*--------------------------------------*/

    fetchSubmittedValues() {
        return {
            restrictedAccess: this.restrictAccess === "" ? false : this.restrictAccess,
            canSignInAccessOwnSalesLog: this.canSignInAccessOwnSalesLog === "" ? false : this.canSignInAccessOwnSalesLog,
            canSeeAllDeliveriesWithinDepartment: this.canSeeAllDeliveriesWithinDepartment === "" ? false : this.canSeeAllDeliveriesWithinDepartment,
        };
    }

    submitForm() {
        /**
         * Check Form Status is valid or not. 
         * If valid show status and pass form values
         * Else pass invalid status
         * 
         * */
        if (this.myNgForm.valid) {
            return [this.myNgForm.valid, this.fetchSubmittedValues()];
        }
        return [this.myNgForm.valid];
    }
}
