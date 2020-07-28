import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

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
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { CustomDropdownComponent } from './components/custom-dropdown/custom-dropdown.component';
import { CustomHeaderComponent } from './components/custom-header/custom-header.component';
import { CustomFilterMenuComponent } from './components/custom-filter-menu/custom-filter-menu.component';

@NgModule({
    imports: [
        CommonModule, 
        ReactiveFormsModule,
        MatRadioModule,
        MatIconModule
    
    ],
    declarations: [
        ActionModalComponent,
        ColumnOptionsComponent,
        DataCalculationsComponent,
        DataEntrySheetComponent,
        DateFiltersComponent,
        DateCalendarComponent,
        DateCarouselComponent,
        GoToCurrentMonthComponent,
        PrintComponent,
        SearchComponent,
        XlsExportComponent,
        CustomDropdownComponent,
        CustomHeaderComponent,
        CustomFilterMenuComponent,
    ],
    exports: [
        ActionModalComponent,
        ColumnOptionsComponent,
        DataCalculationsComponent,
        DataEntrySheetComponent,
        DateFiltersComponent,
        DateCalendarComponent,
        DateCarouselComponent,
        GoToCurrentMonthComponent,
        PrintComponent,
        SearchComponent,
        XlsExportComponent,
    ]
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
