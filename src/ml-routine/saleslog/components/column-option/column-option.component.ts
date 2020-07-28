import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SaleslogService } from 'ml-routine/shared/services/saleslog/saleslog.service';
import { SessionHandlerService } from 'app/shared/services/session-handler.service';

let ELEMENT_DATA: any[] = [
  // {columnName: "Order Date", display: true, printExport: false },
  // {columnName: "Client", display: false, printExport: false },
  // {columnName: "Dept.", display: false, printExport: false },
  // {columnName: "RO Number", display: false, printExport: false },
  // {columnName: "Vehicle Location", display: false, printExport: false },
];

@Component({
  selector: 'app-column-option',
  templateUrl: './column-option.component.html',
  styleUrls: ['./column-option.component.scss']
})

export class ColumnOptionComponent implements OnInit {

  displayedColumns: string[] = ['columnName', 'display', 'printExport'];
  dataSource;
  column =  [
    // {
    //   'columnName': 'Order Date',
    //   'field': 'orderDate',
    //   'display': false,

    // },
    // {
    //   'columnName': 'Client',
    //   'field': 'client',
    //   'display': false,
    // },
    // {
    //   'columnName': 'Dept.',
    //   'field': 'dept',
    //   'display': false,

    // },
    // {
    //   'columnName': 'RO Number',
    //   'field': 'ro.No',
    //   'display': false,

    // },
    // {
    //   'columnName': 'Vehicle Location',
    //   'field': 'vehicle_location',
    //   'display': false,

    // },
  ];
  loader:boolean = false;
  columnLoader:boolean = false;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ColumnOptionComponent>,
    private saleslogService: SaleslogService,
    private sessionHandlerService: SessionHandlerService,
    @Inject(MAT_DIALOG_DATA) public modalParams?: any,
  ) { }

  modalTitle : string = "COLUMN OPTIONS";

  ngOnInit() {
    this.getColumns();
  }
  

  submit(){

    this.dialogRef.close({
      "column": this.column
    });

    
  }

  getColumns(){
    this.columnLoader = true;
    let params = {
      "ViewId" : 1, // For saleslog 1 , for Delivered 2, for Arriving 3
      "UserId" : this.sessionHandlerService.getSession('userObj').userId,
      "RoleId" : this.sessionHandlerService.getSession('userObj').roleID,
      "DeptId" : 1118
    }
    this.saleslogService.getColumnOptionsListing(params)
    .subscribe(res=>{
      res.map(res=>{
        this.columnLoader = false;
        let field = ""+res.colName.toLowerCase().replace(' ','_');
        this.column.push({
          'columnName': res.colName,
          'field': field,
          'display': res.display,
        });
        ELEMENT_DATA.push({
          columnName: res.colName, 
          display: res.display, 
          printExport: res.printable,
          disabled: res.disabled
        })
      })
      console.log(ELEMENT_DATA);
      this.dataSource = new MatTableDataSource(ELEMENT_DATA);
      this.dataSource.sort = this.sort;

    });
  }


  reset(){
    let params = {
      "ViewId" : 1, // For saleslog 1 , for Delivered 2, for Arriving 3
      "UserId" : this.sessionHandlerService.getSession('userObj').userId,
      "DeptId" : 1118
    }
    this.saleslogService.resetColumn(params)
    .subscribe(res=>{

    });
  }

  closeModal(){
    this.dialog.closeAll();
  }

  setColumnVisibility(event, display){
    
    let value = event.checked;

    if(this.column.length > 0){
      this.column.map(res=>{
        if(res.columnName=== display.columnName){
          res.display= value;
        }
      });
      console.log(this.column);
    }
  }

}
