import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy, Input, ViewEncapsulation, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, NgForm, FormGroup, FormControl } from '@angular/forms';
import { RolesService } from 'ml-setup/shared/services/user-access-rights/roles.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ml-user-initials',
    templateUrl: './user-initials.component.html',
    styleUrls: ['./user-initials.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UserInitialsComponent implements OnInit, OnDestroy {

    @Input() data;

    userStoreData$: Observable<any>;
    loginEmail: string = null;
    private _unsubscribeAll = new Subject();

    constructor(
        private fb: FormBuilder,
        private roleService: RolesService,
        private store: Store<any>
    ) {
    }

    @ViewChild('f', { static: true }) myNgForm: NgForm;

    @Output() rolePrivileges = new EventEmitter();

    // Display Message
    public message: string;

    roles: any = {
        name: "View all",
        active: false
    };

    userInitalsForm = this.fb.group({
        id: [],
        firstName: ["", [Validators.required, Validators.maxLength(50)]],
        lastName: ["", [Validators.maxLength(50)]],
        email: ["", [Validators.required, Validators.maxLength(255), Validators.pattern('^[A-Za-z][a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.][a-zA-Z0-9-.]+$')]],
        mobile: ["", [Validators.maxLength(15)]],
        phone: ["", [Validators.maxLength(15)]],
    });


    ngOnInit() {

        /*Fetch selected user for editing if exist*/
        this.userStoreData$ = this.store.select('user');
        /*------------------------------*/
        this.userStoreData$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if (res && res.firstName) {
                    const editparam = {
                        firstName: res.firstName,
                        lastName: res.lastName,
                        email: res.email,
                        mobile: res.mobile,
                        phone: res.direct,
                    };

                    this.loginEmail = res.email;
                    /*Select Role*/
                    this.selectRoles(res.roleCode);
                    /*------------*/

                    const cloneObj = Object.assign({}, this.userInitalsForm.getRawValue(), editparam);
                    this.userInitalsForm.patchValue(cloneObj);
                }
            });

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    get firstName() {
        return this.userInitalsForm.get('firstName').value;
    }

    get lastName() {
        return this.userInitalsForm.get('lastName').value;
    }

    get email() {
        return this.userInitalsForm.get('email').value;
    }

    get mobile() {
        return this.userInitalsForm.get('mobile').value;
    }

    get phone() {
        return this.userInitalsForm.get('phone').value;
    }

    fetchSubmittedValues() {
        return {
            picture: null,
            roleLevel: null,
            roleCode: this.roles.name,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            login: (this.loginEmail) ? this.loginEmail : this.email,
            mobile: this.mobile,
            phone: this.phone,
        };
    }

    selectRoles(event) {
        this.roles = {
            name: event,
            active: false
        };


        /*Privileges for each Role*/
        switch (this.roles.name) {
            case 'VL':  // Valuer
                this.rolePrivileges.emit([true, false]); // ====> Sales not available but Trade is available
                break;
            case 'AM':  // Aftermarket Manager
                this.rolePrivileges.emit([true, true]); // ====> Both Sales and Trade not available
                break;
            case 'WM':  // Wholesale Manager
                this.rolePrivileges.emit([true, false]); // ====> Sales not available but Trade is available
                break;
            case 'FC': // Financial Controller
                this.rolePrivileges.emit([true, true]); // ====> Both Sales and Trade not available
                break;
            default:
                this.rolePrivileges.emit([false, false]);
                break;
        }
        /*---------------------------*/
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsDirty();
                control.markAllAsTouched();

                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    onlyNumbers(evt) {
        evt = evt ? evt : window.event;
        let charCode = evt.which ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    onlyCharacters(evt) {
        let theEvent = evt || window.event;

        // Handle key press
        let key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);

        let regex = /[a-zA-Z ]|\./;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) { theEvent.preventDefault(); }
        }
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
        } else {

            if (this.roles.name === "View all") {
                this.roles.active = true;
            } else {
                this.roles.active = false;
            }

            this.validateAllFormFields(this.userInitalsForm);
        }
        return [this.myNgForm.valid];
    }
}
