import { Component, OnInit, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ml-user-system-functions-access',
    templateUrl: './user-system-functions-access.component.html',
    styleUrls: ['./user-system-functions-access.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSystemFunctionsAccessComponent implements OnInit, OnDestroy {


    userStoreData$: Observable<any>;
    private _unsubscribeAll = new Subject();

    constructor(
        private fb: FormBuilder,
        private store: Store<any>
    ) {

        /*Fetch selected user for editing if exist*/
        this.userStoreData$ = store.select('user');
        /*------------------------------*/

        this.userStoreData$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(res => {
            if (res && res.functionAccess && res.functionAccess.length > 0) {
                const editparam = {};
                res.functionAccess.map(res => {
                    editparam[res.sysFuncCode] = res.access;
                });

                const cloneObj = Object.assign({}, this.userSysFuncForm.getRawValue(), editparam);
                this.userSysFuncForm.patchValue(cloneObj);
            }
        });

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    @ViewChild('f', { static: true }) myNgForm: NgForm;

    options = [
        {
            name: 'Departments',
            code: 'DP'
        },
        {
            name: 'User & Access Rights',
            code: 'UAC'
        },
        {
            name: 'Configuration',
            code: 'CN'
        },
        {
            name: 'Permissions',
            code: 'PR'
        },
        {
            name: 'Individual Targets',
            code: 'IT'
        },
        {
            name: 'Site Targets',
            code: 'ST'
        },
        {
            name: 'Client Contact Profile',
            code: 'CCP'
        },
    ];

    userSysFuncForm = this.fb.group({
        DP: [false],
        UAC: [false],
        CN: [false],
        PR: [false],
        IT: [false],
        ST: [false],
        CCP: [false],
    });

    ngOnInit() {
    }

    fetchSubmittedValues() {
        const result = [];
        this.options.map(res => {
            result.push({
                sysFuncCode: res.code,
                access: this.userSysFuncForm.get(res.code).value
            });
        });
        return result;
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
        /*---------------------------*/
    }

}
