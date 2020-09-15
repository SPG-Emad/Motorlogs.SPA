import { Subscription } from 'rxjs';
import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { AddCustomComponent } from '../add-custom/add-custom.component';
import { MatDialog } from '@angular/material/dialog';
// import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
    selector: 'permissions-top-bar',
    templateUrl: './function-filters.component.html',
    styleUrls: ['./function-filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FunctionFiltersComponent implements OnInit {

    @Output() columnFilters = new EventEmitter<any>();
    @Output() refreshGrid = new EventEmitter<any>();

    activeFilter: string = "Show All";
    private dialogRef: any;

    constructor(
        // public ngxSmartModalService: NgxSmartModalService
        public dialog: MatDialog,
        ) {
    }


    ngOnInit() {
    }

    resetColumn(){
        this.activeFilter = "Show All";
        this.columnFilters.emit(0);
    }

    getSalesColumn(){
        this.activeFilter = "Sales";
        this.columnFilters.emit(1);
    }

    getArrivingColumn(){
        this.activeFilter = "Arriving";
        this.columnFilters.emit(2);
    }

    
    getDeliveredColumn(){
        this.activeFilter = "delivered";
        this.columnFilters.emit(3);
    }

    addColumn(){
        this.dialogRef = this.dialog.open(AddCustomComponent,{
            panelClass: 'custom-dialog-container',
            disableClose: true,
        });
        this.dialogRef.afterClosed().subscribe(res=>{
            this.refreshGrid.emit('');
        });
    }

}
