// Single component module
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "ml-setup/shared/shared.module";
import { PermissionsComponent } from "./containers/permissions/permissions.component";
import { AddCustomComponent } from "./components/add-custom/add-custom.component";
import { DepartmentMasterListComponent } from "./components/department-master-list/department-master-list.component";
import { PermissionsSheetComponent } from "./components/permissions-sheet/permissions-sheet.component";
import { UserRolesListComponent } from "./components/user-roles-list/user-roles-list.component";
import { FunctionFiltersComponent } from "./components/function-filters/function-filters.component";
import { LegendsComponent } from "./components/legends/legends.component";

// import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FuseSharedModule } from '@fuse/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import {MatMenuModule} from '@angular/material/menu';
import { CustomHeader } from './components/group-row-inner-renderer/group-row-inner-renderer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BoldTextPipe } from 'app/shared/pipes/bold-text.pipe';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CustomLoadingOverlayComponent } from './components/loading-overlay/custom-loading-overlay.component';

export const ROUTES: Routes = [
    {
        path: "",
        component: PermissionsComponent
    }
];

@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forChild(ROUTES), 
        // SharedModule, 
        MatDatepickerModule,
        MatStepperModule,
        MatSliderModule, 
        // NgxSmartModalModule.forChild(), 
        AgGridModule.withComponents([CustomHeader,CustomLoadingOverlayComponent]),
        FuseSharedModule,
        MatMenuModule,
        MatDialogModule,
        MatProgressSpinnerModule
    ],
    declarations: [
        BoldTextPipe,
        PermissionsComponent,
        AddCustomComponent,
        DepartmentMasterListComponent,
        FunctionFiltersComponent,
        LegendsComponent,
        PermissionsSheetComponent,
        UserRolesListComponent,
        CustomHeader,
        CustomLoadingOverlayComponent,
    ],
    entryComponents: [AddCustomComponent,CustomLoadingOverlayComponent]
})
export class PermissionsModule { }
