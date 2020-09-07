// Shared folder module
import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FuseSharedModule } from '@fuse/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { ML_SharedModule } from 'ml-shared/ml-shared.module';
import { NgSelectModule } from 'ng-custom-select';
import { TargetsFilterComponent } from "./components/targets-filter/targets-filter.component";
import { TargetsSheetComponent } from "./components/targets-sheet/targets-sheet.component";
import { ConfigurationService } from "./services/configuration/configuration.service";
import { DepartmentsService } from "./services/departments/departments.service";
import { IndividualTargetsService } from "./services/individual-targets/individual-targets.service";
import { PermissionsService } from "./services/permissions/permissions.service";
import { SiteTargetsService } from "./services/site-targets/site-targets.service";
import { RolesService } from "./services/user-access-rights/roles.service";
import { UsersService } from "./services/user-access-rights/users.service";
import { TargetToastComponent } from './components/target-toast/target-toast.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomLoadingOverlayComponent } from './components/custom-loading-overlay/custom-loading-overlay.component';

@NgModule({
    declarations: [TargetsFilterComponent, TargetsSheetComponent, TargetToastComponent, CustomLoadingOverlayComponent],
    exports: [TargetsFilterComponent, TargetsSheetComponent, FuseSharedModule, ML_SharedModule,CustomLoadingOverlayComponent],
    imports: [
        CommonModule, 
        NgSelectModule, 
        ReactiveFormsModule, 
        FuseSharedModule, 
        MatProgressSpinnerModule,
        ML_SharedModule,
        AgGridModule.withComponents([CustomLoadingOverlayComponent]),
        NgSelectModule
    ],
    entryComponents:[TargetToastComponent]
    
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                ConfigurationService,
                DepartmentsService,
                IndividualTargetsService,
                PermissionsService,
                SiteTargetsService,
                RolesService,
                UsersService
            ]
        };
    }
}
