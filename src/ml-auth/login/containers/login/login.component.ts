import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { AuthService } from 'ml-auth/shared/services/ml-auth/ml-auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'ml-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm = this._fb.group({
        email: ['emadkhanqai@gmail.com', [Validators.required, Validators.email]],
        password: ['crystal123', Validators.required]
    });

    loading: boolean;
    error: string;

    constructor(
        private _fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private _matSnackBar: MatSnackBar,
        private _fuseConfigService: FuseConfigService) {

    }

    ngOnInit() {
        localStorage.clear();
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

    async loginUser(event: FormGroup) {
        if (this.loginForm.valid) {
            const { email, password } = event.value;
            try {
                this.loading = true;

                /*Authenticate User*/
                await this.authService.loginUser(email, password);
                /*-----------------*/

                /*Display success message*/
                this.responseMessage('Welcome to Motorlogs', 2000);
                /*-----------------------*/

                this.router.navigate(["welcome"]);

                this.loading = false;
            } catch (err) {
                this.error = err.message;

                /*Display Failed message*/
                this.responseMessage('Failed to login', 3000);
                /*-----------------------*/

                this.loading = false;
            }
        }
    }

    responseMessage(message: string, duration: number) {
        this._matSnackBar.open(message, 'OK', {
            verticalPosition: 'bottom',
            duration: duration
        });
    }

}
