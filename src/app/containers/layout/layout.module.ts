import { NgModule } from "@angular/core";
import { VerticalLayoutModule } from "./containers/vertical-layout/vertical-layout.module";

@NgModule({
    imports: [VerticalLayoutModule],
    exports: [VerticalLayoutModule]
})
export class LayoutModule { }
