import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "ml-others/shared/shared.module";
import { ClientListComponent } from "./components/client-list/client-list.component";
import { ClientContactProfileComponent } from "./containers/client-contact-profile/client-contact-profile.component";

export const ROUTES: Routes = [
    {
        path: "",
        component: ClientContactProfileComponent
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(ROUTES), SharedModule],
    declarations: [ClientContactProfileComponent, ClientListComponent]
})
export class ClientContactProfileModule {}
