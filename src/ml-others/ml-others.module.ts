import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "./shared/shared.module";
import { AuthGuard } from "ml-auth/shared/guards/auth-guard";
import { UserProfileService } from 'app/shared/services/user-profile.service';

export const ROUTES: Routes = [
    {
        path: "others",
        redirectTo: "my-profile",
        pathMatch: "full"
    },
    {
        path: "others",
        canActivate: [AuthGuard],
        children: [
            {
                path: "my-profile",
                loadChildren:
                    () =>
                        import('./my-profile/my-profile.module').then(m =>
                            m.MyProfileModule)

            },
            {
                path: "client-contact-profile",
                loadChildren:
                    () =>
                        import('./client-contact-profile/client-contact-profile.module').then(m =>
                            m.ClientContactProfileModule)
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        SharedModule.forRoot()
    ],
    providers : [
     
    ]
})
export class ML_OthersModule { }
