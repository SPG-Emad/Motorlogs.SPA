import { Component, OnInit, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import { MyProfileService } from 'ml-others/shared/services/my-profile/my-profile.service';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import { FormBuilder, Validators, NgForm, FormGroupDirective } from '@angular/forms';
import { passwordMatchValidator } from 'ml-auth/new-password/containers/new-password/new-password.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ml-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

    private _unsubscribeAll = new Subject();
    loading: boolean;
    minPw = 8;
    maxPw = 15;

    passwordForm = this.fb.group({
        current: ["", Validators.required],
        password: ['', [Validators.required, Validators.minLength(this.minPw)]],
        password2: ['', [Validators.required]]
    }, { validator: passwordMatchValidator });

    @ViewChild('f', { static: true }) myNgForm: NgForm;
    @ViewChild('f', { static: true }) formDirective: FormGroupDirective;

    constructor(private toastHandlerService: ToastHandlerService, private myProfileService: MyProfileService, private fb: FormBuilder) { }

    ngOnInit() {
    }
    /* Shorthands for form controls (used from within template) */
    get current() { return this.passwordForm.get('current'); }
    get password() { return this.passwordForm.get('password'); }
    get password2() { return this.passwordForm.get('password2'); }

    /* Called on each input in either password field */
    onPasswordInput() {
        if (this.passwordForm.hasError('passwordMismatch')) {
            this.password2.setErrors([{ passwordMismatch: true }]);
        }
        else {
            this.password2.setErrors(null);
        }
    }
    
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    updatePassword() {
        this.loading = true;

        const passwordDto = {
            vID: this.current.value,
            password: this.password.value
        };

        if (this.myNgForm.valid) {
            this.myProfileService.updatePassword(
                passwordDto
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                data => {
                    this.toastHandlerService.generateToast(data.message, 'OK', 2000);
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
