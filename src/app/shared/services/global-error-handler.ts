import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from './error.service';
import { LoggingService } from './logging.service';
import { AuthService } from 'ml-auth/shared/services/ml-auth/ml-auth.service';
import { navigation } from 'app/shared/navigation/navigation';
import { Router } from '@angular/router';
import { Store } from "ml-shared/common/store";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private injector: Injector, private store: Store) { }

    handleError(error: Error | HttpErrorResponse) {
        const errorService = this.injector.get(ErrorService);
        const logger = this.injector.get(LoggingService);
        // const notifier = this.injector.get(NotificationService);

        let message;
        let stackTrace;
        if (error instanceof HttpErrorResponse) {
            // Server error
            message = errorService.getServerErrorMessage(error);

            // un-comment this line when system is ready
            // notifier.showError(message);
        } else {
            // Client Error
            message = errorService.getClientErrorMessage(error);
            stackTrace = errorService.getClientErrorStackTrace(error);

            // un-comment this line when system is ready
            // notifier.showError(message);
        }
        // Always log errors
        logger.logError(stackTrace);
        console.error(error);
        // let x = error.message;
        // if (x.toLowerCase().includes('session expired!')) {
        //     alert('Session timeout!');
        //     this.logoutUser();
        //     window.location.href = "/auth/login";
        // }
    }

    logoutUser() {
        navigation.splice(0, navigation.length);
        window.sessionStorage.clear();
        this.store.set('notifications', null);
    }
}



export const GlobalErrorInterceptorProvider = {
    provide: ErrorHandler,
    useClass: GlobalErrorHandler
};
