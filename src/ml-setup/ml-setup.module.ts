import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "./shared/shared.module";
import { ML_SharedModule } from "ml-shared/ml-shared.module";
import { AuthGuard } from "ml-auth/shared/guards/auth-guard";

export const ROUTES: Routes = [
    {
        path: "setup",
        pathMatch: "full",
        redirectTo: "welcome"
    },
    {
        path: "setup",
        children: [
            {
                path: "departments",
                canActivate: [AuthGuard],
                loadChildren:
                    () =>
                        import('./departments/departments.module').then(m =>
                            m.DepartmentsModule)
            },
            {
                path: "user-access-rights",
                canActivate: [AuthGuard],
                loadChildren:
                    () =>
                        import('./user-access-rights/user-access-rights.module').then(m =>
                            m.UserAccessRightsModule)
            },
            {
                path: "configuration",
                canActivate: [AuthGuard],
                loadChildren:
                    () =>
                        import('./configuration/configuration.module').then(m =>
                            m.ConfigurationsModule)
            },
            {
                path: "permissions",
                canActivate: [AuthGuard],
                loadChildren:
                    () =>
                        import('./permissions/permissions.module').then(m =>
                            m.PermissionsModule)
            },
            {
                path: "individual-targets",
                canActivate: [AuthGuard],
                loadChildren:
                    () =>
                        import('./individual-targets/individual-targets.module').then(m =>
                            m.IndividualTargetsModule)
            },
            {
                path: "site-targets",
                canActivate: [AuthGuard],
                loadChildren:
                    () =>
                        import('./site-targets/site-targets.module').then(m =>
                            m.SiteTargetsModule)
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        SharedModule.forRoot(),
    
    ]
})
export class ML_SetupModule { }
