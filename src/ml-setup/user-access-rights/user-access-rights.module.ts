// Single component module
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "ml-setup/shared/shared.module";

// containers
import { UserAccessRightsComponent } from "./containers/user-access-rights/user-access-rights.component";
import { RolesComponent } from "./containers/roles/roles.component";
import { UserAccessTypesComponent } from "./containers/user-access-types/user-access-types.component";
import { UsersComponent } from "./containers/users/users.component";

// components
import { RolesFormComponent } from "./components/roles-form/roles-form.component";
import { RolesListComponent } from "./components/roles-list/roles-list.component";
import { UserCheckboxesComponent } from "./components/user-checkboxes/user-checkboxes.component";
import { UserDepartmentsAccessComponent } from "./components/user-departments-access/user-departments-access.component";
import { UserInitialsComponent } from "./components/user-initials/user-initials.component";
import { UserSystemFunctionsAccessComponent } from "./components/user-system-functions-access/user-system-functions-access.component";
import { AddUserComponent } from "./containers/add-user/add-user.component";
 
import { UserListComponent } from "./components/user-list/user-list.component";
import { UserLoginHistoryComponent } from "./components/user-login-history/user-login-history.component";
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { FuseSidebarModule } from '@fuse/components';
import { MatTooltipModule } from "@angular/material/tooltip";

export const ROUTES: Routes = [
    {
        path: "",
        component: UserAccessRightsComponent
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(ROUTES), SharedModule , MatMenuModule, MatSlideToggleModule,MatListModule, FuseSidebarModule],
    declarations: [
        UserAccessRightsComponent,
        AddUserComponent,
        RolesComponent,
        UserAccessTypesComponent,
        UsersComponent,
        RolesFormComponent,
        RolesListComponent,
        UserCheckboxesComponent,
        UserDepartmentsAccessComponent,
        UserCheckboxesComponent,
        UserInitialsComponent,
        UserListComponent,
        UserLoginHistoryComponent,
        UserSystemFunctionsAccessComponent
    ]
})
export class UserAccessRightsModule {}
