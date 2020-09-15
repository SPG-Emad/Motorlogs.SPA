import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SaleslogService } from 'ml-routine/shared/services/saleslog/saleslog.service';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CustomLoadingOverlayComponent } from 'ml-shared/components/custom-loading-overlay/custom-loading-overlay.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  public modules: any[] = AllModules;

  private loadingOverlayComponent;
  private loadingOverlayComponentParams;
  private frameworkComponents;
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder, 
    private saleslog: SaleslogService,
    @Inject(MAT_DIALOG_DATA) public modalParams?: any,
  ) {

    this.loadingOverlayComponent = 'customLoadingOverlay';

    this.loadingOverlayComponentParams = {
      loadingMessage: 'One moment please...',
    };
    this.frameworkComponents = {
      customLoadingOverlay: CustomLoadingOverlayComponent,
    };
    if(modalParams && modalParams.hasOwnProperty('key') && modalParams.key.option){
      this.searchOption = modalParams.key;
      console.log(modalParams.key);
      console.log(this.searchOption);
      if(this.searchOption.option === 1){
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
      // {
      //   colId: 2,
      //   headerName: "Client", 
      //   field: "client", 
      //   suppressMovable: true,
      //   type: "date",
      // },
      // {
      //   colId: 3,
      //   headerName: "Column changed", 
      //   field: "editBy", 
      //   suppressMovable: true,
      //   type: "date",
      // },

      {
        colId: 2,
        headerName: "Edit by", 
        field: "editedBy", 
        suppressMovable: true,
        type: "date",
      },
      {
        colId: 3,
        headerName: "Old values", 
        field: "oldValues", 
        suppressMovable: true,
        type: "data",
      },
      {
        colId: 4,
        headerName: "New values", 
        field: "newValues", 
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

  }

  searchForm: FormGroup = this.fb.group({
    searchbar: ["",],
    history: [''],      
    oldVal: [false],
    newVal: [false],
  });

  allSearchForm: FormGroup = this.fb.group({
    searchbar: ["",],
  });

  private gridApi;
  private gridColumnApi;
  private searchOption: any;
  private modalTitle : string = "History";
  private columnDefs;
  private defaultColDef;
  private columnTypes;
  private autoGroupColumnDef;
  private rowData = [];
  private rowResponse = [];
  private getRowNodeId;
  private days:any= [{
    key: 30,
    value: 'Past 30 days',
  }];

  ngOnInit() {
  }


  closeModal(){
    this.dialog.closeAll();
  }

  fetchHistory(){
    this.rowData = [];
    let colId = this.searchOption.colId;
    let entryId = this.searchOption.entryId;
    
    let params = {
      colId: colId,
      EntryId: entryId
    }
    this.gridApi.showLoadingOverlay();
    this.saleslog.getCellHistory(params)
    .subscribe(res=>{
      this.rowData = res;
      this.rowResponse = res;
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.fetchHistory();
  }

  search(type){
    let val = this.allSearchForm.get('searchbar').value;
    console.log(val);
    if(val){
      let result = [];
      switch(this.searchOption.option){
        case 1:
          result = this.rowResponse.filter(res=> (res.editedBy && res.editedBy.includes(val) || res.newValues && res.newValues.includes(val) || res.oldValues && res.oldValues.includes(val)));
          console.log(result);
          if(result !== undefined){
            this.rowData = result;
          }
          break;
        case 2:
          let date = this.searchForm.get('history').value;
          result = this.rowResponse.filter(res=> (res.editedBy && res.editedBy.includes(val) || res.newValues && res.newValues.includes(val) || res.oldValues && res.oldValues.includes(val)));
          console.log(result);
          if(result !== undefined){
            this.rowData = result;
          }
          break;          
      }
    }
  }

}
