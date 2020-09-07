import { NgModule } from "@angular/core";
import { PageNotFoundComponent } from "./page-not-found.component";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
    {
        path: "",
        component: PageNotFoundComponent,
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    declarations: [PageNotFoundComponent],
})
export class PageNotFoundModule {}
