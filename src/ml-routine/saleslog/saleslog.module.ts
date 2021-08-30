import { CustomLoadingOverlayComponent } from "./components/custom-loading-overlay/custom-loading-overlay.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "ml-routine/shared/shared.module";
import { SaleslogComponent } from "./containers/saleslog/saleslog.component";
import { MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { AgGridModule } from "@ag-grid-community/angular";
import { MatDialogModule } from "@angular/material/dialog";
import { Ng2CarouselamosModule } from "ng2-carouselamos";
import { NewDealComponent } from "./components/new-deal/new-deal.component";
import { ExcelExportComponent } from "./components/excel-export/excel-export.component";
import { CustomHeaderComponent } from "ml-routine/shared/components/custom-header/custom-header.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { CdkColumnDef } from "@angular/cdk/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatAutocompleteModule } from "@angular/material";

import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { CustomDropDownRenderer } from "./containers/saleslog/custom-dropdown-renderer.component";
import { CalenderRenderer } from "./containers/saleslog/calander-renderer.component";
import { CustomDropdownComponent } from "./components/custom-dropdown/custom-dropdown.component";
import { DropDownRenderer } from "./containers/saleslog/dropdown-renderer.component";
import { AppComponentDateTime } from "./components/app-component-date-time/app-component-date-time.component";

export const ROUTES: Routes = [
    {
        path: "",
        children: [
            {
                path: "",
                pathMatch: "full",
                redirectTo: "/welcome",
            },
            {
                path: ":id",
                component: SaleslogComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        SharedModule,
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
        ]),
    ],
    declarations: [
        SaleslogComponent,
        NewDealComponent,
        ExcelExportComponent,
        AppComponentDateTime,
    ],
    entryComponents: [
        NewDealComponent,
        ExcelExportComponent,
    ],
    providers: [CdkColumnDef],
})
export class SaleslogModule {}
