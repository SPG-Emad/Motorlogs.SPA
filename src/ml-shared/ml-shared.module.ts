import { NgModule } from "@angular/core";
import { SearchGridComponent } from "./components/search-grid/search-grid.component";
import { ModalComponent } from "./components/modal/modal.component";
import { LoadingComponent } from './components/loading/loading.component';
import { MatSearchSelectComponent } from './components/mat-search-select/mat-search-select.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { SmartSearchListFilterPipe } from './pipe/smart-search-list-filter.pipe';
import { DeleteConfirmComponent } from './components/delete-confirm/delete-confirm.component';
import { SidebarContentComponent } from './components/sidebar-content/sidebar-content.component';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
    imports: [FuseSharedModule,MatTooltipModule],
    exports: [SearchGridComponent, ModalComponent, LoadingComponent, MatSearchSelectComponent, DeleteConfirmComponent, SidebarContentComponent],
    declarations: [SearchGridComponent, ModalComponent, LoadingComponent, MatSearchSelectComponent, SmartSearchListFilterPipe, DeleteConfirmComponent, SidebarContentComponent]
})
export class ML_SharedModule { }
