// Single component module
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "ml-setup/shared/shared.module";
import { SiteTargetsComponent } from "./containers/site-targets/site-targets.component";
import { FunctionFiltersComponent } from './components/function-filters/function-filters.component';
import { AgGridModule } from 'ag-grid-angular';
import { NgSelectModule } from 'ng-custom-select';

export const ROUTES: Routes = [
    {
        path: "",
        component: SiteTargetsComponent
    }
];

@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forChild(ROUTES), 
        SharedModule,
        AgGridModule.withComponents([]),
        NgSelectModule
    ],
    declarations: [
        SiteTargetsComponent, 
        FunctionFiltersComponent
    ]
})
export class SiteTargetsModule {}
