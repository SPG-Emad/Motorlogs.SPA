import { NgModule } from "@angular/core";

import { FuseSharedModule } from "@fuse/shared.module";
import { NavbarComponent } from "./navbar.component";
import { NavbarVerticalStyle2Module } from "./vertical/style-2/style-2.module";

@NgModule({
    declarations: [NavbarComponent],
    imports: [FuseSharedModule, NavbarVerticalStyle2Module],
    exports: [NavbarComponent],
})
export class NavbarModule {}
