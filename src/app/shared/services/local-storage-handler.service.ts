import { Injectable } from "@angular/core";
import { EncryptionService } from "./encryption.service";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class LocalStorageHandlerService {
    plainText: any;

    constructor(private router: Router, private dialogRefs: MatDialog) {}

    getFromStorage(key: string): any {
        /*Fetch Token & key value from session storage */
        let token = localStorage.getItem("token");
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

    setStorage(key: string, value: string | object): void {
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
        let token = localStorage.getItem("token");
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
        this.router.navigate(["/"]);
        /*---------------------------------*/
    }
}
