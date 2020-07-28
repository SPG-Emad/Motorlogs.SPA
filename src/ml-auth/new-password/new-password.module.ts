import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { NewPasswordComponent } from "./containers/new-password/new-password.component";
import { SharedModule } from 'ml-auth/shared/shared.module';

const routes: Routes = [
    {
        path: "",
        component: NewPasswordComponent
    }
];

@NgModule({
    declarations: [NewPasswordComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class NewPasswordModule { }
