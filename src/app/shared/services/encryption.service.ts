import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {

    plainText: string;
    encryptText: string;

    // Unique Code for Encryption & Decryption
    SECRET: string = "Sk1238WLDL";
    encryptPassword: string = "motorLogxyz";
    decryptPassword: string = "motorLogxyz";

    //Output Encrypted or Decrypted Text
    conversionEncryptOutput: string;
    conversionDecryptOutput: string;

    constructor() { }

    convertToEncOrDecFormat(conversion: string, text: string) {
        if (conversion === "encrypt") {
            // return CryptoJS.AES.encrypt(text, this.encryptPassword.trim()).toString();
            return this.enc(text);
        }
        else {
            // return CryptoJS.AES.decrypt(text, this.decryptPassword.trim()).toString(CryptoJS.enc.Utf8);
            return this.dec(text);
        }
    }

    enc(plainText) {
        var b64 = CryptoJS.AES.encrypt(plainText, this.SECRET).toString();
        var e64 = CryptoJS.enc.Base64.parse(b64);
        var eHex = e64.toString(CryptoJS.enc.Hex);
        return eHex;
    }

    dec(cipherText) {
        var reb64 = CryptoJS.enc.Hex.parse(cipherText);
        var bytes = reb64.toString(CryptoJS.enc.Base64);
        var decrypt = CryptoJS.AES.decrypt(bytes, this.SECRET);
        var plain = decrypt.toString(CryptoJS.enc.Utf8);
        return plain;
    }

    encryptDecryptText(conversion: string, text: any): any {
        /*Check conversion type*/
        /*There are two conversion types
        * 1 - encrypt 
        * 2 - decrypt
        */
        if (conversion == "encrypt") {

            /*Loop over Object to extract values from it and then encrypt it */

            for (let [key, value] of Object.entries(text)) {

                if (typeof value === "object" && value !== null) {
                    let objVal = value;
                    for (let [key, value] of Object.entries(objVal)) {
                        this.encrypt(key, value, text);
                    }
                } else {
                    this.encrypt(key, value, text);
                }
            }
            /*------------------------------------------*/


            /*Fetch the encrypted value and store it*/
            let encrpytedObj = text;
            /*--------------------*/

            /*Return the Encrypted value*/
            return encrpytedObj;
            /*-------------------------*/
        }
        else {

            /*Loop over Object to extract values from it and then decrypt it */
            for (let [key, value] of Object.entries(text)) {
                let encryptedText = String(value);
                let decrypedText = CryptoJS.AES.decrypt(encryptedText.trim(), this.decryptPassword.trim()).toString(CryptoJS.enc.Utf8);
                text[key] = decrypedText;
            }
            /*--------------------------------*/


            /*Fetch the ecrypted value and store it*/
            let decrpytedObj = text;
            /*---------------------*/


            /*Return the Decrypted value*/
            return decrpytedObj;
            /*-------------------------*/
        }
        /*-----------------------*/
    }

    encrypt(key, value, text) {
        let textString = String(value);
        let encrpytedValue = CryptoJS.AES.encrypt(textString.trim(), this.encryptPassword.trim()).toString();
        text[key] = encrpytedValue;
    }

    decrypt(key, value, text) {
        let encryptedText = String(value);
        let decrypedText = CryptoJS.AES.decrypt(encryptedText.trim(), this.decryptPassword.trim()).toString(CryptoJS.enc.Utf8);
        text[key] = decrypedText;
    }
}

