import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";

import { FuseSearchBarModule, FuseShortcutsModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { ToolbarComponent } from "./toolbar.component";
import { ML_SharedModule } from 'ml-shared/ml-shared.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [ToolbarComponent],
    imports: [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
      
        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule,
        ML_SharedModule
    ],
    exports: [ToolbarComponent],
})
export class ToolbarModule {}
