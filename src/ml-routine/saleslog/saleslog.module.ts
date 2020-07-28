import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "ml-routine/shared/shared.module";
import { SaleslogComponent } from './containers/saleslog/saleslog.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import { AgGridModule } from '@ag-grid-community/angular';
import { MatDialogModule } from '@angular/material/dialog';
import { Ng2CarouselamosModule } from 'ng2-carouselamos';
import { HistoryComponent } from './components/history/history.component';
import { CustomFilterMenuComponent } from './../shared/components/custom-filter-menu/custom-filter-menu.component';
import { NewDealComponent } from './components/new-deal/new-deal.component';
import { ExcelExportComponent } from './components/excel-export/excel-export.component';
import { ColumnOptionComponent } from './components/column-option/column-option.component';
import { CustomHeaderComponent } from 'ml-routine/shared/components/custom-header/custom-header.component';
import { CustomDropdownComponent } from 'ml-routine/shared/components/custom-dropdown/custom-dropdown.component';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { NgSelectizeModule } from 'ng-selectize'; 
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import { CdkColumnDef } from '@angular/cdk/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export const ROUTES: Routes = [
    {
        path: "",
        children: [
            {
                path: "",
                pathMatch: 'full',
                redirectTo: '/welcome'
            },
            {
                path: ":id",
                component: SaleslogComponent
            }

        ]
    }
];

@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forChild(ROUTES), 
        SharedModule,
        Ng2CarouselamosModule,
        // NgSelectModule,      
        // NgSelectizeModule,
        FormsModule,
        MatRadioModule,
        MatIconModule,
        MatFormFieldModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatTableModule,
        MatSortModule,
        MatDialogModule,
        MatCheckboxModule,
        MatSelectModule,
        AgGridModule.withComponents([
            CustomHeaderComponent,
            // CustomDropdownComponent,
            // CustomFilterMenuComponent
        ]),

    ],
    declarations: [
        SaleslogComponent, 
        HistoryComponent, 
        NewDealComponent, 
        ExcelExportComponent, 
        ColumnOptionComponent,
    ],
    entryComponents: [
        HistoryComponent,
        NewDealComponent, 
        ExcelExportComponent,
        ColumnOptionComponent,
    ],
    providers:[CdkColumnDef]


})
export class SaleslogModule {}
