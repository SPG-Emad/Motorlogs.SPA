import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public modalParams?: any,
    // private siteTargetSerivce: SiteTargetsService
  ) {

    if(modalParams && modalParams.hasOwnProperty('key') && modalParams.key.option){
      this.searchOption = modalParams.key.option;
      console.log(modalParams.key);
      console.log(this.searchOption);
      if(this.searchOption === 1){
        this.modalTitle = "History All";
      }
    }
    this.columnDefs = [
      {
        colId: 1,
        headerName: "Date", 
        field: "date", 
        suppressMovable: true,
        type: "date",
      },
      {
        colId: 2,
        headerName: "Client", 
        field: "client", 
        suppressMovable: true,
        type: "date",
      },
      {
        colId: 3,
        headerName: "Column changed", 
        field: "edit_by", 
        suppressMovable: true,
        type: "date",
      },

      {
        colId: 4,
        headerName: "Edit by", 
        field: "edit_by", 
        suppressMovable: true,
        type: "date",
      },
      {
        colId: 5,
        headerName: "Old values", 
        field: "old_value", 
        suppressMovable: true,
        type: "data",
      },
      {
        colId: 6,
        headerName: "New values", 
        field: "new_value", 
        suppressMovable: true,
        type: "data",
      },
    ];
    
    this.autoGroupColumnDef = { 
      minWidth: 400,
    };

    this.getRowNodeId = function(data) {
      return data.id;
    };


    this.defaultColDef = {
      flex: 1,
      editable: true, 
      filter: true,
      cellClass: 'row-text-style',
      menuTabs: ['filterMenuTab','columnsMenuTab','generalMenuTab'],
      headerComponentParams: { menuIcon: 'fa-chevron-down' },
    };

    this.rowData = [
      {      
        "Date": "",
        "Edit by": "",
        "Client": "",
        "Column changed": "",
        "Old values": "",
        "New values": ""
      },
      {      
        "Date": "",
        "Edit by": "",
        "Client": "",
        "Column changed": "",
        "Old values": "",
        "New values": ""
      },
      {      
        "Date": "",
        "Edit by": "",
        "Client": "",
        "Column changed": "",
        "Old values": "",
        "New values": ""
      },
      {      
        "Date": "",
        "Edit by": "",
        "Client": "",
        "Column changed": "",
        "Old values": "",
        "New values": ""
      },
      {      
        "Date": "",
        "Edit by": "",
        "Client": "",
        "Column changed": "",
        "Old values": "",
        "New values": ""
      },
      {      
        "Date": "",
        "Edit by": "",
        "Client": "",
        "Column changed": "",
        "Old values": "",
        "New values": ""
      },
      {      
        "Date": "",
        "Edit by": "",
        "Client": "",
        "Column changed": "",
        "Old values": "",
        "New values": ""
      },
      {      
        "Date": "",
        "Edit by": "",
        "Client": "",
        "Column changed": "",
        "Old values": "",
        "New values": ""
      },
    ];

  }

  private gridApi;
  private gridColumnApi;
  private searchOption: number = 0;
  private modalTitle : string = "History";
  private columnDefs;
  private defaultColDef;
  private columnTypes;
  private autoGroupColumnDef;
  private rowData = [];
  private getRowNodeId;
  private days:any= [{
    value: 'Past 30 days'
  }];

  ngOnInit() {
  }


  closeModal(){
    this.dialog.closeAll();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // this.http
    //   .get(
    //     'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json'
    //   )
    //   .subscribe(data => {
    //     this.rowData = data;
    //   });

    // this.generateGrid();

  }

}
