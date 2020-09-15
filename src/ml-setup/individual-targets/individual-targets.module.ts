// Single component module
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "ml-setup/shared/shared.module";
import { IndividualTargetsComponent } from "./containers/individual-targets/individual-targets.component";

export const ROUTES: Routes = [
    {
        path: "",
        component: IndividualTargetsComponent
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(ROUTES), SharedModule],
    declarations: [
        IndividualTargetsComponent
    ]
})
export class IndividualTargetsModule {}
