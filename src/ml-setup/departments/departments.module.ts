// Single component module
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "ml-setup/shared/shared.module";
import { DepartmentsComponent } from "./containers/departments/departments.component";
import { DepartmentFormComponent } from "./components/department-form/department-form.component";
import { DepartmentListComponent } from "./components/department-list/department-list.component";



export const ROUTES: Routes = [
    {
        path: "",
        component: DepartmentsComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),

        SharedModule],
    declarations: [
        DepartmentsComponent,
        DepartmentFormComponent,
        DepartmentListComponent
    ]
})
export class DepartmentsModule { }
