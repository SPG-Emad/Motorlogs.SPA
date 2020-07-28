import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import {ExcelExportModule } from '@ag-grid-enterprise/excel-export';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import { SiteTargetsService } from 'ml-setup/shared/services/site-targets/site-targets.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { TargetToastComponent } from '../target-toast/target-toast.component';
import { SharedService } from 'ml-setup/shared/services/shared/shared.service';
import { Subscription } from 'rxjs';
import { CustomLoadingOverlayComponent } from '../custom-loading-overlay/custom-loading-overlay.component';
import { IndividualTargetsService } from 'ml-setup/shared/services/individual-targets/individual-targets.service';

@Component({
  selector: 'app-targets-sheet',
  templateUrl: './targets-sheet.component.html',
  styleUrls: ['./targets-sheet.component.scss'],
  encapsulation: ViewEncapsulation.Emulated

})
export class TargetsSheetComponent implements OnInit {

  @Input() targetSelected:number;
  @Input() dateFilters:any;
  count :number = 0;
  private gridApi;
  private gridColumnApi;
  editing: boolean = false;
  emptyRows:any = [];
  

  public modules: any[] = [
      ClientSideRowModelModule,
      RowGroupingModule,
      ExcelExportModule,
      MenuModule,
      ColumnsToolPanelModule,
    ];
  private columnDefs;
  private defaultColDef;
  private columnTypes;
  private autoGroupColumnDef;
  private rowData = [];
  private columnData = [];
  private getRowNodeId;
  private aggFuncs;
  private colLength: number = 0;
  private baseCondtion:number = 0;

  private history: number = 3;
  private peroid: number = 3;
  private startFrom: number= null;
  public  emptyFieldsCount: number = 0;
  private getRowHeight;
  private overlayLoadingTemplate;
  private frameworkComponents;
  private loadingOverlayComponent;
  private loadingOverlayComponentParams;

  toastEvent:Subscription;


  constructor(
    // public snackBarRef: MatSnackBarRef<TargetToastComponent>,
    public sharedService: SharedService,
    public snackBar: MatSnackBar,
    private toastHandlerService: ToastHandlerService,
    private siteTargetSerivce: SiteTargetsService,
    private individualTargetsService: IndividualTargetsService
  ) {

    this.columnDefs = [];

    this.defaultColDef = {
      flex: 1,
      cellStyle: this.cellStyling.bind(this),
      editable: true, 
      filter: true,
      suppressMenu: true,
      minWidth: 150,
      maxWidth: 150,
      cellClass: 'row-text-style',
      groupRowRendererParams: {
        suppressCount: true
      },
      valueFormatter: this.formatNumber.bind(this),
      cellClassRules: {
        boldBorders: this.getCssRules.bind(this),
      },
      onCellValueChanged: this.setRowTotalValue.bind(this),
    };

    this.autoGroupColumnDef = { 
      minWidth: 400,
      headerName: 'Target' 
    };

    this.getRowNodeId = function(data) {
      return data.id;
    };

    this.getRowHeight = function(params) {  
      if (params.node.group) {
        return groupHeight;
      }else{
        return rowHeight;
      }
    };

    this.sharedService.getClickEvent()
    .subscribe(res=>{
      this.showEmptyRecords();
    });


    this.sharedService.getClearEvent()
    .subscribe(res=>{
      
      if(this.targetSelected === 0){
        this.generateGrid(this.response, "department");
      }else{
        this.generateGrid(this.response, "user");
      }
        
    });

    // this.overlayLoadingTemplate =
    // '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>';

    this.frameworkComponents = {
      customLoadingOverlay: CustomLoadingOverlayComponent,
    };

    this.loadingOverlayComponent = 'customLoadingOverlay';

    this.loadingOverlayComponentParams = {
      loadingMessage: 'One moment please...',
    };

  }
  
  configSuccess: MatSnackBarConfig = {
    panelClass: 'style-success',
    duration: 38000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom'
  };

