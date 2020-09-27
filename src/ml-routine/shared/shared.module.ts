import { ShareableDropDownComponent } from './components/dropdown/dropdown.component';
import { DropDownRenderer } from './components/grid-custom/dropdown-renderer.component';
import { CalenderRenderer } from './components/grid-custom/calander-renderer.component';
import {  ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";


// services
import { DashboardService } from "./services/dashboard/dashboard.service";
import { DeliveredService } from "./services/delivered/delivered.service";
import { SaleslogService } from "./services/saleslog/saleslog.service";
import { ArrivingService } from "./services/trade-in-log/arriving/arriving.service";


// components
import { ActionModalComponent } from "./components/action-modal/action-modal.component";
import { DataCalculationsComponent } from "./components/data-calculations/data-calculations.component";
import { DataEntrySheetComponent } from "./components/data-entry-sheet/data-entry-sheet.component";
import { DateCarouselComponent } from "./components/date-filters/date-carousel/date-carousel.component";
import { GoToCurrentMonthComponent } from "./components/go-to-current-month/go-to-current-month.component";
import { PrintComponent } from "./components/print/print.component";
import { SearchComponent } from "./components/search/search.component";
import { XlsExportComponent } from "./components/xls-export/xls-export.component";
import { ColumnOptionsComponent } from "./components/column-options/column-options.component";
import { DateFiltersComponent } from "./components/date-filters/date-filters.component";
import { DateCalendarComponent } from "./components/date-filters/date-calendar/date-calendar.component";


import { CustomDropDownRenderer } from './components/grid-custom/custom-dropdown-renderer.component';
import { CustomHeaderComponent } from './components/custom-header/custom-header.component';
import { CustomFilterMenuComponent } from './components/custom-filter-menu/custom-filter-menu.component';
import {DateFooterFilterComponent } from './components/date-footer-filter/date.footer.component';
import { NgSelectModule } from 'ng-custom-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from "@angular/core";
import {  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


/** Added */
import {MatRadioModule} from '@angular/material/radio';
import { Ng2CarouselamosModule } from 'ng2-carouselamos';
import { MatDatepickerModule, MatFormFieldModule, MatIconModule,  MatAutocompleteModule, MatInputModule, MatProgressSpinnerModule, MatSlideToggleModule, MatTableModule, MatSortModule, MatDialogModule, MatCheckboxModule, MatSelectModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { RoutineSheetComponent } from './components/routine-sheet/routine-sheet.component';
import { HistoryComponent } from './components/history/history.component';
import { NewDealComponent } from './components/new-deal/new-deal.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { CustomLoadingOverlayComponent } from 'ml-shared/components/custom-loading-overlay/custom-loading-overlay.component';
import { AppComponentDateTime } from './components/app-component-date-time/app-component-date-time.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        CommonModule, 
        // RouterModule.forChild(ROUTES), 
        Ng2CarouselamosModule,
        FormsModule,
        MatRadioModule,
        MatIconModule,
        MatFormFieldModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatTableModule,
        MatSortModule,
        MatDialogModule,
        MatCheckboxModule,
        MatSelectModule,
        NgxMatSelectSearchModule,
        AgGridModule.withComponents([
            CustomHeaderComponent,
            CustomDropDownRenderer,
            CalenderRenderer,
            DropDownRenderer,
            CustomLoadingOverlayComponent,
            AppComponentDateTime,
            ShareableDropDownComponent,
        ]),
        NgSelectModule,       
    ],
    declarations: [
        ActionModalComponent,
        ColumnOptionsComponent,
        DataCalculationsComponent,
        DataEntrySheetComponent,
        DateFiltersComponent,
        ShareableDropDownComponent,
        CalenderRenderer,
        DropDownRenderer,
        CustomLoadingOverlayComponent,
        AppComponentDateTime,        
        DateCalendarComponent,
        DateCarouselComponent,
        GoToCurrentMonthComponent,
        PrintComponent,
        SearchComponent,
        XlsExportComponent,
        DateFooterFilterComponent,
        CustomDropDownRenderer,
        CustomHeaderComponent,
        CustomFilterMenuComponent,
        RoutineSheetComponent,
        HistoryComponent,
        NewDealComponent,
    ],
    exports: [
        ActionModalComponent,
        ColumnOptionsComponent,
        DataCalculationsComponent,
        DataEntrySheetComponent,
        DateFiltersComponent,
        DateCalendarComponent,
        DateCarouselComponent,
        DateFooterFilterComponent,
        GoToCurrentMonthComponent,
        CustomDropDownRenderer,
        PrintComponent,
        SearchComponent,
        XlsExportComponent,
        RoutineSheetComponent,
        NewDealComponent
    ],
    entryComponents: [
        HistoryComponent,
        NewDealComponent, 
        XlsExportComponent,
        ColumnOptionsComponent,
        NewDealComponent,        
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                DashboardService,
                DeliveredService,
                SaleslogService,
                ArrivingService
            ]
        };
    }
}
