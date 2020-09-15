import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "ml-others/shared/shared.module";
import { MyProfileComponent } from "./containers/my-profile/my-profile.component";
import { NotificationsComponent } from "./components/notifications/notifications.component";
import { ChangeEmailComponent } from "./components/change-email/change-email.component";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";
import { GeneralComponent } from "./components/general/general.component";
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

export const ROUTES: Routes = [
    {
        path: "",
        component: MyProfileComponent
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(ROUTES), SharedModule, 
        MatListModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule],
    declarations: [
        MyProfileComponent,
        ChangeEmailComponent,
        ChangePasswordComponent,
        GeneralComponent,
        NotificationsComponent
    ]
})
export class MyProfileModule {}
