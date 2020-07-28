import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, SimpleChanges, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, NgForm, FormGroup, FormGroupDirective } from '@angular/forms';
import { RolesService } from 'ml-setup/shared/services/user-access-rights/roles.service';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


/* Role Constants */
const ERROR_MESSAGE = "An Error has occurred! Please try again later";
const DUPLICATE_ERROR_MESSAGE = "Error! Cannot insert duplicate Code.";
const PUT_SUCCESS = "Record Updated Successfully";
const POST_SUCCESS = "Record Added Successfully";
/*----------------------*/


@Component({
    selector: 'ml-roles-form',
    templateUrl: './roles-form.component.html',
    styleUrls: ['./roles-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesFormComponent implements OnInit, OnDestroy {

    @Input() editValue: any;
    @Output() reloadRoles = new EventEmitter<any>();

    constructor(
        private fb: FormBuilder,
        private roleService: RolesService,
        private toastHandlerService: ToastHandlerService,
    ) { }

    // Display Message
    public message: string;
    resetFormDirective: any;
    private _unsubscribeAll = new Subject();

    roleForm: FormGroup = this.fb.group({
        id: [],
        name: ["", [Validators.required, Validators.maxLength(60)]],
        code: ["", [Validators.required, Validators.maxLength(10)]],
        roleId: [""]
    });

    rolesList = [];
    loading: boolean;

    get name() {
        return this.roleForm.get('name').value;
    }

    get code() {
        return this.roleForm.get('code').value;
    }

    @ViewChild('f', { static: true }) myNgForm: NgForm;

    @ViewChild('f', { static: true }) formDirective: FormGroupDirective;


    ngOnInit() {
        this.loading = true;
        this.getRoles();
        this.roleService.updateRolesList
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.getRoles();
            });
    }

    getRoles() {
        this.rolesList = [];
        this.roleService.getRoles()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                res.map(res => {
                    this.rolesList.push(
                        {
                            id: res.id,
                            name: res.name,
                        }
                    );
                });
                this.roleService.roleList = res;
            });
        this.loading = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'editValue': {
                        /*If edit values exist, call edit method to display values*/
                        if (this.editValue) {
                            this.setUpdateValues(this.editValue);
                        }
                        /*-------------------------------------------------------*/
                    }
                }
            }
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    setUpdateValues(editparam) {
        /**
         * Check isDeletable property from the selected record.
         * 
         * If isDeletable is equal to false then only allow RoleName to be edited
         * If isDeletable is equal to true then allow all fields to be editable
         * 
         * */
        if (editparam.deletable === false) {
            this.roleForm.get('code').disable();
        } else {
            this.roleForm.get('code').enable();
        }

        const cloneObj = Object.assign({}, this.roleForm.getRawValue(), editparam);
        this.roleForm.patchValue(cloneObj);
    }

    createRole(): void {

        this.loading = true;

        if (this.roleForm.controls['roleId'].value == null || this.roleForm.controls['roleId'].value === "") {
            this.roleService.generateToast('Please select any role from listing', 'OK');
            this.loading = false;
            return;
        }

        const params = {
            name: this.name,
            code: this.code,
            roleId: this.roleForm.controls['roleId'].value
        };

        /*Make the department data */
        this.roleService.postRole(params)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                data => {

                    /*Execute Default Form Submission Methods */
                    this.onFormSubmission(POST_SUCCESS);
                    /*---------------------------*/


                    /* Fetch the Updated Records */
                    this.reloadRoles.emit(Object.assign({}, true));
                    /*---------------------------*/

                    this.loading = false;

                    this.roleService.updateRolesList.next();

                },
                err => {
                    /* In case of Failure, Display Error Message */
                    this.toastHandlerService.generateToast(ERROR_MESSAGE, 'OK', 2000);
                    /*--------------------------------------------*/

                    this.loading = false;
                });

    }

    createUpdateRole(formDirective: FormGroupDirective): void {
        /*Check if Form is filled*/
        if (this.roleForm.valid) {

            /*Find Selected Code in RolesList*/
            /**
             * Check if editValue is available and its code is equal to the current inserted roleCode
             *  If yes then simply insert the data else if editValue doesnot match the current roleCode
             *  show duplication error messaeg
             * */
            const roleCode = this.roleForm.get('code').value;
            let roleID;

            if ((roleCode && this.editValue && this.editValue.code !== roleCode)
                || (this.editValue && !this.editValue.code)) {
                roleID = this.roleService.roleList.find(el => el.code.toLowerCase() === roleCode.toLowerCase());
            }
            /*-------------------------------*/


            /*If it returns undefined then code is unique else returns the object with code*/
            this.resetFormDirective = formDirective;
            if (roleID === undefined) {
                /*Check If ID is not set, Create new department else Update*/
                if (this.myNgForm.value.id == null) {
                    this.createRole();
                } else {
                    this.updateRole();
                }
            } else {
                this.toastHandlerService.generateToast(DUPLICATE_ERROR_MESSAGE, 'OK', 2000);
            }
            /*---------------------------------*/

        }
    }

    buttonText() {
        if (this.loading) {
            return "PLEASE WAIT";
        }
        else {
            if (this.myNgForm.value.id == null) {
                return "SAVE";
            } else {
                return "UPDATE";
            }
        }
    }

    updateRole(): void {
        this.roleService
            .putRole(this.myNgForm.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                data => {

                    /*Execute default form submission methods */
                    this.onFormSubmission(PUT_SUCCESS);
                    /*---------------------------*/

                    /* Fetch the Updated Records */
                    this.reloadRoles.emit(Object.assign({}, true));
                    /*---------------------------*/

                },
                err => {
                    /* In case of Failure, Display Error Message */
                    this.toastHandlerService.generateToast(ERROR_MESSAGE, 'OK', 2000);
                    /*--------------------------------------------*/
                });
    }

    onFormSubmission(message: string): void {
        /* Reset Form Fields */
        this.resetFormDetails();
        /*-------------------*/

        /* Display Message */
        this.toastHandlerService.generateToast(message, 'OK', 2000);
        /*--------------------*/
    }

    resetFormDetails(): void {
        /*Reset Form*/
        this.roleForm.enable();
        /*-----------*/

        /*Reset Form Directive*/
        this.formDirective.resetForm();
        /*----------*/

        this.editValue = null;
        this.loading = false;
    }

    // onlyCharacters(evt) {
    //     let theEvent = evt || window.event;

    //     // Handle key press
    //     let key = theEvent.keyCode || theEvent.which;
    //     key = String.fromCharCode(key);

    //     let regex = /[a-zA-Z ]|\./;
    //     if (!regex.test(key)) {
    //         theEvent.returnValue = false;
    //         if (theEvent.preventDefault) { theEvent.preventDefault(); }
    //     }
    // }
}
