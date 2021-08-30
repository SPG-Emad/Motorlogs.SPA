import { ShareableDropDownComponent } from "./components/dropdown/dropdown.component";
import { DropDownRenderer } from "../saleslog/containers/saleslog/dropdown-renderer.component";
import { CalenderRenderer } from "../saleslog/containers/saleslog/calander-renderer.component";
import { ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CdkColumnDef } from "@angular/cdk/table";
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
import { DateFiltersComponent } from "./components/date-filters/date-filters.component";
import { DateCalendarComponent } from "./components/date-filters/date-calendar/date-calendar.component";

import { CustomDropDownRenderer } from "../saleslog/containers/saleslog/custom-dropdown-renderer.component";
import { CustomHeaderComponent } from "./components/custom-header/custom-header.component";
import { CustomFilterMenuComponent } from "./components/custom-filter-menu/custom-filter-menu.component";
import { DateFooterFilterComponent } from "./components/date-footer-filter/date.footer.component";
import { NgSelectModule } from "ng-custom-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

/** Added */
import { MatRadioModule } from "@angular/material/radio";
import { Ng2CarouselamosModule } from "ng2-carouselamos";
import {
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
} from "@angular/material";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { RoutineSheetComponent } from "./components/routine-sheet/routine-sheet.component";
import { HistoryComponent } from "../saleslog/components/history/history.component";
import { NewDealComponent } from "./components/new-deal/new-deal.component";
import { AgGridModule } from "@ag-grid-community/angular";
import { CustomLoadingOverlayComponent } from "../saleslog/components/custom-loading-overlay/custom-loading-overlay.component";
import { AppComponentDateTime } from "./components/app-component-date-time/app-component-date-time.component";
import { OwlDatePickerComponent } from "./components/owl-date-picker-component/owl-date-picker-component.component";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { CustomDropdownComponent } from "ml-routine/saleslog/components/custom-dropdown/custom-dropdown.component";
import { ColumnOptionComponent } from "ml-routine/saleslog/components/column-option/column-option.component";

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
            CustomDropdownComponent,
            DropDownRenderer,
            AppComponentDateTime,
            CustomLoadingOverlayComponent,
            ShareableDropDownComponent,
            HistoryComponent
        ]),
        NgSelectModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
    ],
    declarations: [
        HistoryComponent,
        ActionModalComponent,
        DataCalculationsComponent,
        DataEntrySheetComponent,
        DateFiltersComponent,
        ShareableDropDownComponent,
        CustomLoadingOverlayComponent,
        AppComponentDateTime,
        DateCalendarComponent,
        DateCarouselComponent,
        GoToCurrentMonthComponent,
        PrintComponent,
        SearchComponent,
        XlsExportComponent,
        DateFooterFilterComponent,
        CustomHeaderComponent,
        CustomFilterMenuComponent,
        RoutineSheetComponent,
        NewDealComponent,
        OwlDatePickerComponent,
        CalenderRenderer,
        DropDownRenderer,
        CustomDropdownComponent,
        CustomDropDownRenderer,
        ColumnOptionComponent
    ],
    exports: [
        HistoryComponent,
        ActionModalComponent,
        DataCalculationsComponent,
        DataEntrySheetComponent,
        DateFiltersComponent,
        ShareableDropDownComponent,
        CustomLoadingOverlayComponent,
        AppComponentDateTime,
        DateCalendarComponent,
        DateCarouselComponent,
        GoToCurrentMonthComponent,
        PrintComponent,
        SearchComponent,
        XlsExportComponent,
        DateFooterFilterComponent,
        CustomHeaderComponent,
        CustomFilterMenuComponent,
        RoutineSheetComponent,
        NewDealComponent,
        OwlDatePickerComponent,
        CalenderRenderer,
        DropDownRenderer,
        CustomDropdownComponent,
        CustomDropDownRenderer,
        ColumnOptionComponent,
    ],
    entryComponents: [
        HistoryComponent,
        XlsExportComponent,
        ColumnOptionComponent,
        NewDealComponent,
        OwlDatePickerComponent,
        CustomLoadingOverlayComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [CdkColumnDef],
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                DashboardService,
                DeliveredService,
                SaleslogService,
                ArrivingService,
            ],
        };
    }
}
