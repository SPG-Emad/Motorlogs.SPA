import { Injectable } from '@angular/core';
import { EncryptionService } from './encryption.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'ml-auth/shared/services/ml-auth/ml-auth.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageHandlerService {

    /**
    * Developed by @AhmedKhan
    * 
    * Constructor
    * 
    *  @param {Router} - Handles Routing 
    *  @param {EncryptionService} - Handles encryption and decryption
    *  @param {MatDialog} - Handles closing Dialog on session expiry
    * 
    */
    plainText: any;

    constructor(
        private router: Router,
        private encrypt: EncryptionService,
        private dialogRefs: MatDialog,
    ) {
       
    }

    getSession(key: string): any {

        /*Fetch Token & key value from session storage */
        let token = localStorage.getItem('token');
        let stringValue = localStorage.getItem(key);
        /*----------------------------------------------*/

        if (token && stringValue !== null) {

            /*Parse the string value to Json Object*/
            let jsonvalue = JSON.parse(stringValue);
            /*-------------------------------------*/


            /*Decrypt the encrypted session value*/
            //let decryptVal = this.encrypt.encryptDecryptText('decrypt', jsonvalue);
            /*-----------------------*/

            /*Return the Decrypted value*/
            return jsonvalue;
        }

    }

    setSession(key: string, value: string | object): void {
        this.plainText = value;
        /*Check if key and value are not empty*/
        if (key && value) {

            /*Encrypt the encrypted session value*/
            // let encryptVal = this.encrypt.encryptDecryptText('encrypt', value);
            let encryptVal = value;
            /*-----------------------------------*/

            /*Set session storage*/
            localStorage.setItem(key, JSON.stringify(encryptVal));
            /*-------------------*/

        }
        /*------------------------------------*/

    }

    getToken(): any {

        /*Fetch Token from session */
        let token = localStorage.getItem('token');
        /*-------------------------*/

        /*Check if token exists */
        if (token) {

            /*Return the token*/
            return token;
            /*-------------*/
        }
        /*-------------------------*/

    }

    setToken(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    redirection() {
        /*Close all modal and Clear sessions 
          and redirect to login*/
        this.dialogRefs.closeAll();
        localStorage.clear();
        this.router.navigate(['/']);
        /*---------------------------------*/
    }
}
