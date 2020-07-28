import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from './error.service';
import { LoggingService } from './logging.service';
 


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) { }

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
    }
}

export const GlobalErrorInterceptorProvider = {
    provide: ErrorHandler,
    useClass: GlobalErrorHandler
}
