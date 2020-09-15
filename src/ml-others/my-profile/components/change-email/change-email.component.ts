import { Component, OnInit, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import { MyProfileService } from 'ml-others/shared/services/my-profile/my-profile.service';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import { FormBuilder, Validators, NgForm, FormGroupDirective } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ml-change-email',
    templateUrl: './change-email.component.html',
    styleUrls: ['./change-email.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeEmailComponent implements OnInit, OnDestroy {

    private _unsubscribeAll = new Subject();
    loading: boolean;

    emailForm = this.fb.group({
        email: ["", [Validators.required, Validators.maxLength(255), Validators.pattern('^[A-Za-z][a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.][a-zA-Z0-9-.]+$')]],
        password: ["", Validators.required],
    });

    @ViewChild('f', { static: true }) myNgForm: NgForm;
    @ViewChild('f', { static: true }) formDirective: FormGroupDirective;

    constructor(private toastHandlerService: ToastHandlerService, private myProfileService: MyProfileService, private fb: FormBuilder) { }

    ngOnInit() {
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    updateEmailAddress() {
        this.loading = true;
        if (this.myNgForm.valid) {
            this.myProfileService.updateEmailAddress(this.emailForm.value)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(
                data => {
                    this.toastHandlerService.generateToast(data.message, 'OK', 2000);
                    this.myProfileService.userProfile.login = this.emailForm.controls["email"].value;
                    this.myProfileService.userProfile.email = this.emailForm.controls["email"].value;
                    this.loading = false;
                    this.formDirective.resetForm();
                },
                err => {
                    this.toastHandlerService.generateToast(err, 'OK', 2000);
                    this.loading = false;
                });
        }
    }

}
