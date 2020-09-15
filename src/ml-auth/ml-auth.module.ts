import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "./shared/shared.module";
import { AuthenticationComponent } from './authentication/authentication.component';
import { ML_SharedModule } from 'ml-shared/ml-shared.module';
import { UserProfileService } from 'app/shared/services/user-profile.service';

export const ROUTES: Routes = [
    {
        path: "auth",
        component: AuthenticationComponent,
        children: [
            {
                path: "",
                pathMatch: "full",
                redirectTo: "login"
            },
            {
                path: "login",
                loadChildren:
                    () =>
                        import('./login/login.module').then(m =>
                            m.LoginModule)
            },
            {
                path: "forgot-password",
                loadChildren:
                    () =>
                        import('./forgot-password/forgot-password.module').then(m =>
                            m.ForgotPasswordModule)
            },
            {
                path: "new-password",
                loadChildren:
                    () =>
                        import('./new-password/new-password.module').then(m =>
                            m.NewPasswordModule)
            }
        ]
    }
];

@NgModule({
    declarations: [AuthenticationComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        SharedModule.forRoot(),
    ],
    providers: [UserProfileService]
})
export class ML_AuthModule { }
