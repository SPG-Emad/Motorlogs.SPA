import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "../shared/shared.module";


// containers
import { DashboardComponent } from "./containers/dashboard/dashboard.component";
import { PivotTablesComponent } from "./containers/pivot-tables/pivot-tables.component";
import { SalesGraphComponent } from "./containers/sales-graph/sales-graph.component";

// components
import { PivotFiltersComponent } from "./components/pivot-tables/pivot-filters/pivot-filters.component";
import { GroupByDepartmentComponent } from "./components/sales-graph/charts/group-by-department/group-by-department.component";
import { GroupBySalespersonComponent } from "./components/sales-graph/charts/group-by-salesperson/group-by-salesperson.component";
import { GroupByTotalComponent } from "./components/sales-graph/charts/group-by-total/group-by-total.component";
import { PivotDataComponent } from "./components/pivot-tables/pivot-data/pivot-data.component";
import { GroupBySummaryComponent } from "./components/sales-graph/group-by-summary/group-by-summary.component";
import { SalesFiltersComponent } from "./components/sales-graph/sales-filters/sales-filters.component";
import { DashboardHeaderComponent } from "./components/dashboard-header/dashboard-header.component";
import { NgSelectModule } from 'ng-custom-select';
/** Added */
import {MatRadioModule} from '@angular/material/radio';
import { Ng2CarouselamosModule } from 'ng2-carouselamos';
import { MatDatepickerModule, MatFormFieldModule, MatIconModule,  MatAutocompleteModule, MatInputModule, MatProgressSpinnerModule, MatSlideToggleModule, MatTableModule, MatSortModule, MatDialogModule, MatCheckboxModule, MatSelectModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

export const ROUTES: Routes = [
    {
        path: "",
        children: [
            {
                path: "",
                component: DashboardComponent
            },
            {
                path: ":id",
                component: DashboardComponent
            }

        ]
    }
];

@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forChild(ROUTES), 
        SharedModule,
        NgSelectModule,
        MatRadioModule,
        MatDatepickerModule,
        Ng2CarouselamosModule,
       
        // NgSelectModule,      
        // NgSelectizeModule,
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
        FormsModule
    ],
    declarations: [
        DashboardComponent,
        DashboardHeaderComponent,
        PivotDataComponent,
        PivotFiltersComponent,
        GroupByDepartmentComponent,
        GroupBySalespersonComponent,
        GroupByTotalComponent,
        GroupBySummaryComponent,
        SalesFiltersComponent,
        PivotTablesComponent,
        SalesGraphComponent
    ]
})
export class DashboardModule { }
