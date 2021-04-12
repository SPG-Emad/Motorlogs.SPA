import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from 'ml-shared/common/global-constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
    selector: 'ml-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
 
    private _unsubscribeAll = new Subject();

    forgotPasswordForm = this._fb.group({
        email: ['', [Validators.required, Validators.email]]
    });

    loading: boolean;
    error: string;

    constructor(private _fb: FormBuilder, private _router: Router, private _matSnackBar: MatSnackBar, private http: HttpClient,
        private _fuseConfigService: FuseConfigService) { }

    ngOnInit() {
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

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    async validateRequest() {
        if (this.forgotPasswordForm.valid) {
            const email = this.forgotPasswordForm.get('email').value;
            this._matSnackBar.open('You will soon receive recovery email.', 'OK', {
                verticalPosition: 'bottom',
                duration: 3000
            });
            this.http.post(GlobalConstants.apiURL + 'verifications/forgotPassword', { email })
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                this._router.navigate(['/auth/login']);
            });
           
        }
    }
}
