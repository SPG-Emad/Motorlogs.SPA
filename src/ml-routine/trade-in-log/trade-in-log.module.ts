import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "ml-routine/shared/shared.module";
import { ArrivingComponent } from "./arriving/containers/arriving/arriving.component";

export const ROUTES: Routes = [

    {
        path: "",
        children: [
            {
                path: "",
                pathMatch: "full",
                redirectTo: "/welcome",
            },
            {
                path: ":id",
                component: ArrivingComponent
            }

        ]
    }
];

@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forChild(ROUTES), 
        SharedModule
    ],
    declarations: [ArrivingComponent],
})
export class TradeInLogModule { }