  response = [
    {
      department:[
        {
          deptID: 1,
          departmentName: "Lennock Skoda",
          departmentCode: "LS",
          column: [
            {
              "vehicleOrders" : 
              [
                {
                  'period' : 'jan_20',
                  'value': 1,
                },
                {
                  'period' : 'feb_20',
                  'value': 2,
                },
                {
                  'period' : 'mar_20',
                  'value': 3,
                },  
                {
                  'period' : 'apr_20',
                  'value': 4,
                },
                {
                  'period' : 'may_20',
                  'value': 5,
                },
                {
                  'period' : 'jun_20',
                  'value': 6,
                },
                {
                  'period' : 'jul_20',
                  'value': 8,
                },
                {
                  'period' : 'aug_20',
                  'value': 9,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 10,
                },
                {
                  'period' : 'oct_20',
                  'value': 11,
                },
                {
                  'period' : 'nov_20',
                  'value': 12,
                },
              ]
            },
            {
              "vehicleProfit" :[
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 13,
                },
                {
                  'period' : 'mar_20',
                  'value': 14,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 15,
                },
                {
                  'period' : 'may_20',
                  'value': 16,
                },
                {
                  'period' : 'jun_20',
                  'value': 17,
                },
                {
                  'period' : 'jul_20',
                  'value': 20,
                },
                {
                  'period' : 'aug_20',
                  'value': 20,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 21,
                },
                {
                  'period' : 'oct_20',
                  'value': 22,
                },
                {
                  'period' : 'nov_20',
                  'value': 22,
                },
              ]
            },
            {
              "tradeInPercentage" : [
                {
                  'period' : 'jan_20',
                  'value': 23,
                },
                {
                  'period' : 'feb_20',
                  'value': 24,
                },
                {
                  'period' : 'mar_20',
                  'value': 25,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 26,
                },
                {
                  'period' : 'may_20',
                  'value': 27,
                },
                {
                  'period' : 'jun_20',
                  'value': 28,
                },
                {
                  'period' : 'jul_20',
                  'value': 30,
                },
                {
                  'period' : 'aug_20',
                  'value': 31,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 32,
                },
                {
                  'period' : 'oct_20',
                  'value': 33,
                },
                {
                  'period' : 'nov_20',
                  'value': 34,
                },
              ]
            }
          ]
        },
        {
          deptID: 2,
          departmentName: "Lennock Hondai",
          departmentCode: "LH",
          column: [
            {
              "vehicleOrders" : 
              [
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },
                {
                  'period' : 'jun_20',
                  'value': 9,
                  
                },
                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            },
            {
              "vehicleProfit" :[
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },

                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            },
            {
              "tradeInPercentage" : [
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },

                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            }
          ],
        },
        {
          deptID: 3,
          departmentName: "Lennock Volkswagen - New Cars",
          departmentCode: "LS Old",
          column: [
            {
              "vehicleOrders" : 
              [
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },

                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            },
            {
              "vehicleProfit" :[
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': "",
                },
                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            },
            {
              "tradeInPercentage" : [
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': "",
                },
                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            }
          ]
        },
        {
          deptID: 4,
          departmentName: "Lennock Motors - Finance",
          departmentCode: "LM",
          column: [
            {
              "vehicleOrders" : 
              [
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },
                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            },
            {
              "vehicleProfit" :[
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },
                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            },
            {
              "tradeInPercentage" : [
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': "",
                },
                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            }
          ]
        },
        {
          deptID: 5,
          departmentName: "Lennock Motors - Aftermarket",
          departmentCode: "LMA",
          column: [
            {
              "vehicleOrders" : 
              [
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },
                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            },
            {
              "vehicleProfit" :[
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },
                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            },
            {
              "tradeInPercentage" : [
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': "",
                },
                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            }
          ]
        },

      ]
    }
  ];


  indivisual_response = [
    {
      department:[
        {
          deptID: 1,
          departmentName: "Manager1",
          departmentCode: "LS",
          column: [
            {
              "vehicleOrders" : 
              [
                {
                  'period' : 'jan_20',
                  'value': 1,
                },
                {
                  'period' : 'feb_20',
                  'value': 2,
                },
                {
                  'period' : 'mar_20',
                  'value': 3,
                },  
                {
                  'period' : 'apr_20',
                  'value': 4,
                },
                {
                  'period' : 'may_20',
                  'value': 5,
                },
                {
                  'period' : 'jun_20',
                  'value': 6,
                },
                {
                  'period' : 'jul_20',
                  'value': 8,
                },
                {
                  'period' : 'aug_20',
                  'value': 9,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 10,
                },
                {
                  'period' : 'oct_20',
                  'value': 11,
                },
                {
                  'period' : 'nov_20',
                  'value': 12,
                },
              ]
            },
            {
              "vehicleProfit" :[
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 13,
                },
                {
                  'period' : 'mar_20',
                  'value': 14,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 15,
                },
                {
                  'period' : 'may_20',
                  'value': 16,
                },
                {
                  'period' : 'jun_20',
                  'value': 17,
                },
                {
                  'period' : 'jul_20',
                  'value': 20,
                },
                {
                  'period' : 'aug_20',
                  'value': 20,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 21,
                },
                {
                  'period' : 'oct_20',
                  'value': 22,
                },
                {
                  'period' : 'nov_20',
                  'value': 22,
                },
              ]
            },
            {
              "tradeInPercentage" : [
                {
                  'period' : 'jan_20',
                  'value': 23,
                },
                {
                  'period' : 'feb_20',
                  'value': 24,
                },
                {
                  'period' : 'mar_20',
                  'value': 25,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 26,
                },
                {
                  'period' : 'may_20',
                  'value': 27,
                },
                {
                  'period' : 'jun_20',
                  'value': 28,
                },
                {
                  'period' : 'jul_20',
                  'value': 30,
                },
                {
                  'period' : 'aug_20',
                  'value': 31,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 32,
                },
                {
                  'period' : 'oct_20',
                  'value': 33,
                },
                {
                  'period' : 'nov_20',
                  'value': 34,
                },
              ]
            }
          ]
        },
        {
          deptID: 2,
          departmentName: "Manager2",
          departmentCode: "LH",
          column: [
            {
              "vehicleOrders" : 
              [
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },
                {
                  'period' : 'jun_20',
                  'value': 9,
                  
                },
                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            },
            {
              "vehicleProfit" :[
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },

                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            },
            {
              "tradeInPercentage" : [
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },

                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            }
          ],
        },
        {
          deptID: 3,
          departmentName: "Manager3",
          departmentCode: "LS Old",
          column: [
            {
              "vehicleOrders" : 
              [
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },

                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            },
            {
              "vehicleProfit" :[
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },

                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            },
            {
              "tradeInPercentage" : [
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },

                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            }
          ]
        },
        {
          deptID: 4,
          departmentName: "Manager4",
          departmentCode: "LM",
          column: [
            {
              "vehicleOrders" : 
              [
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },

                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            },
            {
              "vehicleProfit" :[
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },

                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            },
            {
              "tradeInPercentage" : [
                {
                  'period' : 'jan_20',
                  'value': 6,
                },
                {
                  'period' : 'feb_20',
                  'value': 5,
                },
                {
                  'period' : 'mar_20',
                  'value': 9,
                },
    
                {
                  'period' : 'apr_20',
                  'value': 9,
                },
                {
                  'period' : 'may_20',
                  'value': 7,
                },
                {
                  'period' : 'jun_20',
                  'value': 5,
                },

                {
                  'period' : 'jul_20',
                  'value': 2,
                },
                {
                  'period' : 'aug_20',
                  'value': 11,
                },
    
                {
                  'period' : 'sep_20',
                  'value': 12,
                },
                {
                  'period' : 'oct_20',
                  'value': 55,
                },
                {
                  'period' : 'nov_20',
                  'value': 33,
                },
              ]
            }
          ]
        }
      ]
    }
  ];

  target = [
    {
      value: 'vehicle Orders'
    },
    {
      value: 'vehicle Profit'
    },
    {
      value: 'Trade-in %'
    }
  ]

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.snackBar.dismiss();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'dateFilters': {
            if(this.dateFilters){
              this.dateFilter(this.dateFilters);
            }
          }
        }
      }
    }
  }


  valueSetter(params) {
    if(params.data && params.data.target === "vehicle Orders"){
      let columnName= params.column.userProvidedColDef.field;
      let rowData=  this.getAllRows(columnName);
      rowData.forEach(res=>{
        console.log(res.data);
      })

    }
    console.log(params.newValue,params.oldValue);

    return params.newValue;
  }


  getCssRules(params) {
    if(params.colDef){
      if(params.colDef.type === "current" && 
         params.data.department !== "Lennock Phillip Pty Ltd & Lennock Automation Pt" 
      ){
        console.log(params.value, isNaN(params.value));
        return params.value === "" || params.value === undefined || isNaN(params.value) || params.value === null;
      }
    }
  }


  getclass(grid, row, col, rowIndex, colIndex) {
    var val = grid.getCellValue(row, col);
    if (val === 'male') {
      return 'blue';
    }
    else if (val === 'female') {
      return 'pink';
    }
  }


  openSnackBar(message) {
    this.snackBar.openFromComponent(TargetToastComponent, {
      data: message,
      ...this.configSuccess
    });
  }

  showEmptyRecords(){
    this.rowData = [];

    let departmentRow = [];

    let departmentName= "Lennock Phillip Pty Ltd & Lennock Automation Pt";
    if(this.targetSelected === 0){
      departmentRow.push(
        {
          "id":"total_orders",
          "rowId":"total_orders",
          "target":"vehicle Orders",
          "department": departmentName
        },
        {
          "id":"total_profit",
          "rowId":"total_profit",
          "target":"vehicle Profit",
          "department": departmentName
        },
        {
          "id":"trade_in",
          "rowId":"trade_in",
          "target":"Trade-in %",
          "department": departmentName
        },
        ...this.emptyRows
      );

    }else{
      departmentRow.push(
        {
          "id":"total_orders",
          "rowId":"total_orders",
          "target":"vehicle Orders",
          "department": departmentName
        },
        {
          "id":"total_profit",
          "rowId":"total_profit",
          "target":"vehicle Profit",
          "department": departmentName
        },
        ...this.emptyRows
      );
    }



    this.resetState();
        
    this.rowData = departmentRow;
    
    this.gridApi.refreshCells();


    this.calculateTotal(this.columnDefs, 1);

  }

  resetState() {
    this.gridColumnApi.resetColumnState();
    this.gridColumnApi.resetColumnGroupState();
    this.gridApi.setSortModel(null);
    this.gridApi.setFilterModel(null);
  }

  getAllRows(currentColumn?:string,targetColum?:string) {
    var rowData = [];
    let columnData = this.getAllColumn();
    this.gridApi.forEachNode(node => {
      columnData.forEach(column=>{
        if(node.data && node.data.rowId){
          if(
            node.data && node.data.target===targetColum && 
            column.userProvidedColDef.field===currentColumn && 
            node.data.rowId !=="total_orders" && 
            node.data.rowId !=="total_profit"
            )
          {
            let value = Number(node.data[column.userProvidedColDef.field]);
            rowData.push({
              department: node.data.department,
              target: node.data.target,
              column: column.userProvidedColDef.field,
              data: value
            });
          }
        }
      })
    });
    return rowData;
  }


  getRows(currentColumn?:string,targetColum?:string, column?, rows?) {
    var rowData = [];

    rows.forEachNode(node => {
      column.forEach(column=>{

        if(node.data && node.data.rowId){
          if(
            node.data && node.data.target===targetColum && 
            column.userProvidedColDef.field===currentColumn
            )
          {
            let value = Number(node.data[column.userProvidedColDef.field]);
            rowData.push({
              department: node.data.department,
              target: node.data.target,
              column: column.userProvidedColDef.field,
              data: value
            });
          }
        }
      })
    });
    return rowData;
  }


  getAllCurrentRows() {
    this.emptyRows = [];
    let columnData = this.getAllColumn();

    this.gridApi.forEachNode(node => {
      columnData.forEach(column=>{
        if(
          node.data &&
          column.userProvidedColDef.type==="current" && 
          node.data.rowId !=="total_orders" && 
          node.data.rowId !=="total_profit" &&
          node.data.rowId !=="trade_in"
          )
        {
          let value = Number(node.data[column.userProvidedColDef.field]);
          
          console.log("value:",value)
          console.log("value:",isNaN(value))
          if(value===0 || isNaN(value)){
            this.emptyRows.push(node.data);
            this.emptyFieldsCount = this.emptyFieldsCount + 1;
          }
        }
      })
    });

    console.log(this.emptyRows);
    
    return this.emptyFieldsCount;
  }


  getAllColumn(column?:string) {
    return this.gridColumnApi.getAllColumns();
  }


  formatNumber(params) {
    if(params.data && params.data.target){
      
      var number = params.value;
      var column = params.data.target;
      

      let rowData = this.target.find(el=>el.value === params.value);

      if(
        params.value !== undefined &&
        rowData === undefined &&
        isNaN(Number(params.value))
      ){  
        return "";

      }else{
        if(
          typeof params.value !=='undefined' &&
          column === "Trade-in %"
        ){
          let rowData = this.target.find(res=>res.value === params.value);
          if(rowData===undefined && params.value !=="" && params.value !==null){
            if(Number(params.value)<=100){
              return params.value+"%"
            }else{
              return ""
            }
          }
        }else if(
            column !== "vehicle Orders" && 
            params.value !== undefined &&
            column === "vehicle Profit"
        ){
          let rowData = this.target.find(res=>res.value === params.value)

          if(rowData===undefined && params.value !=="" && params.value !==null){
  
            return "$"+Math.floor(number).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
          }
        }else if(
          params.data.rowId === "total_profit" &&
          column === "vehicle Profit" &&  
          typeof params.value ==='undefined'
        ){
          return "$0";
        }else if(
          params.data.rowId === "total_orders" &&
          column === "vehicle Orders" &&  
          typeof params.value ==='undefined'
        ){
          return "0";
        }else if(
          params.data.rowId === "trade_in" &&
          column === "Trade-in %" &&  
          typeof params.value ==='undefined'
        ){
          return "0%";
        }
      }
    }
  }


  getRowValue(params) {

    let rowIndex = params.node.rowIndex;
    let rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));

    if(params.data.target==="Trade-in %"){
      return params;

    }
    return params;
  }


  setRowTotalValue(params) {
    /**
     * Base condition for change detection
     * If conditon equals to 0 then it perform change detection
     * else if equals 1, condition will be true and base conditon will be set again
     * to zero for next change.
     * */ 

    if(
      params.data.rowId !=="total_profit" && 
      params.data.rowId !=="total_orders" &&
      params.data.rowId !=="trade_in"
      
    ){

      /*If target column equal to vehicle orders then allow*/ 
      if(params.data && params.data.target === "vehicle Orders"){

        this.calculateRowData(params,"vehicle Orders","total_orders",0);
        this.baseCondtion = 1;
        this.insertCellData(params);

      }else if(params.data && params.data.target === "vehicle Profit"){

        this.calculateRowData(params,"vehicle Profit","total_profit",0);
        this.baseCondtion = 1;
        this.insertCellData(params);

      }else if(params.data && params.data.target === "Trade-in %"){

        this.calculateRowData(params,"Trade-in %","trade_in",0);
        this.baseCondtion = 1;
        this.insertCellData(params);

      }

      /*------------------------------------------------------*/ 
    }
  }

  
  insertCellData(params){

    if(this.targetSelected === 0){
      /*Insert data*/ 
      let apiParams = {
        'period': params.colDef.field,
        'deptId': params.data.rowId,
        'ColumnName': params.data.target,
        'rowValue': params.newValue
      }
      this.siteTargetSerivce.postTarget(apiParams)
      .subscribe(
        (res)=>{
          this.toastHandlerService.generateToast(res.message,'Clear',2000);
        },
        (err)=>{
          let message = "Error has occured.";
          this.toastHandlerService.generateToast(message,'Clear',2000);
        }
      );
      /*------------*/ 

    }else{
      /*Insert data*/ 
      let apiParams = {
        'period': params.colDef.field,
        'deptId': params.data.deptId,
        'userId': params.data.rowId,
        'ColumnName': params.data.target,
        'rowValue': params.newValue
      }
      this.individualTargetsService.updateTarget(apiParams)
      .subscribe(
        (res)=>{
          this.toastHandlerService.generateToast(res.message,'Clear',2000);
        },
        (err)=>{
          let message = "Error has occured.";
          this.toastHandlerService.generateToast(message,'Clear',2000);
        }
      );
      /*------------*/ 

    }
  }

  calculateRowData(params, targetColumn:string, rowName:string,option?:number){
    let columnName;

    if(option ===1){
      /*Fetch All columns*/ 
        columnName= params;
      /*-----------------*/
      }else{
      /*Fetch All columns*/ 
        columnName= params.column.userProvidedColDef.field;
      /*-----------------*/
    }

    

    /*Fetch all Rows*/ 
    let rowData=  this.getAllRows(columnName,targetColumn);
    /*--------------*/ 
    

    /*Loop over rows and get calculate total*/ 
    let total = 0;
    rowData.forEach(res=>{
      if(!isNaN(res.data)){
        total= total+ res.data;
      }
    });
    /*-----------------------*/
    // console.log(columnName,targetColumn,rowData);

    /*Fetch Total orders Node with getRowNode method of gridAPI*/ 
    var rowNode = this.gridApi.getRowNode(rowName);
    /*----------------------------------------------------*/ 
    // console.log("rowNode:",rowNode.data)

    if(option ===1){
      if(total && total > 0){

          /*Set total data calculated of vehicle Orders */ 
          rowNode.setDataValue(params, total);
          /*---------------------------------------------*/
      }
    }else{

      /*Set total data calculated of vehicle Orders */ 
      rowNode.setDataValue(params.colDef.field, total);
      /*---------------------------------------------*/
    }

  }


  onGridReady(params) {
    
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.showLoadingOverlay();

    let start = moment().format('MMM YY');
    start = start.toLowerCase().replace(' ','_');


    groupHeight = 20;
    rowHeight = 30;
    this.gridApi.resetRowHeights();

    if(this.targetSelected === 0){
      let apiParams = {
        Period: this.peroid,
        startDate: start.toUpperCase(),
        ActualHistory: this.history,
      }
      /*Fetch all columns data*/ 
      this.siteTargetSerivce.getTarget(apiParams).subscribe(res=>{
        this.response = res;

        this.generateGrid(this.response, "department");
      });
    }else{
      let apiParams = {
        Period: this.peroid,
        startDate: start.toUpperCase(),
        ActualHistory: this.history,
        deptId: 1118
      }
      /*Fetch all columns data*/ 
      this.individualTargetsService.getTarget(apiParams).subscribe(res=>{
        this.response = res;
        groupHeight = 20;
        rowHeight = 30;
        this.gridApi.resetRowHeights();
        this.generateGrid(this.response, "user");
      });    
    }

    // });
    /*=====================*/ 

  }


  generateGrid(targetResponse, key){
    this.gridApi.showLoadingOverlay();

    /*Initalize all variables*/ 
    let response= [];
    let row1 = {};
    let departmentRow = [];
    let column  = [];
    let period  = [];
    let history = [];
    let current = [];
    this.count = 0;
    this.colLength= 0;
    this.columnDefs = [];
    this.rowData = [];
    this.emptyFieldsCount = 0;
    /*------------------------*/ 

    response = targetResponse;
    
    /*Generate History, Current and Period Columns*/ 
    this.generateColumns(history, current, period);
    /*---------------------------------------------*/ 

    /*Merage all columns into Columns Array*/ 
    column.push(...history);
    column.push(...current);
    column.push(...period);
    /*--------------------*/ 

    
    /*Insert Initial Columns and Rows*/ 
    column.push(
      {
        headerName: 'Target',
        field: 'target',
        minWidth: 300,
        maxWidth: 300,
        pinned: 'left', 
        lockPinned: true,
        lockPosition: true, 
        suppressMovable: true,
        editable: false, 
        suppressMenu: true,
        
      },
      {
        headerName: "department", 
        field: "department", 
        suppressMovable: true,
        colId: 0,
        type: "departmentList",
        colOption: "d",
        rowGroup: true,
        minWidth: 250,
        maxWidth: 250,
        hide: true,
      }
    );

    if(key === "department"){
      departmentRow.push(
        {
          "id":"total_orders",
          "rowId":"total_orders",
          "target":"vehicle Orders",
          "department": "Lennock Phillip Pty Ltd & Lennock Automation Pt"
        },
        {
          "id":"total_profit",
          "rowId":"total_profit",
          "target":"vehicle Profit",
          "department": "Lennock Phillip Pty Ltd & Lennock Automation Pt"
        },
        {
          "id":"trade_in",
          "rowId":"trade_in",
          "target":"Trade-in %",
          "department": "Lennock Phillip Pty Ltd & Lennock Automation Pt"
        },
      );
    }else{
      departmentRow.push(
        {
          "id":"total_orders",
          "rowId":"total_orders",
          "target":"vehicle Orders",
          "department": "Lennock Phillip Pty Ltd & Lennock Automation Pt"
        },
        {
          "id":"total_profit",
          "rowId":"total_profit",
          "target":"vehicle Profit",
          "department": "Lennock Phillip Pty Ltd & Lennock Automation Pt"
        },
      );
    }

    /*----------------------------*/ 

    let count = 0;

    /*Fetch data from API request and Format for Grid*/ 
    response.forEach(depart => {
      
      /*Departments Array*/ 
      depart['column'].map((res,index)=>{
          row1 = {};
          let result=  res;

          if(result.hasOwnProperty('vehicleOrders')){
            result["vehicleOrders"].map(res=>{
              row1['id'] = count;
              if(key === "department"){
                row1['rowId'] = depart['deptId'];
                row1['department'] = depart['departmentName'];
              }else{
                row1['rowId'] = depart['userId'];
                row1['deptId'] = depart['deptId'];
                row1['department'] = depart['userName'];
              }
              row1[res.period] = res.value;
              row1['target'] = 'vehicle Orders';    
            });
            departmentRow.push({...row1});
            count++;
          }

          if(result.hasOwnProperty('vehicleProfit')){
            result["vehicleProfit"].map(res=>{
              row1['id'] = count;
              if(key === "department"){
                row1['rowId'] = depart['deptId'];
                row1['department'] = depart['departmentName'];
              }else{
                row1['rowId'] = depart['userId'];
                row1['deptId'] = depart['deptId'];
                row1['department'] = depart['userName'];
              }
              row1[res.period] = res.value;
              row1['target'] = 'vehicle Profit';    
            });
            departmentRow.push({...row1});
            count++;
          }

          if(result.hasOwnProperty('tradeInPercentage')){
            result["tradeInPercentage"].map(res=>{
              row1['id'] = count;
              if(key === "department"){
                row1['rowId'] = depart['deptId'];
                row1['department'] = depart['departmentName'];
              }else{
                row1['rowId'] = depart['userId'];
                row1['deptId'] = depart['deptId'];
                row1['department'] = depart['userName'];
              }
              row1[res.period] = res.value;
              row1['target'] = 'Trade-in %';
            });
            departmentRow.push({...row1});
            count++;
          }
        });
      });
    /*------------------------------*/ 

    console.log('Column:',column);
    console.log('DepartmentRow:',departmentRow);

    /*Load Fetched data into Grid*/ 
    this.columnDefs = column;
    this.columnData = column;
    this.rowData = departmentRow;
    /*---------------------------*/ 

    this.calculateTotal(column, 0);


  }
  
  calculateTotal(column, option){


    /*Set Toast for empty Rows*/ 
    setTimeout(() => {
  
      let col =column.filter(el=> {
        return el.headerName !== "Target" && el.headerName !== "department"
      })

      // this.colLength = col.length * 2;


      column.map(res=>{
        /*Calculate total orders and profit*/ 
        this.calculateRowData(res.field,"vehicle Orders","total_orders",1);
        this.calculateRowData(res.field,"vehicle Profit","total_profit",1);
     
        /*------------------------------------------------------*/ 
      })

      /*Fetch all Empty Rows*/ 
      let emptyRows = this.getAllCurrentRows();
      /*--------------------*/ 

      if(option ===1){
        this.configSuccess.duration=null;
          let message = "1 filter applied";
          this.openSnackBar(message);
      }else{
        /*If empty rows exist show toast*/ 
        if(emptyRows>0){
          let message = emptyRows+" Values missing.";
          this.openSnackBar(message);
        }
      }
      /*------------------------------*/


    }, (1000));
    /*------------------------*/ 

  }

  generateColumns(history, current, period){

    this.fetchHistoryMonths(history);

    this.fetchCurrentMonths(current);
    
    this.fetchPeriods(period);
    
  }


  fetchCurrentMonths(column){
    /*Generate Key and value for startFrom Object from momentJs*/ 
    let month =(this.startFrom)? moment(this.startFrom).format('MMM YY'): moment().format('MMM YY');
    let key = month.toLowerCase().replace(' ','_');


    column.push({ 
      headerName: month.toUpperCase(), 
      field: key, 
      suppressMovable: true,
      type: "current",
    });

  }


  cellClass(grid, row, col, rowIndex, colIndex) {
    var val = this.gridColumnApi.getCellValue(row, col);
    if (val === '') {
      return 'required';
    }
  }

  
  fetchHistoryMonths(column){
    for(let i = this.history; i>0; i--){
    
      /*Generate Key and value for startFrom Object from momentJs*/ 
      let month = (this.startFrom)?moment(this.startFrom).subtract(i, 'months').format('MMM YY'): moment().subtract(i, 'months').format('MMM YY');
      let key = month.toLowerCase().replace(' ','_');
      /*---------------------------------------------------------*/ 

      column.push({ 
        headerName: month.toUpperCase(), 
        field: key, 
        suppressMovable: true,
        // colId: key,
        type: "history",
      });
    }
  }


  fetchPeriods(column){
    for(let i=1; i<=this.peroid; i++){
    
      /*Generate Key and value for startFrom Object from momentJs*/ 
      let month = (this.startFrom)? moment(this.startFrom).add(i, 'months').format('MMM YY') : moment().add(i, 'months').format('MMM YY');
      let key = month.toLowerCase().replace(' ','_');

      column.push({ 
        headerName: month.toUpperCase(), 
        field: key, 
        suppressMovable: true,
        // colId: key,
        type: "period",
      });
    }

  }


  dateFilter(object:any){

    let period = object.period;
    let history = object.history;
    let startFrom = object.startFrom;
    
    this.peroid = period;
    this.history = history;
    this.startFrom = startFrom;

    

    let start = moment(this.startFrom).format('MMM YY');
    start = start.toLowerCase().replace(' ','_');

    let apiParams = {
      peroid: this.peroid,
      StartDate: start.toUpperCase(),
      ActualHistory: this.history,
    }

    this.gridApi.showLoadingOverlay();

    groupHeight = 20;
    rowHeight = 30;
    this.gridApi.resetRowHeights();


    if(this.targetSelected === 0){
      let apiParams = {
        Period: this.peroid,
        startDate: start.toUpperCase(),
        ActualHistory: this.history,
      }
      /*Fetch all columns data*/ 
      this.siteTargetSerivce.getTarget(apiParams).subscribe(res=>{
        this.response = res;

        this.generateGrid(this.response, "department");
      });
    }else{
      let apiParams = {
        Period: this.peroid,
        startDate: start.toUpperCase(),
        ActualHistory: this.history,
        deptId: 1118
      }
      /*Fetch all columns data*/ 
      this.individualTargetsService.getTarget(apiParams).subscribe(res=>{
        this.response = res;

        this.generateGrid(this.response, "user");
      });    
    }

  }


  cellStyling(params) {
    
    if(params.node.level === 0) {
      return { 
        'backgroundColor': '#2076D2', 
        'color':'#fff',fontWeight:'bold',
        'cursor':'pointer',
        'height':'30px'
      }
    }else if(
      params.data.rowId !== "total_orders" && 
      params.data.rowId !== "total_profit" && 
      params.data.rowId !== "trade_in" && 
      params['column']['userProvidedColDef'].type === "current"
    ){
      return { backgroundColor: '#fff','border-right': '1px solid #ececec','color':'#000','font-weight':'normal'};

    }else if(
      params.data.rowId === "total_orders" && 
      params['column']['userProvidedColDef'].type === "history" && 
      params['column']['userProvidedColDef'].type !== "department" && 
      params['column']['userProvidedColDef'].pinned !== "left"
    ){
      return { 
        'backgroundColor': '#fffbde', 
        'color':'#4b8cd8',
        'cursor':'pointer',
        'font-weight': 'normal',
        'pointer-events':'none',
        'border-right': '1px solid #ececec'
      }
    }else if(
      params.data.rowId === "total_profit" && 
      params['column']['userProvidedColDef'].type === "history" && 
      params['column']['userProvidedColDef'].type !== "department" && 
      params['column']['userProvidedColDef'].pinned !== "left"
    ){
      return { 
        'backgroundColor': '#fffbde', 
        'color':'#4b8cd8',
        'cursor':'pointer',
        'font-weight': 'normal',
        'pointer-events':'none',
        'border-right': '1px solid #ececec'
      }
    }else if(
      params.data.rowId === "trade_in" && 
      params['column']['userProvidedColDef'].type === "history" && 
      params['column']['userProvidedColDef'].type !== "department" && 
      params['column']['userProvidedColDef'].pinned !== "left"
    ){
      return { 
        'backgroundColor': '#fffbde', 
        'color':'#4b8cd8',
        'cursor':'pointer',
        'font-weight': 'normal',
        'pointer-events':'none',
        'border-right': '1px solid #ececec'
      }
    }
    else if(
      params['column']['userProvidedColDef'].type === "history" && 
      params['column']['userProvidedColDef'].type !== "current"
    ){
      return { 
        'backgroundColor': '#fffbde', 
        'color':'#000',
        'cursor':'pointer',
        'pointer-events':'none',
        'border-right': '1px solid #ececec',
        'font-weight':'normal'
      }
    }else if(
      params.data.rowId === "total_orders" && 
      params['column']['userProvidedColDef'].type !== "history" && 
      params['column']['userProvidedColDef'].type !== "department" && 
      params['column']['userProvidedColDef'].pinned !== "left"
    ){
      return { 
        'pointer-events':'none',
        'backgroundColor': '#e7eefd', 
        'color':'#4b8cd8',
        'font-weight': 'normal',
        'cursor':'pointer',
      }
    }else if(
      params.data.rowId === "total_profit" &&
      params['column']['userProvidedColDef'].type !== "history" && 
      params['column']['userProvidedColDef'].type !== "department" && 
      params['column']['userProvidedColDef'].pinned !== "left"
    ){
      return { 
        'pointer-events':'none',
        'backgroundColor': '#e7eefd', 
        'color':'#4b8cd8',
        'font-weight': 'normal',
        'cursor':'pointer',
      }
    }else if(
      params.data.rowId === "trade_in" &&
      params['column']['userProvidedColDef'].type !== "history" && 
      params['column']['userProvidedColDef'].type !== "department" && 
      params['column']['userProvidedColDef'].pinned !== "left"
    ){
      return { 
        'pointer-events':'none',
        'backgroundColor': '#e7eefd', 
        'color':'#4b8cd8',
        'font-weight': 'normal',
        'cursor':'pointer',
      }
    }

    return { backgroundColor: '#fff','border-right': '1px solid #ececec','color':'#000','font-weight':'normal'};
  }


  exportGird(){
    this.gridApi.exportDataAsExcel({
      exportMode: 'xlsx', 
      sheetName: 'site-target',
      processRowGroupCallback: rowGroupCallback,
    });
  }


}

function rowGroupCallback(params) {
  return params.node.key;
}




var groupHeight, rowHeight;