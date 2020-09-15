import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ForgotPasswordComponent } from "./containers/forgot-password/forgot-password.component";
import { SharedModule } from '../shared/shared.module';
const routes: Routes = [{ path: "", component: ForgotPasswordComponent }];

@NgModule({
    declarations: [ForgotPasswordComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class ForgotPasswordModule { }
