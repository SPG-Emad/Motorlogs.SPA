import { NgModule, InjectionToken } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes, PreloadAllModules } from "@angular/router";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import "hammerjs";

import { FuseModule } from "@fuse/fuse.module";
import { FuseSharedModule } from "@fuse/shared.module";
import {
    FuseProgressBarModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,
} from "@fuse/components";

// components
import { WelcomeModule } from "./components/welcome/welcome.module";
import { fuseConfig } from "./shared/fuse-config";

import { AppComponent } from "./containers/app/app.component";
import { LayoutModule } from "./containers/layout/layout.module";

import { Store } from "ml-shared/common/store";

// My modules
import { ML_AuthModule } from "ml-auth/ml-auth.module";
import { ML_ErrorPagesModule } from "ml-errors/ml-errors.module";
import { ML_OthersModule } from "ml-others/ml-others.module";
import { ML_RoutineModule } from "ml-routine/ml-routine.module";
import { ML_SetupModule } from "ml-setup/ml-setup.module";
import { ML_SharedModule } from "ml-shared/ml-shared.module";
import { DeviceDetectorModule } from "ngx-device-detector";
import { GlobalErrorInterceptorProvider } from "./shared/services/global-error-handler";
import { ServerErrorInterceptorProvider } from "./shared/services/server-error.interceptor";
import { BnNgIdleService } from "bn-ng-idle"; // import bn-ng-idle service
import { AuthInterceptor } from './shared/services/auth.interceptor';
// import { NgxSmartModalModule } from 'ngx-smart-modal';
import { AgGridModule } from 'ag-grid-angular';


/*NGRX Imports*/ 
import { StoreModule } from '@ngrx/store';
// import { reducer } from './../ml-setup/shared/ngrx/reducers/user.reducer';
import { BoldTextPipe } from './shared/pipes/bold-text.pipe';
import { mlStepReducers } from 'ml-setup/shared/ngrx/ml-setup.state';
import { UserProfileService } from './shared/services/user-profile.service';
/*-------------*/ 
export const ROOT_REDUCER = new InjectionToken<any>('Root Reducer');


const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "welcome",
        pathMatch: "full"
    },
    {
        path: "**",
        redirectTo: "error"
    }
];



@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,

        RouterModule.forRoot(appRoutes, {
            preloadingStrategy: PreloadAllModules,
        }),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        AgGridModule.withComponents([]),

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        WelcomeModule,

        // Motorlogs custom made modules
        ML_SharedModule,
        ML_ErrorPagesModule,
        ML_AuthModule,
        ML_RoutineModule,
        ML_SetupModule,
        ML_OthersModule,
        // NgxSmartModalModule.forRoot(),
        DeviceDetectorModule.forRoot(),

        // Initializing NGRX store
        StoreModule.forRoot(ROOT_REDUCER)

    ],
    bootstrap: [AppComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        {provide: ROOT_REDUCER, useValue: { count: mlStepReducers }},
        Store,
        GlobalErrorInterceptorProvider,
        ServerErrorInterceptorProvider,
        BnNgIdleService,
      
    ]
})
export class AppModule { }