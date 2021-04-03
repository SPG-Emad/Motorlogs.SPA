import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, NgForm, FormGroupDirective } from '@angular/forms';
import { ConfigurationService } from 'ml-setup/shared/services/configuration/configuration.service';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


/* PayType Constants */
const ERROR_MESSAGE = "An Error has occurred! Please try again later";
const DUPLICATE_ERROR_MESSAGE = "Error! Cannot insert duplicate Value.";
const PUT_SUCCESS = "Record Updated Successfully";
const POST_SUCCESS = "Record Added Successfully";
/*----------------------*/

@Component({
    selector: 'ml-pay-type-form',
    templateUrl: './pay-type-form.component.html',
    styleUrls: ['./pay-type-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayTypeFormComponent implements OnInit, OnDestroy {

    constructor(
        private fb: FormBuilder,
        private configurationService: ConfigurationService,
        private toastHandlerService: ToastHandlerService) { }

    loading: boolean;
    colID?: number;
    private _unsubscribeAll = new Subject();

    @Input() editValue: any;
    @Output() reloadPayType = new EventEmitter<any>();

    payTypeForm = this.fb.group({
        id: [],
        valText: ["", Validators.required],
        code: ["", Validators.required],
        backgrounds: ["", Validators.required],
    });

    get valText() {
        return this.payTypeForm.get('valText').value.trim();
    }

    get code() {
        return this.payTypeForm.get('code').value.trim();
    }

    get backgrounds() {
        return this.payTypeForm.get('backgrounds').value;
    }
    selectedBackground: string = "";

    backgroundData = ['#abe1cc', '#f4bdf9', '#c7ddfc', '#ffddda', '#ffdf99', '#ffbbb6', '#abe1cc'];

    @ViewChild('f', { static: true }) myNgForm: NgForm;
    @ViewChild('f', { static: true }) formDirective: FormGroupDirective;

    createUpdatePayType(): void {
        if (this.payTypeForm.valid) {
            if (this.myNgForm.value.id == null) {
                this.createPayType();
            } else {
                this.updatePayType();
            }
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    createPayType() {
        this.loading = true;

        const params = {
            valText: this.valText.trim(),
            code: this.code.trim(),
            details: JSON.stringify({ background: this.backgrounds }),
            columnCode: 'PT'
        };

        if(params.code === '' || params.valText === ''){
            this.toastHandlerService.generateToast('Please enter the requried fields', 'OK', 2000);
            this.loading = false;
            return;
        }


        this.configurationService.insertConfiguration(params)
        .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                data => {

                    /*Execute Default Form Submission Methods */
                    this.onFormSubmission(POST_SUCCESS);
                    /*---------------------------*/

                    /* Fetch the Updated Records */
                    this.reloadPayType.emit(Object.assign({}, true));
                    /*---------------------------*/

                    this.loading = false;
                },
                err => {
                    /* In case of Failure, Display Error Message */
                    this.toastHandlerService.generateToast(err, 'OK', 2000);
                    this.loading = false;
                    /*--------------------------------------------*/
                });
    }

    updatePayType() {
      
        this.loading = true;

        const object = Object.assign({}, this.payTypeForm.getRawValue());
        object.details = JSON.stringify({ background: this.backgrounds });
        object.colID = this.colID;
        object.columnCode= 'PT';
        
        if(object.code === '' || object.valText === ''){
            this.toastHandlerService.generateToast('Please enter the requried fields', 'OK', 2000);
            this.loading = false;
            return;
        }

        this.configurationService
            .updateConfiguration(object)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                data => {

                    /*Execute default form submission methods */
                    this.onFormSubmission(PUT_SUCCESS);
                    /*---------------------------*/

                    /* Fetch the Updated Records */
                    this.reloadPayType.emit(Object.assign({}, true));
                    /*---------------------------*/

                    this.loading = false;

                },
                err => {
                    /* In case of Failure, Display Error Message */
                    this.toastHandlerService.generateToast(err, 'OK', 2000);
                    this.loading = false;
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
        this.payTypeForm.enable();
        /*-----------*/

        /*Reset Form Directive*/
        this.formDirective.resetForm();
        /*----------*/

        this.colID = null;
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

    setUpdateValues(editparam) {
        const cloneObj = Object.assign({}, this.payTypeForm.getRawValue(), editparam);
        cloneObj.backgrounds = JSON.parse(cloneObj.details).background;
        this.colID = cloneObj.colID;
        this.payTypeForm.patchValue(cloneObj);
       
    }

    ngOnInit() {
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
}
