import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MyProfileService } from 'ml-others/shared/services/my-profile/my-profile.service';
import { FormBuilder, Validators, NgForm } from '@angular/forms';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import { Store } from 'ml-shared/common/store';
import { UserProfileService } from 'app/shared/services/user-profile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'ml-general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.scss'],

})
export class GeneralComponent implements OnInit, OnDestroy {

    constructor(
        private toastHandlerService: ToastHandlerService,
        private myProfileService: MyProfileService,
        private userProfileService: UserProfileService,
        private fb: FormBuilder,
        private store: Store,
        private cookieService: CookieService) { }

    public imgURL: any;
    public imgDbString: any;
    public message: string;
    private _unsubscribeAll = new Subject();

    loading: boolean;

    generalForm = this.fb.group({
        picture: [""],
        firstName: ["", [Validators.required, Validators.maxLength(50)]],
        lastName: ["", [ Validators.maxLength(50)]],
        designation: [{ value: '', disabled: true }, Validators.required],
        mobile: ["", [Validators.maxLength(15)]],
        directPhone: ["", [Validators.maxLength(15)]],
        email: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(255), Validators.pattern('^[A-Za-z][a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.][a-zA-Z0-9-.]+$')]],
    });

    @ViewChild('f', { static: true }) myNgForm: NgForm;

    ngOnInit(): void {
        this.loading = true;
        this.bindData();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    resetFields() {
        this.loading = true;
        this.bindData();
    }

    bindData() {
        this.myProfileService.getUserProfileDetailsById()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this.setUpdateValues(this.myProfileService.userProfile);
            this.loading = false;
        });
    }

    setUpdateValues(editparam) {
        const cloneObj = Object.assign({}, this.generalForm.getRawValue(), editparam);
        this.generalForm.patchValue(cloneObj);
        this.generalForm.patchValue({ designation: cloneObj.roleName });
        this.generalForm.patchValue({ directPhone: cloneObj.direct });
        this.imgURL = cloneObj.picture;
    }

    updateProfile(): void {
        this.loading = true;
        if (this.myNgForm.valid) {
            this.myProfileService.updateGeneralInformation(this.generalForm.value)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(
                data => {
                    this.toastHandlerService.generateToast(data.message, 'OK', 2000);
                    Object.assign(this.myProfileService.userProfile, this.generalForm.value);
                    const cloneObj = Object.assign(this.userProfileService.currentUser, this.generalForm.value);
                    this.store.set("user", cloneObj);
                    localStorage.setItem('userObj', JSON.stringify(this.userProfileService.currentUser));
                    this.cookieService.set('userObj', JSON.stringify(this.userProfileService.currentUser));
                    this.loading = false;
                },
                err => {
                    /* In case of Failure, Display Error Message */
                    this.toastHandlerService.generateToast(err, 'OK', 2000);
                    /*--------------------------------------------*/
                    this.loading = false;
                });
        }
    }

    loadImage(filesEvent): void {

        /*----------------------------------------------------
        * Get MiME TYPE and length of files from Event Object
        * Proceed if length is not zero and  Mimetype is of Image.
        *----------------------------------------------------*/
        const eventfiles = filesEvent.target.files;
        const mimeType = eventfiles[0].type;

        const match = (mimeType.match(/image\/*/) == null) ? this.message = "Image Type is not Supported" : this.message = "";
        if (eventfiles.length !== 0 &&
            match == "") {

            const file: any = (filesEvent.target as HTMLInputElement).files[0];

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
            const imageData = reader.result;
            const base64String = "data:image/png;base64,";

            if (!(imageData as string).includes(base64String)) {
                const rawData: any = (imageData as string);
                if (rawData.length > 1) {
                    this.imgURL = imageData;
                    this.imgDbString = rawData;
                }
            } else {
                const rawData: any = (imageData as string).split("base64,");
                if (rawData.length > 1) {
                    this.imgURL = imageData;
                    this.imgDbString = rawData[1];
                }
            }
        };

        reader.readAsDataURL(file);
        /*--------------------------------------------------*/

    }
}
