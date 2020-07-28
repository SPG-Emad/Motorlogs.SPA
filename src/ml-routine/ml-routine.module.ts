import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "./shared/shared.module";
import { AuthGuard } from "ml-auth/shared/guards/auth-guard";

export const ROUTES: Routes = [
    {
        path: "group-overview",
        loadChildren:
            () =>
                import('./dashboard/dashboard.module').then(m =>
                    m.DashboardModule),
        pathMatch: "full",
        canActivate: [AuthGuard]
    },
    {
        path: "routine",
        redirectTo: "dashboard",
        pathMatch: "full"
    },
    {
        path: "routine",
        children: [
            {
                path: "dashboard",
                canActivate: [AuthGuard],
                loadChildren:
                    () =>
                        import('./dashboard/dashboard.module').then(m =>
                            m.DashboardModule)
            },
            {
                path: "saleslog",
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./saleslog/saleslog.module').then(m =>
                        m.SaleslogModule)
            },
            {
                path: "delivered",
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./delivered/delivered.module').then(m =>
                        m.DeliveredModule)
            },

            {
                path: "trade-in-log",
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./trade-in-log/trade-in-log.module').then(m =>
                        m.TradeInLogModule)
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        SharedModule.forRoot()
    ]
})
export class ML_RoutineModule { }
