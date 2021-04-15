import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { LocalStorageHandlerService } from './local-storage-handler.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private cookieHandler: LocalStorageHandlerService){}

    intercept(request: HttpRequest<any>, newRequest: HttpHandler): Observable<HttpEvent<any>> {
        const tokenInfo = this.cookieHandler.getToken();
        if (tokenInfo) {
            request = request.clone({
                setHeaders: {
                    "Authorization": `Bearer ${tokenInfo}`,
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });
        }
        
       return newRequest.handle(request);
    }
}