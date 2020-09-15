import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "ml-routine/shared/shared.module";
import { DeliveredComponent } from "./containers/delivered/delivered.component";

export const ROUTES: Routes = [
    {
        path: "",
        children: [
            {
                path: "",
                pathMatch: 'full',
                redirectTo: '/welcome'
            },
            {
                path: ":id",
                component: DeliveredComponent
            }

        ]
    }
];

@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forChild(ROUTES), 
        SharedModule,
    ],
    declarations: [DeliveredComponent]
})
export class DeliveredModule {}
