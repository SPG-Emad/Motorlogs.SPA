import { NgModule } from "@angular/core";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "ml-auth/shared/guards/auth-guard";

export const ROUTES: Routes = [
    {
        path: "error",
        children: [
            {
                path: "",
                redirectTo: "404",
                pathMatch: "full"
            },
            {
                path: "404",
                loadChildren:
                    () =>
                        import('./page-not-found/page-not-found.module').then(m =>
                            m.PageNotFoundModule),
                canActivate: [AuthGuard]
            },
        ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(ROUTES)]
})
export class ML_ErrorPagesModule { }
