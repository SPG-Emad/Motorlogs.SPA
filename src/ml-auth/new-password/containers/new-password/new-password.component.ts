import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subscription, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalConstants } from 'ml-shared/common/global-constants';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';


const API_ENDPOINT = GlobalConstants.apiURL + 'Verifications/ChangePassword';
@Component({
    selector: 'ml-new-password',
    templateUrl: './new-password.component.html',
    styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit, OnDestroy {

    key: string;
    sub: Subscription;
    loginForm: FormGroup;
    minPw = 8;
    maxPw = 15;
    loading = false;
    private _unsubscribeAll = new Subject();

    ngOnInit() {
        this.sub = this.route.queryParams.subscribe(params => {
            this.key = params['key'];
        });

        this.loginForm = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(this.minPw)]],
            password2: ['', [Validators.required]]
        }, { validator: passwordMatchValidator });

        setTimeout(() => {
            this._fuseConfigService.config = {
                layout: {
                    navbar: {
                        hidden: true
                    },
                    toolbar: {
                        hidden: true
                    },
                    footer: {
                        hidden: true
                    },
                    sidepanel: {
                        hidden: true
                    }
                }
            };
        });

    }

    /* Shorthands for form controls (used from within template) */
    get password() { return this.loginForm.get('password'); }
    get password2() { return this.loginForm.get('password2'); }

    /* Called on each input in either password field */
    onPasswordInput() {
        if (this.loginForm.hasError('passwordMismatch')) {
            this.password2.setErrors([{ passwordMismatch: true }]);
        }
        else {
            this.password2.setErrors(null);
        }
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private _fuseConfigService: FuseConfigService,
        public formBuilder: FormBuilder,
        private http: HttpClient,
        private _matSnackBar: MatSnackBar) {
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const model = {
                VID: this.key,
                Password: this.password.value
            };
            this.loading = true;
            this.http.post(API_ENDPOINT, model, { responseType: 'text' })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(
                    (response: any) => {
                        if (response === '1') {
                            this._matSnackBar.open('Password changed successfully', 'OK', {
                                verticalPosition: 'bottom',
                                duration: 3000
                            });
                            this.router.navigate(['auth/login']);
                        } else {
                            this._matSnackBar.open('Unable to update your password', 'OK', {
                                verticalPosition: 'bottom',
                                duration: 3000
                            });
                            this.loading = false;
                        }
                    },
                    (error: string) => {
                        this._matSnackBar.open('OOPS !! Something went wrong: ' + error, 'OK', {
                            verticalPosition: 'bottom',
                            duration: 3000
                        });
                        this.loading = false;
                    });
        }
    }
}

export const passwordMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    if (formGroup.get('password').value === formGroup.get('password2').value) {
        return null;
    }
    else {
        return { passwordMismatch: true };
    }
};

export interface Recovery {
    isValidKey: boolean;
    userId: number;
}
