// Single component module
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ConfigurationComponent } from "./containers/configuration/configuration.component";
import { SharedModule } from "ml-setup/shared/shared.module";
import { PayTypesComponent } from "./containers/pay-types/pay-types.component";
import { PayTypeFormComponent } from "./components/pay-type-form/pay-type-form.component";
import { PayTypeListComponent } from "./components/pay-type-list/pay-type-list.component";

export const ROUTES: Routes = [
    {
        path: "",
        component: ConfigurationComponent
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(ROUTES), SharedModule],
    declarations: [
        ConfigurationComponent,
        PayTypesComponent,
        PayTypeFormComponent,
        PayTypeListComponent
    ]
})
export class ConfigurationsModule {}
