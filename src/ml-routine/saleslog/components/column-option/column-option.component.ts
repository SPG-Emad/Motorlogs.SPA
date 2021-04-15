import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SaleslogService } from 'ml-routine/shared/services/saleslog/saleslog.service';
import { LocalStorageHandlerService } from 'app/shared/services/local-storage-handler.service';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from 'app/shared/services/encryption.service';
import { SignalRService } from 'ml-setup/shared/services/signal-r/signal-r.service';

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
  column =  [];
  loader:boolean = false;
  columnLoader:boolean = false;
  optionsChanged = [];
  decryptedDepartmentId: string;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ColumnOptionComponent>,
    private saleslogService: SaleslogService,
    private signalRService: SignalRService,
    private LocalStorageHandlerService: LocalStorageHandlerService,
    private encryptionService: EncryptionService,
    private route: ActivatedRoute, 
    @Inject(MAT_DIALOG_DATA) public modalParams?: any,
  ) { 
    console.log("modalParams:",modalParams)
    if (modalParams && modalParams.hasOwnProperty('key')) {
      this.decryptedDepartmentId = modalParams.key;
    }
  }

  modalTitle : string = "COLUMN OPTIONS";

  ngOnInit() {
    this.getColumns();
  }
  

  submit(){
    
    let options= [];
    this.loader =  true;

    /**
     * - If any change occured then fetch all changed options and call update API
     * - Else Just close modal
     * 
     * */ 
    if(this.optionsChanged.length >0){    
      
      this.optionsChanged.map(res=>{
        let result = this.column.find(el=> el.colId=== res.colId);
        if(options !== undefined){
          options.push({
            colid: result.colId,
            display: result.display, 
            print: result.print,
          });
        }
      });

      let json = {
        "ViewId" : 1, // For saleslog 1 , for Delivered 2, for Arriving 3
        "userId" : this.LocalStorageHandlerService.getSession('userObj').userId,
        "deptId" : this.decryptedDepartmentId,
        "columns": options
      }
      this.saleslogService.updateColumnOptions(json)
      .subscribe(res=>{
        this.loader= false;

        this.signalRService.BroadcastLiveSheetData();
        this.dialogRef.close({
          "column": this.column
        });
  
      })
    }else{ 
      this.dialogRef.close({
        "column": null
      });
    }
    /*-----------------------------*/ 
    
  }

  getColumns(){
    this.columnLoader = true;
    ELEMENT_DATA = [];
    let params = {
      "ViewId" : 1, // For saleslog 1 , for Delivered 2, for Arriving 3
      "UserId" : this.LocalStorageHandlerService.getSession('userObj').userId,
      "RoleId" : this.LocalStorageHandlerService.getSession('userObj').roleID,
      "DeptId" : this.decryptedDepartmentId
    }
    this.saleslogService.getColumnOptionsListing(params)
    .subscribe(res=>{
      this.columnLoader = false;
      console.log(this.columnLoader);
      res.map(res=>{
        let field = ""+res.colName.toLowerCase().replace(' ','_');
        this.column.push({
          'colId': res.colId,
          'columnName': res.colName,
          'field': field,
          'display': res.display,
          'sequence': res.sequence,
          'print': res.printable,

        });
        ELEMENT_DATA.push({
          colId: res.colId,
          columnName: res.colName, 
          display: res.display, 
          printExport: res.printable,
          disabled: res.disabled
        })
      })
      this.dataSource = new MatTableDataSource(ELEMENT_DATA);
      this.dataSource.sort = this.sort;

    });
  }


  reset(){
    let params = {
      "ViewId" : 1, // For saleslog 1 , for Delivered 2, for Arriving 3
      "UserId" : this.LocalStorageHandlerService.getSession('userObj').userId,
      "DeptId" : this.decryptedDepartmentId
    }
    this.saleslogService.resetColumn(params)
    .subscribe(res=>{
      this.signalRService.BroadcastLiveSheetData();
      this.getColumns();
    });
  }

  closeModal(){
    this.dialog.closeAll();
  }

  setColumnVisibility(event, options, type){
    let value = event.checked;

    if(this.column.length > 0){
      let colOption = this.column.find(el=> el.columnName === options.columnName);
      this.column.map(res=>{
        if(res.columnName === colOption.columnName){
          let cId= this.optionsChanged.find(el=> el.columnName === colOption.columnName);

          if(cId === undefined){
            this.optionsChanged.push({colId: res.colId, columnName: res.columnName})
          }
          if(type===1){
            res.display = value;
          }else{
            res.print = value;
          }
        }
      });
    }
  }

}
