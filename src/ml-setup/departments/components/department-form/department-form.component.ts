import { Component, ChangeDetectionStrategy, Input, ViewChild, EventEmitter, Output, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, NgForm, FormGroupDirective } from '@angular/forms';
import { DepartmentsService } from 'ml-setup/shared/services/departments/departments.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


/* Department Constants */
const PUT_SUCCESS = "Record Updated Successfully";
const POST_SUCCESS = "Record Created Successfully";

/*----------------------*/

@Component({
    selector: 'ml-department-form',
    templateUrl: './department-form.component.html',
    styleUrls: ['./department-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})

export class DepartmentFormComponent implements OnInit, OnDestroy {

    @Input() editValue: any;
    @Output() reloadDepartment = new EventEmitter<any>();
    private _unsubscribeAll = new Subject();

    constructor(
        private fb: FormBuilder,
        private departmentService: DepartmentsService,
    ) { }

    // Store Image path with and without Base64
    public imgURL: any;
    public imgDbString: any;
    public pageType = "new";

    // Display Message
    public message: string;

    departmentForm = this.fb.group({
        id: [],
        picture: [""],
        name: ["", Validators.required],
        abbr: ["", Validators.required],
        deptId: [""]
    });

    departmentsList = [];
    loading: boolean;

    @ViewChild('f', { static: true }) myNgForm: NgForm;
    @ViewChild('f', { static: true }) formDirective: FormGroupDirective;

    ngOnInit() {
        
        this.departmentService.refreshDepartmentDropDown
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.departmentsList = [];
                this.departmentService.departmentList.map((res) => {
                    this.departmentsList.push(
                        {
                            id: res.id,
                            description: res.name,
                            code: res.abbr
                        }
                    );
                });
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'editValue': {
                        if (this.editValue) {
                            this.setUpdateValues(this.editValue);
                        }
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
        let cloneObj = Object.assign({}, this.departmentForm.getRawValue(), editparam);
        this.departmentForm.patchValue(cloneObj);
        if (cloneObj && cloneObj.picture) {
            this.imgURL = cloneObj.picture;
        } else {
            this.imgURL = "";
        }
    }

    createDepartment(): void {
        /*Make the department data */

        this.loading = true;
        const object = Object.assign({}, this.myNgForm.value, this.departmentForm.controls['deptId'].value);

        if (this.departmentForm.controls['deptId'].value == null || this.departmentForm.controls['deptId'].value === "") {
            this.departmentService.generateToast('Please select any department from listing', 'OK');
            this.loading = false;
            return;
        }

        this.departmentService.postDepartment(object)
        .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                () => {

                    /*Execute Default Form Submission Methods */
                    this.onFormSubmission(POST_SUCCESS);
                    /*---------------------------*/

                    /* Fetch the Updated Records */
                    this.reloadDepartment.emit(Object.assign({}, true));
                    /*---------------------------*/

                    this.loading = false;

                    this.departmentService.refreshDepartmentList.next();
                },
                err => {

                    /* In case of Failure, Display Error Message */
                    this.departmentService.generateToast(err, 'OK');
                    /*--------------------------------------------*/

                    this.loading = false;
                });

    }

    createUpdateDepartment() {
        /*Check if Form is filled*/
        if (this.departmentForm.valid) {

            /*Check If ID is not set, Create new department else Update*/
            if (this.myNgForm.value.id == null) {
                this.createDepartment();
            } else {
                this.updateDepartment();
            }
            /*--------------------------------------------------------*/

        }
    }



    updateDepartment(): void {
        this.loading = true;

        this.departmentService
            .putDepartment(this.myNgForm.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                () => {

                    /*Execute default form submission methods */
                    this.onFormSubmission(PUT_SUCCESS);
                    /*---------------------------*/

                    /* Fetch the Updated Records */
                    this.reloadDepartment.emit(Object.assign({}, true));
                    /*---------------------------*/
                    this.loading = false;

                    this.departmentService.refreshDepartmentList.next();
                },
                (err) => {
                    /* In case of Failure, Display Error Message */
                    this.departmentService.generateToast(err, 'OK');
                    /*--------------------------------------------*/
                    this.loading = false;
                });
    }

    onFormSubmission(message: string) {

        /* Reset Form Fields */
        this.resetFormDetails();
        /*-------------------*/

        /* Display Success Message */
        this.departmentService.generateToast(message, 'OK');
        /*--------------------------*/
    }

    resetFormDetails(): void {
        this.removeLoadedImage();

        /*Reset Form Directive*/
        this.formDirective.resetForm();
        /*----------*/

        this.editValue = null;
        this.loading = false;
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

    loadImage(filesEvent): void {

        /*----------------------------------------------------
        * Get MiME TYPE and length of files from Event Object
        * Proceed if length is not zero and  Mimetype is of Image.
        *----------------------------------------------------*/
        let eventfiles = filesEvent.target.files;
        const mimeType = eventfiles[0].type;

        let match = (mimeType.match(/image\/*/) == null) ? this.message = "Image Type is not Supported" : this.message = "";
        if (eventfiles.length !== 0 &&
            match == "") {

            let file: any = (<HTMLInputElement>filesEvent.target).files[0];

            /*Call method to convert image to base64*/
            this.imageToBase64(file);
            /*----------------------------------------*/


        } else {
            this.imgURL = "";
        }

    }

    removeLoadedImage(): void {
        this.message = '';
        this.imgURL = '';
        this.imgDbString = '';
    }

    imageToBase64(file) {

        /*Fetch Image from File Read and Convert to Base64*/
        const reader = new FileReader();

        reader.onloadend = (_event) => {
            let imageData = reader.result;

            let rawData: any = (<string>imageData).split("base64,");
            if (rawData.length > 1) {
                this.imgURL = imageData;
                this.imgDbString = rawData[1];
            }
        }

        reader.readAsDataURL(file);
        /*--------------------------------------------------*/

    }
}