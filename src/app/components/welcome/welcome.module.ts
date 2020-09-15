import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FuseSharedModule } from "@fuse/shared.module";
import { WelcomeComponent } from "./welcome.component";
import { AuthGuard } from "ml-auth/shared/guards/auth-guard";
import { NotificationService } from 'app/shared/services/notification.service';

const routes = [
    {
        path: "welcome",
        component: WelcomeComponent,
        canActivate: [AuthGuard],
    },
];

@NgModule({
    declarations: [WelcomeComponent],
    imports: [RouterModule.forChild(routes), FuseSharedModule],
    exports: [WelcomeComponent],
    providers: [NotificationService]
})
export class WelcomeModule { }
