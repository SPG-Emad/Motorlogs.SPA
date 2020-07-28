import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { VerticalLayoutComponent } from "./vertical-layout.component";
import { ContentModule } from "../../components/content/content.module";
import { FooterModule } from "../../components/footer/footer.module";
import { NavbarModule } from "../../components/navbar/navbar.module";
import { QuickPanelModule } from "../../components/quick-panel/quick-panel.module";
import { ToolbarModule } from "../../components/toolbar/toolbar.module";

@NgModule({
    declarations: [VerticalLayoutComponent],
    imports: [
        RouterModule,
        FuseSharedModule,
        FuseSidebarModule,
        ContentModule,
        FooterModule,
        NavbarModule,
        QuickPanelModule,
        ToolbarModule,
    ],
    exports: [VerticalLayoutComponent],
})
export class VerticalLayoutModule {}
