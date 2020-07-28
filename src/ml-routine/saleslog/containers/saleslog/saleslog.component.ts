
import { CustomFilterMenuComponent } from './../../../shared/components/custom-filter-menu/custom-filter-menu.component';
import { CustomDropdownComponent } from './../../../shared/components/custom-dropdown/custom-dropdown.component';
import { filter } from 'rxjs/operators';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ClipboardModule } from '@ag-grid-enterprise/clipboard';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { Component, OnInit, ChangeDetectionStrategy, Inject, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HistoryComponent } from 'ml-routine/saleslog/components/history/history.component';
import { NewDealComponent } from 'ml-routine/saleslog/components/new-deal/new-deal.component';
import { ExcelExportComponent } from 'ml-routine/saleslog/components/excel-export/excel-export.component';
import { ColumnOptionComponent } from 'ml-routine/saleslog/components/column-option/column-option.component';

import { AllModules } from '@ag-grid-enterprise/all-modules';
import { CustomHeaderComponent } from 'ml-routine/shared/components/custom-header/custom-header.component';
import { SlideInOutAnimation } from 'app/shared/animation/animation';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { EncryptionService } from 'app/shared/services/encryption.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
// import * as Selectize from '../../../../../node_modules/selectize/dist/js/standalone/selectize.js';

declare var $:any;
// declare var Selectize:any;


@Component({
  selector: 'ml-saleslog',
  templateUrl: './saleslog.component.html',
  styleUrls: ['./saleslog.component.scss'],
  animations: [SlideInOutAnimation]
})
export class SaleslogComponent implements OnInit {
  cities = [
    {id: 1, name: 'Vilnius'},
    {id: 2, name: 'Kaunas'},
    {id: 3, name: 'Pavilnys', disabled: true},
    {id: 4, name: 'Pabradė'},
    {id: 5, name: 'Klaipėda'}
  ];
  selectedCity: number;
  public carryOverAmount: number =- 0;
  public carryOverUnits: number =0;
  public carryOverAvg: number =0;
  
  public soldAmount: number =- 0;
  public soldUnits: number =0;
  public soldAvg: number =0;


  public coveredAmount: number =- 0;
  public coveredUnits: number =0;
  public coveredAvg: number =0;


  public deliveredAmount: number =- 0;
  public deliveredUnits: number =0;
  public deliveredAvg: number =0;

  private gridApi;
  private gridColumnApi;

  public modules: any[] = AllModules;
  private columnDefs;
  private defaultColDef;
  private columnTypes;
  private autoGroupColumnDef;
  private rowData = [];
  private rows = [];

  private getRowNodeId;
  private aggFuncs;
  private baseCondtion:number = 0;
  private rowHeight: number;

  private history: number = 3;
  private peroid: number = 3;
  private startFrom: number= null;
  public  emptyFieldsCount: number = 0;
  private statusOption: string[]= ['NEW','DEMO'];
  private payOptions: string[]= ['Cash','OFA','IHP'];
  private salesEngOption: string[]= [''];
  private salesPersonOption: string[]= ['Morgan Mac','Emily Gill','James Over','Robert Knight'];
  private afterMarketManagerOptions: string[]= ['Fleet','No intro'];
  private financeManagerOption: string[]= ['LOCUM','Fleet'];
  private components;
  public rowSelection;
  public thisComponent = this;
  private getRowClass;
  private dialogRef: any;
  private frameworkComponents:any;
  printdata:any;
  public rowColor = [
    {
      rowId:1,
      colId:0,
      color:''
    },
    {
      rowId:2,
      colId:0,
      color:''
    },
    {
      rowId:3,
      colId:0,
      color:''
    },
        
    {
      rowId:4,
      colId:0,
      color:''
    },
    {
      rowId:5,
      colId:0,
      color:''
    },
    {
      rowId:6,
      colId:0,
      color:''
    },
    {
      rowId:7,
      colId:0,
      color:''
    },
    {
      rowId:8,
      colId:0,
      color:''
    },
    {
      rowId:9,
      colId:0,
      color:''
    },
    {
      rowId:10,
      colId:0,
      color:''
    },
    {
      rowId:11,
      colId:0,
      color:''
    },
    {
      rowId:12,
      colId:0,
      color:''
    },    
    {
      rowId:13,
      colId:0,
      color:''
    },
        {
      rowId:14,
      colId:0,
      color:''
    },    
    {
      rowId:15,
      colId:0,
      color:''
    }

  ];
  private postProcessPopup;

  monthSearch:any;
  animationState = 'out';
  searchDate:any= [];
  currentDate:any= [];
  years: any = [];
  months: any = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Nov','Dec'];
  monthActive: any;
  yearCounter= 0;
  monthModal: boolean = false;
  monthSelected: any;
  monthFilter:string;
  yearActive: string;
  sliderItem: string;
  sliderIndex: number;
  private toggleColumns: boolean = true;
  decryptedDepartmentId: string;


  searchForm: FormGroup = this.fb.group({
    searchbar: ["",],
    currentMonth: [true],      
    previousMonth: [""],
    deletedRecords: ["",],
  });
  constructor(
    private http: HttpClient,
    private toastHandlerService: ToastHandlerService,
    public dialog: MatDialog,
    private fb: FormBuilder, 
    private router: Router, 
    public snackBar: MatSnackBar,
    private route: ActivatedRoute, 
    private encryptionService: EncryptionService
    // private siteTargetSerivce: SiteTargetsService
    ) {
        this.route.paramMap.subscribe(params => {
            this.decryptedDepartmentId = this.encryptionService.convertToEncOrDecFormat('decrypt', params.get("id"));
        });
        
        this.columnDefs = [];

        this.defaultColDef = {
        flex: 1,
        editable: true, 
        filter: true,
        cellClass: 'row-text-style',
        cellClassRules: {
            'green-color': function(params) { return params.value === 'OFA'},
            'blue-color':  function(params) { return params.value === 'Cash'},
            'pink-color':  function(params) { return params.value === 'IHP'},
            
            'green-mark': function(params) { 
            let thisRef = params.context.thisComponent;
            let currentRow;
            if(params.colDef){
                currentRow = thisRef.rowColor.find(el=> el.rowId=== params.rowIndex && el.colId === params.colDef.colId);
            }
            return (currentRow !== undefined)?currentRow.color === 'green': false;
            },
            'blue-mark':  function(params) { 
            let thisRef = params.context.thisComponent;
            let currentRow;
            if(params.colDef){
                currentRow = thisRef.rowColor.find(el=> el.rowId=== params.rowIndex && el.colId === params.colDef.colId);
            }
            return (currentRow !== undefined)?currentRow.color === 'blue': false;

            },
            'purple-mark':  function(params) { 
            let thisRef = params.context.thisComponent;
            let currentRow;
            if(params.colDef){
                currentRow = thisRef.rowColor.find(el=> el.rowId=== params.rowIndex && el.colId === params.colDef.colId);
            }
            return (currentRow !== undefined)?currentRow.color === 'purple': false;
            },

            'yellow-mark': function(params) { 
            let thisRef = params.context.thisComponent;
            let currentRow;
            if(params.colDef){
                currentRow = thisRef.rowColor.find(el=> el.rowId=== params.rowIndex && el.colId === params.colDef.colId);
            }
            return (currentRow !== undefined)?currentRow.color === 'yellow': false;
            },
            'red-mark':  function(params) { 
            let thisRef = params.context.thisComponent;
            let currentRow;
            if(params.colDef){
                currentRow = thisRef.rowColor.find(el=> el.rowId=== params.rowIndex && el.colId === params.colDef.colId);
            }
            return (currentRow !== undefined)?currentRow.color === 'red': false;
            },
            'red-field-color': function(params) {
            // console.log('params:',params);
            if(
                params.colDef.field === "sales_eng" &&
                params.colDef.field === "aftermarket_manager" &&
                params.colDef.field === "finance_manager"
            ){
                let choice = false;
                let date = moment().format('DD-MMM-YY');
                // console.log(params.data.orderDate);
                let isAfter =moment(params.data.orderDate).isSame(date);
                if(isAfter){
                choice = false;
                }else{
                let isBefore =moment(params.data.orderDate).isBefore(date);
                choice = isBefore;
                }
                // console.log("after",params.data.orderDate,isAfter,"choice:",choice);
                return params.value === '' && choice;
                
            }else if(params.colDef.field === "pay"){
                let date = moment().format('DD-MMM-YY');
                let isAfter =moment(params.data.orderDate).isSameOrAfter(date);
                let isBefore;
                let choice;
                if(!isAfter){
                choice = moment(params.data.orderDate).isBefore(date);
                
                }else{
                choice = isAfter;
                }
                // console.log(params.data.orderDate);

                return params.value === '' && choice
            }else{
                return false;
            }
            },
        },
        // filter: 'customFilter',
        // menuTabs: ['filterMenuTab','columnsMenuTab','generalMenuTab'],
        headerComponentParams: { menuIcon: 'fa-chevron-down' },
        // cellStyle: this.cellStyling.bind(this),
        minWidth: 100,
        // maxWidth: 100,
        // cellClassRules: {
        //   boldBorders: this.getCssRules.bind(this),
        // },
        // onCellValueChanged: this.setRowTotalValue.bind(this),
        // context: {
        //   thisComponent : this
        // },
        // valueFormatter: this.formatNumber.bind(this),
        // minWidth: 105,
        // maxWidth: 105,
        // resizable: true,
        };

        this.autoGroupColumnDef = { 
        minWidth: 400,
        };
        this.rowHeight = 29;

        this.getRowNodeId = function(data) {
        return data.id;
        };
        this.frameworkComponents = {
        agColumnHeader: CustomHeaderComponent, 
        dropdownRenderer: CustomDropdownComponent,
        //  dropdown:getDropDown,
        customFilter: CustomFilterMenuComponent,
        };

        // this.getRowClass = function(params) {
        //   console.log("params:",params);
        //   return "green-mark";
        // };


        this.rowSelection = 'single';

        this.components = { 
        singleClickEditRenderer: getRenderer(),
        // datePicker: getDatePicker(),
        // dropdown: getDropDown(),
        // custom: getCustomDropDown()
        };
    }


  response = [
    {
      column:[
        {
          colId:1,
          colName:'Order Date',
          colCode:'orderDate',
          type: 'date'
        },
        {
          colName: "Estimated Delivery", 
          colCode: "estimated_delivery", 
          type: 'date'
        },
        {
          colName: "Actual Delivery", 
          colCode: "actual_delivery", 
          type: 'date'
        },
        {
          colName: "Reported Date", 
          colCode: "reported_date",
          type: 'date'
        },
        {
          colName: "Status", 
          colCode: "status", 
          type: 'dropdown'
        },
        {
          colName: "Pay", 
          colCode: "pay", 
          type: 'dropdown'
        },
        {
          colName: "Sales Eng", 
          colCode: "sales_eng", 
          type: 'dropdown'
        },
        {
          colName: "AfterMarket Manager", 
          colCode: "aftermarket_manager", 
          type: 'dropdown'
        },
        {
          colName: "Sales Person", 
          colCode: "sales_person", 
          type: 'dropdown'
        },
        {
          colName: "Client", 
          colCode: "client", 
          type: 'text'
        },
        {
          colName: "Company Name", 
          colCode: "company_name", 
          type: 'text'
        },
        {
          colName: "Driver's Name", 
          colCode: "drivers_name", 
          type: 'text'
        },
        {
          colName: "Phone Number", 
          colCode: "phone_number", 
          type: 'number'
        },
        {
          colName: "Phone Number", 
          colCode: "phone_number", 
          type: 'number'
        },
        {
          colName: "Cust. No.", 
          colCode: "cust_no", 
          type: 'number'
        },
        {
          colName: "Vehicle Gross", 
          colCode: "vehicle_gross", 
          type: 'number'
        }
      ],
      rowData:[
        {
          row:[
            {
              rowValue:'03-Mar-19',
              colCode: 'orderDate'
            },
            {
              rowValue:'03-Jun-20',
              colCode: 'estimated_delivery'
            },
            {
              rowValue:'03-Jun-20',
              colCode: 'actual_delivery'
            },
            {
              rowValue:'03-Jun-20',
              colCode: 'reported_date'
            },
            {
              rowValue:'New',
              colCode: 'status'
            },
            {
              rowValue:'OFA',
              colCode: 'pay'
            },
            {
              rowValue:'',
              colCode: 'sales_eng'
            },
            {
              rowValue:'',
              colCode: 'sales_person'
            },
            {
              rowValue:'Fleet',
              colCode: 'aftermarket_manager'
            },
            {
              rowValue:'LOCUM',
              colCode: 'finance_manager' 
            },
            {
              rowValue:'',
              colCode: 'client' 
            },
            {
              rowValue:'',
              colCode: 'company_name' 
            },
            {
              rowValue:'',
              colCode: 'drivers_name' 
            },
            {
              rowValue:'03232323232',
              colCode: 'phone_number' 
            },
            {
              rowValue:'',
              colCode: 'cust_no' 
            },
            {
              rowValue: 5000,
              colCode: 'vehicle_gross' 
            }
          ]
        },
        {
          row:[
            {
              rowValue:'05-Jun-19',
              colCode: 'orderDate'
            },
            {
              rowValue:'05-Jun-20',
              colCode: 'estimated_delivery'
            },
            {
              rowValue:'05-Jun-20',
              colCode: 'actual_delivery'
            },
            {
              rowValue:'05-Jun-20',
              colCode: 'reported_date'
            },
            {
              rowValue:'New',
              colCode: 'status'
            },
            {
              rowValue:'Cash',
              colCode: 'pay'
            },
            {
              rowValue:'',
              colCode: 'sales_eng'
            },
            {
              rowValue:'',
              colCode: 'sales_person'
            },
            {
              rowValue:'Fleet',
              colCode: 'aftermarket_manager'
            },
            {
              rowValue:'LOCUM',
              colCode: 'finance_manager' 
            },
            {
              rowValue:'',
              colCode: 'client' 
            },
            {
              rowValue:'',
              colCode: 'company_name' 
            },
            {
              rowValue:'',
              colCode: 'drivers_name' 
            },
            {
              rowValue:'03232323232',
              colCode: 'phone_number' 
            },
            {
              rowValue:'',
              colCode: 'cust_no' 
            },
            {
              rowValue: 5000,
              colCode: 'vehicle_gross' 
            }
          ]
        },
        {
          row:[
            {
              rowValue:'10-May-20',
              colCode: 'orderDate'
            },
            {
              rowValue:'11-Jun-20',
              colCode: 'estimated_delivery'
            },
            {
              rowValue:'',
              colCode: 'actual_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'reported_date'
            },
            {
              rowValue:'New',
              colCode: 'status'
            },
            {
              rowValue:'Cash',
              colCode: 'pay'
            },
            {
              rowValue:'',
              colCode: 'sales_eng'
            },
            {
              rowValue:'',
              colCode: 'sales_person'
            },
            {
              rowValue:'Fleet',
              colCode: 'aftermarket_manager'
            },
            {
              rowValue:'LOCUM',
              colCode: 'finance_manager' 
            },
            {
              rowValue:'',
              colCode: 'client' 
            },
            {
              rowValue:'',
              colCode: 'company_name' 
            },
            {
              rowValue:'',
              colCode: 'drivers_name' 
            },
            {
              rowValue:'03232323232',
              colCode: 'phone_number' 
            },
            {
              rowValue:'',
              colCode: 'cust_no' 
            },
            {
              rowValue: 5000,
              colCode: 'vehicle_gross' 
            }
          ]
        },
        {
          row:[
            {
              rowValue:'15-Apr-20',
              colCode: 'orderDate'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'estimated_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'actual_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'reported_date'
            },
            {
              rowValue:'New',
              colCode: 'status'
            },
            {
              rowValue:'Cash',
              colCode: 'pay'
            },
            {
              rowValue:'',
              colCode: 'sales_eng'
            },
            {
              rowValue:'',
              colCode: 'sales_person'
            },
            {
              rowValue:'Fleet',
              colCode: 'aftermarket_manager'
            },
            {
              rowValue:'LOCUM',
              colCode: 'finance_manager' 
            },
            {
              rowValue:'',
              colCode: 'client' 
            },
            {
              rowValue:'',
              colCode: 'company_name' 
            },
            {
              rowValue:'',
              colCode: 'drivers_name' 
            },
            {
              rowValue:'03232323232',
              colCode: 'phone_number' 
            },
            {
              rowValue:'',
              colCode: 'cust_no' 
            },
            {
              rowValue: 2000,
              colCode: 'vehicle_gross' 
            }
          ]
        },
        {
          row:[
            {
              rowValue:'15-Mar-20',
              colCode: 'orderDate'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'estimated_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'actual_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'reported_date'
            },
            {
              rowValue:'New',
              colCode: 'status'
            },
            {
              rowValue:'Cash',
              colCode: 'pay'
            },
            {
              rowValue:'',
              colCode: 'sales_eng'
            },
            {
              rowValue:'',
              colCode: 'sales_person'
            },
            {
              rowValue:'Fleet',
              colCode: 'aftermarket_manager'
            },
            {
              rowValue:'LOCUM',
              colCode: 'finance_manager' 
            },
            {
              rowValue:'',
              colCode: 'client' 
            },
            {
              rowValue:'',
              colCode: 'company_name' 
            },
            {
              rowValue:'',
              colCode: 'drivers_name' 
            },
            {
              rowValue:'03232323232',
              colCode: 'phone_number' 
            },
            {
              rowValue:'',
              colCode: 'cust_no' 
            },
            {
              rowValue: 1000,
              colCode: 'vehicle_gross' 
            }
          ]
        },
        {
          row:[
            {
              rowValue:'15-Feb-20',
              colCode: 'orderDate'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'estimated_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'actual_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'reported_date'
            },
            {
              rowValue:'New',
              colCode: 'status'
            },
            {
              rowValue:'Cash',
              colCode: 'pay'
            },
            {
              rowValue:'',
              colCode: 'sales_eng'
            },
            {
              rowValue:'',
              colCode: 'sales_person'
            },
            {
              rowValue:'Fleet',
              colCode: 'aftermarket_manager'
            },
            {
              rowValue:'LOCUM',
              colCode: 'finance_manager' 
            },
            {
              rowValue:'',
              colCode: 'client' 
            },
            {
              rowValue:'',
              colCode: 'company_name' 
            },
            {
              rowValue:'',
              colCode: 'drivers_name' 
            },
            {
              rowValue:'03232323232',
              colCode: 'phone_number' 
            },
            {
              rowValue:'',
              colCode: 'cust_no' 
            },
            {
              rowValue: 15000,
              colCode: 'vehicle_gross' 
            }
          ]
        },
        {
          row:[
            {
              rowValue:'15-Feb-20',
              colCode: 'orderDate'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'estimated_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'actual_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'reported_date'
            },
            {
              rowValue:'New',
              colCode: 'status'
            },
            {
              rowValue:'Cash',
              colCode: 'pay'
            },
            {
              rowValue:'',
              colCode: 'sales_eng'
            },
            {
              rowValue:'',
              colCode: 'sales_person'
            },
            {
              rowValue:'Fleet',
              colCode: 'aftermarket_manager'
            },
            {
              rowValue:'LOCUM',
              colCode: 'finance_manager' 
            },
            {
              rowValue:'',
              colCode: 'client' 
            },
            {
              rowValue:'',
              colCode: 'company_name' 
            },
            {
              rowValue:'',
              colCode: 'drivers_name' 
            },
            {
              rowValue:'03232323232',
              colCode: 'phone_number' 
            },
            {
              rowValue:'',
              colCode: 'cust_no' 
            },
            {
              rowValue: 500,
              colCode: 'vehicle_gross' 
            }
          ]
        },
        {
          row:[
            {
              rowValue:'15-Feb-20',
              colCode: 'orderDate'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'estimated_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'actual_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'reported_date'
            },
            {
              rowValue:'New',
              colCode: 'status'
            },
            {
              rowValue:'Cash',
              colCode: 'pay'
            },
            {
              rowValue:'',
              colCode: 'sales_eng'
            },
            {
              rowValue:'',
              colCode: 'sales_person'
            },
            {
              rowValue:'Fleet',
              colCode: 'aftermarket_manager'
            },
            {
              rowValue:'LOCUM',
              colCode: 'finance_manager' 
            },
            {
              rowValue:'',
              colCode: 'client' 
            },
            {
              rowValue:'',
              colCode: 'company_name' 
            },
            {
              rowValue:'',
              colCode: 'drivers_name' 
            },
            {
              rowValue:'03232323232',
              colCode: 'phone_number' 
            },
            {
              rowValue:'',
              colCode: 'cust_no' 
            },
            {
              rowValue: 5000,
              colCode: 'vehicle_gross' 
            }
          ]
        },
        {
          row:[
            {
              rowValue:'15-Feb-20',
              colCode: 'orderDate'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'estimated_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'actual_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'reported_date'
            },
            {
              rowValue:'New',
              colCode: 'status'
            },
            {
              rowValue:'Cash',
              colCode: 'pay'
            },
            {
              rowValue:'',
              colCode: 'sales_eng'
            },
            {
              rowValue:'',
              colCode: 'sales_person'
            },
            {
              rowValue:'Fleet',
              colCode: 'aftermarket_manager'
            },
            {
              rowValue:'LOCUM',
              colCode: 'finance_manager' 
            },
            {
              rowValue:'',
              colCode: 'client' 
            },
            {
              rowValue:'',
              colCode: 'company_name' 
            },
            {
              rowValue:'',
              colCode: 'drivers_name' 
            },
            {
              rowValue:'03232323232',
              colCode: 'phone_number' 
            },
            {
              rowValue:'',
              colCode: 'cust_no' 
            },
            {
              rowValue: 4000,
              colCode: 'vehicle_gross' 
            }
          ]
        },
        {
          row:[
            {
              rowValue:'15-Feb-20',
              colCode: 'orderDate'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'estimated_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'actual_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'reported_date'
            },
            {
              rowValue:'New',
              colCode: 'status'
            },
            {
              rowValue:'Cash',
              colCode: 'pay'
            },
            {
              rowValue:'',
              colCode: 'sales_eng'
            },
            {
              rowValue:'',
              colCode: 'sales_person'
            },
            {
              rowValue:'Fleet',
              colCode: 'aftermarket_manager'
            },
            {
              rowValue:'LOCUM',
              colCode: 'finance_manager' 
            },
            {
              rowValue:'',
              colCode: 'client' 
            },
            {
              rowValue:'',
              colCode: 'company_name' 
            },
            {
              rowValue:'',
              colCode: 'drivers_name' 
            },
            {
              rowValue:'03232323232',
              colCode: 'phone_number' 
            },
            {
              rowValue:'',
              colCode: 'cust_no' 
            },
            {
              rowValue: 1030,
              colCode: 'vehicle_gross' 
            }
          ]
        },
        {
          row:[
            {
              rowValue:'10-Jun-20',
              colCode: 'orderDate'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'estimated_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'actual_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'reported_date'
            },
            {
              rowValue:'New',
              colCode: 'status'
            },
            {
              rowValue:'Cash',
              colCode: 'pay'
            },
            {
              rowValue:'',
              colCode: 'sales_eng'
            },
            {
              rowValue:'',
              colCode: 'sales_person'
            },
            {
              rowValue:'Fleet',
              colCode: 'aftermarket_manager'
            },
            {
              rowValue:'LOCUM',
              colCode: 'finance_manager' 
            },
            {
              rowValue:'',
              colCode: 'client' 
            },
            {
              rowValue:'',
              colCode: 'company_name' 
            },
            {
              rowValue:'',
              colCode: 'drivers_name' 
            },
            {
              rowValue:'03232323232',
              colCode: 'phone_number' 
            },
            {
              rowValue:'',
              colCode: 'cust_no' 
            },
            {
              rowValue: 300,
              colCode: 'vehicle_gross' 
            }
          ]
        },
        {
          row:[
            {
              rowValue:'10-Jun-20',
              colCode: 'orderDate'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'estimated_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'actual_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'reported_date'
            },
            {
              rowValue:'New',
              colCode: 'status'
            },
            {
              rowValue:'Cash',
              colCode: 'pay'
            },
            {
              rowValue:'',
              colCode: 'sales_eng'
            },
            {
              rowValue:'',
              colCode: 'sales_person'
            },
            {
              rowValue:'Fleet',
              colCode: 'aftermarket_manager'
            },
            {
              rowValue:'LOCUM',
              colCode: 'finance_manager' 
            },
            {
              rowValue:'',
              colCode: 'client' 
            },
            {
              rowValue:'',
              colCode: 'company_name' 
            },
            {
              rowValue:'',
              colCode: 'drivers_name' 
            },
            {
              rowValue:'03232323232',
              colCode: 'phone_number' 
            },
            {
              rowValue:'',
              colCode: 'cust_no' 
            },
            {
              rowValue: 3000,
              colCode: 'vehicle_gross' 
            }
          ]
        },
        {
          row:[
            {
              rowValue:'10-Jun-20',
              colCode: 'orderDate'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'estimated_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'actual_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'reported_date'
            },
            {
              rowValue:'New',
              colCode: 'status'
            },
            {
              rowValue:'Cash',
              colCode: 'pay'
            },
            {
              rowValue:'',
              colCode: 'sales_eng'
            },
            {
              rowValue:'',
              colCode: 'sales_person'
            },
            {
              rowValue:'Fleet',
              colCode: 'aftermarket_manager'
            },
            {
              rowValue:'LOCUM',
              colCode: 'finance_manager' 
            },
            {
              rowValue:'',
              colCode: 'client' 
            },
            {
              rowValue:'',
              colCode: 'company_name' 
            },
            {
              rowValue:'',
              colCode: 'drivers_name' 
            },
            {
              rowValue:'03232323232',
              colCode: 'phone_number' 
            },
            {
              rowValue:'',
              colCode: 'cust_no' 
            },
            {
              rowValue: 200,
              colCode: 'vehicle_gross' 
            }
          ]
        },
        {
          row:[
            {
              rowValue:'10-Jun-20',
              colCode: 'orderDate'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'estimated_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'actual_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'reported_date'
            },
            {
              rowValue:'New',
              colCode: 'status'
            },
            {
              rowValue:'Cash',
              colCode: 'pay'
            },
            {
              rowValue:'',
              colCode: 'sales_eng'
            },
            {
              rowValue:'',
              colCode: 'sales_person'
            },
            {
              rowValue:'Fleet',
              colCode: 'aftermarket_manager'
            },
            {
              rowValue:'LOCUM',
              colCode: 'finance_manager' 
            },
            {
              rowValue:'',
              colCode: 'client' 
            },
            {
              rowValue:'',
              colCode: 'company_name' 
            },
            {
              rowValue:'',
              colCode: 'drivers_name' 
            },
            {
              rowValue:'03232323232',
              colCode: 'phone_number' 
            },
            {
              rowValue:'',
              colCode: 'cust_no' 
            },
            {
              rowValue: 200,
              colCode: 'vehicle_gross' 
            }
          ]
        },
        {
          row:[
            {
              rowValue:'10-Jun-20',
              colCode: 'orderDate'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'estimated_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'actual_delivery'
            },
            {
              rowValue:'10-Jun-20',
              colCode: 'reported_date'
            },
            {
              rowValue:'New',
              colCode: 'status'
            },
            {
              rowValue:'Cash',
              colCode: 'pay'
            },
            {
              rowValue:'',
              colCode: 'sales_eng'
            },
            {
              rowValue:'',
              colCode: 'sales_person'
            },
            {
              rowValue:'Fleet',
              colCode: 'aftermarket_manager'
            },
            {
              rowValue:'LOCUM',
              colCode: 'finance_manager' 
            },
            {
              rowValue:'',
              colCode: 'client' 
            },
            {
              rowValue:'',
              colCode: 'company_name' 
            },
            {
              rowValue:'',
              colCode: 'drivers_name' 
            },
            {
              rowValue:'03232323232',
              colCode: 'phone_number' 
            },
            {
              rowValue:'',
              colCode: 'cust_no' 
            },
            {
              rowValue: 5000,
              colCode: 'vehicle_gross' 
            }
          ]
        },
      ]
    }
  ]

  rowResponse = [];

  url = "../../../assets/selectize/dist/js/standalone/selectize.js";
  loadAPI:any;

  ngOnInit() {

    // this.loadAPI = new Promise(resolve => {
    //   console.log("resolving promise...");
    //   this.loadScript();
    // });
    this.rowData =this.rowResponse;

    this.calcultePreviousMonths();
    this.calculteUpcomingMonths();

    this.calcultePreviousYears();
    this.calculteUpcomingYears();

    this.yearCounter = 5;
    
    let month = moment().format('MMM');
    let year = moment().format('YYYY');
    let sliderMonth = moment().format('MMM YY');
    console.log(month);
    
    this.monthActive = month;
    this.monthSelected="1";

    this.years.map(res=>{
      if(res.year===year){
        this.yearActive= year;
        res.active= true;
      }
    });
    
    this.searchDate.map((res,index)=>{
      console.log(res.month,sliderMonth,res.month===sliderMonth)
      if(res.month===sliderMonth){
        this.sliderItem= res.month;
        this.sliderIndex=index;
      }
    })

  }

  public loadScript() {
    console.log("preparing to load...");
    let node = document.createElement("script");
    node.src = this.url;
    node.type = "text/javascript";
    node.async = true;
    node.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node);
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

    this.generateGrid();

  }

  generateGrid(){
          
    let row = {};
    let column = [];
    let salesRow = [];
    this.columnDefs = [];
    this.rowData =  [];

    column.push(
      {
        headerName: ".", 
        valueGetter: 'node.rowIndex+1',
        colId: 0,
        minWidth: 40,
        maxWidth: 40,
        cellClass: 'row-no',
        editable: false, 
        suppressMenu: true,
        pinned: 'left', 
        lockPinned: true,
        lockPosition: true, 
        suppressMovable: false,
      }
    );

    /*Columns Array*/ 
    this.response[0]['column'].map(res=>{
      let col = {};
      if(res.type==='date'){
        // col['cellEditor'] = 'datePicker';
      }else if(res.type==='dropdown'){
        // col['cellEditor'] = 'custom';
        // col['cellEditorParams'] = { 
        //   values: this.payOptions
        // }
        // col['cellRenderer'] = 'getDatePicker';
        col['cellClass'] = 'actions-button-cell';
      }
      if(res.colCode==="estimated_delivery"){
        col['onCellValueChanged'] = this.onChangeDate.bind(this);
      }else if(res.colCode === "actual_delivery"){
        col['cellClassRules'] =  {
          'pink-field-color': function(params) {
            let isAfter =moment().isAfter(params.data.estimated_delivery);
            return params.value === '' && isAfter
          }
        }
      }
      col['headerName'] = res.colName;
      col['field'] = res.colCode;
      col['suppressMovable'] = false;
      col['minWidth'] = 150;
      col['maxWidth'] = 150;
      col['type'] = res.type;
      col['colId'] = res.colId;
      // col['menuTabs']= ['filterMenuTab'],
      column.push(col);
    });
    /*--------------*/ 


    /*Saleslog Array*/ 
    this.response[0]['rowData'].map(res=>{
      res.row.map((res)=>{
        row[res.colCode]   = res.rowValue;
      });

      if(moment(row['orderDate']).isBefore(moment().format('DD-MMM-YY'),'months')){
        let time = moment().isSameOrAfter(moment(row['estimated_delivery']).format('DD-MMM-YY'),'months');
        if(time){
          this.carryOverUnits = this.carryOverUnits + 1;
          this.carryOverAmount = this.carryOverAmount + Number(row['vehicle_gross']);

          if(time){
            row['type']='carryOver';
          }
        }else{
          row['type']='sold';

          console.log(row['orderDate'], row['estimated_delivery']);
          this.soldUnits = this.soldUnits + 1;
          this.soldAmount = this.soldAmount + Number(row['vehicle_gross']);
        }
      }else{
        row['type']='sold';

        console.log(row['orderDate'], row['estimated_delivery']);
        this.soldUnits = this.soldUnits + 1;
        this.soldAmount = this.soldAmount + Number(row['vehicle_gross']);
      }


      if(moment().isSameOrBefore(moment(row['estimated_delivery']).format('DD-MMM-YY'),'months')){
        // console.log('here');
        row['type']='covered';
        this.coveredUnits = this.coveredUnits + 1;
        this.coveredAmount = this.coveredAmount + Number(row['vehicle_gross']);
      }

      if(row['actual_delivery'] !== ""){
        console.log('here');
        row['type']='delivered';
        this.deliveredUnits = this.deliveredUnits + 1;
        this.deliveredAmount = this.deliveredAmount + Number(row['vehicle_gross']);
      }

      salesRow.push({...row});
      
    });

    /*----------------*/     

    this.carryOverAvg = Number(this.carryOverAmount)/Number(this.carryOverUnits);
    this.soldAvg = Number(this.soldAmount)/Number(this.soldUnits);
    this.coveredAvg = Number(this.coveredAmount)/Number(this.coveredUnits);
    this.deliveredAvg = Number(this.deliveredAmount)/Number(this.deliveredUnits);


    this.columnDefs = column;
    this.rowData = salesRow;
    this.rows = salesRow;
    this.rowResponse = this.rowData;

    console.log("this.columnDefs:",this.columnDefs);
    console.log("this.rowData:",this.rowData);


    // $(function() {
    //   console.log($('.dropdown'));
    //   $('.dropdown').selectstyle({
    //     width  : 250,
    //     height : 300,
    //   });
    // })

  }


  methodFromParent(cell) {
    alert('Parent Component Method from ' + cell + '!');
  }
  
  getClassRules(params,color) { 
    let thisRef = params.context.thisComponent;
    let currentRow = thisRef.rowColor.find(el=> el.rowId=== params.rowIndex && el.colId === params.column.userProvidedColDef.colId);

    return (currentRow !== undefined)?currentRow.color === color: "";
  }

  getCssRules(params) {
    if(params.colDef){
      switch(params.colDef.field){
        case 'status':
            // this.emptyFieldsCount = this.emptyFieldsCount + 1;
            return params.value === undefined;
          break;
        default:
          break;
      }
    }
  }

  getStatusColor(params) {
    console.log(params);
    if(params.value){
      switch(params.value){
        case 'status':
            return true;
          break;
        case 'status':
          return true;
        break;
        case 'status':
          return true;
          break;
        default:
          break;
      }
    }
  }

  cellStyling(params) {
    console.group('Group');
    console.log(params['column']['userProvidedColDef']);
    console.groupEnd();
    // if(params.node.level === 0) {
    //   return { 
    //     'backgroundColor': '#1976D2', 
    //     'color':'#fff',fontWeight:'bold',
    //     'cursor':'pointer',
    //     'height':'30px'
    //   }
    // }
    return { 'border-right': '1px solid #ececec',backgroundColor: '#fff','justify-content': 'flex-start','overflow':'hidden','white-space': 'nowrap','min-width': '0',' text-overflow': 'ellipsis'};

  }

  search(){
    console.log(this.searchForm.value);
    let searchVal = this.searchForm.get('searchbar').value.toLowerCase();
    let previousMonthFilter = this.searchForm.get('previousMonth').value;
    let currentMonthFilter = this.searchForm.get('currentMonth').value;
    let row = [];
    let currentMonth= moment();

    let searchResult = [];

    if(this.searchForm.get('searchbar').value !=="" && currentMonthFilter !==false){
      searchResult = this.rowData.filter(resp=>{
        return moment(resp.orderDate).isSame(moment()) && 
        resp.pay.toLowerCase() === searchVal.toLowerCase();    

      });

    }else if(this.searchForm.get('searchbar').value !=="" && previousMonthFilter !==false){
      let searchedDate =  moment().subtract(Number(previousMonthFilter)+1, 'months').format('MMM-YYYY');
      searchResult = this.rowData.filter(resp=>{
        let datafilter;
        let datefilter;

        let endDate =  moment().format('MMM-YYYY');

        if(previousMonthFilter !== "all"){
          return moment(resp.orderDate).isAfter(searchedDate) && 
          moment(resp.orderDate).isBefore(endDate) && 
          resp.pay.toLowerCase() === searchVal.toLowerCase();        
        }else{
          return resp.pay.toLowerCase() === searchVal.toLowerCase();  
        }
        // datefilter = Object.keys(resp).filter(res=> {
        //   // if(res !=="" && isNaN(Number(resp[res]))){
        //   //   console.log(resp[res], Number(resp[res]))
        //   //   return resp[res].toLowerCase()=== searchVal;
        //   // }
        // });
        // if(datefilter.length> 0){         
        //   return resp;
        // }

      });

    }else{
      searchResult = this.rowData.filter(resp=>{
        let filter = Object.keys(resp).filter(res=> resp[res].toLowerCase()=== searchVal);
        if(filter.length> 0){         
          return resp;
        }
      });
    }

    /*Dispaly search results in grid row array and number of display records found*/ 
    this.rowData = [];
    this.rowData = searchResult;
      this.toastHandlerService.generateToast(searchResult.length+' Record found','',2000);

    /*-------------------------*/
     
  }


  ngOnDestroy(): void {
    this.snackBar.dismiss();
  }
  filterGrid(option){

    // If filter matches change active state of columns*/ 
      if(option === 0){

        let row = this.rows.filter(res=> res.type ==="carryOver");
        console.log(this.rows)
        if(row.length >0){
          this.rowData = row;  
          this.toastHandlerService.generateToast("1 filter applied",'Clear',null);
        }
      }else if(option === 1){
        let row = this.rows.filter(res=> res.type ==="sold");

        if(row.length >0){
          this.toastHandlerService.generateToast("1 filter applied",'Clear',null);

          this.rowData = row;  
        }
      }else if(option === 2){
        let row = this.rows.filter(res=> res.type ==="covered");

        if(row.length >0){
          this.rowData = row;  
          this.toastHandlerService.generateToast("1 filter applied",'Clear',null);
        }
      }else if(option === 3){
        let row = this.rows.filter(res=> res.type ==="delivered");

        if(row.length >0){
          this.rowData = row;  
          this.toastHandlerService.generateToast("1 filter applied",'Clear',null);
        }
      }

  }

  calenderSearch(searchingFormat,month,startingMonth){
    console.log(searchingFormat, startingMonth);
    let searchResult=  [];

    searchResult = this.rowData.filter(resp=>{
      let filter = Object.keys(resp).filter(res=>{
        if(res==="orderDate"){
          let date =resp[res];
          if(month===1){
            if(date){
              console.log(moment(resp[res]).isSame(searchingFormat, "months"));
              return moment(resp[res]).isSame(searchingFormat, "months") && moment(resp[res]).isSame(searchingFormat, "years");
            }
          }else{
            console.log("after:",  moment(resp[res]).isAfter(searchingFormat),resp[res]);
            console.log("before:", moment(resp[res]).isBefore(startingMonth),resp[res]);

            return moment(resp[res]).isAfter(searchingFormat) && moment(resp[res]).isBefore(startingMonth);
          }
          console.log(date,searchingFormat,moment(resp[res]).isAfter(searchingFormat));
        }
      });
      if(filter.length> 0){ 
                
        return resp;
      }
    });
    this.rowData = [];
    this.rowData = searchResult;
    if(searchResult.length> 0){
      let text= (searchResult.length>1)? "Records":"Record";
      this.toastHandlerService.generateToast(searchResult.length+" "+text+' found','',2000);
    }
  }


  monthSliderSearch(searchingFormat){
    console.log(searchingFormat);
    let searchResult=  [];
    
    this.monthFilter = searchingFormat+" - "+searchingFormat;


    searchResult = this.rowData.filter(resp=>{
      let filter = Object.keys(resp).filter(res=>{
        if(res==="orderDate"){
          let date =moment(resp[res]).format('MMM YY');
            if(date){
              console.log(date,searchingFormat);
              console.log(date===searchingFormat);
              return date===searchingFormat;
            }

          console.log(date,searchingFormat,moment(resp[res]).isAfter(searchingFormat));
        }
      });
      if(filter.length> 0){ 
                
        return resp;
      }
    });
    this.rowData = [];
    this.rowData = searchResult;
    if(searchResult.length> 0){
      let text= (searchResult.length>1)? "Records":"Record";
      this.toastHandlerService.generateToast(searchResult.length+" "+text+' found','',2000);
    }
  }

  previous(){
    if(this.yearCounter!==0){
      
      this.yearCounter = this.yearCounter- 1;
      let month = moment().format('MMM');
      let year = moment().format('YYYY');
      this.monthActive = "";
      this.years.map((res,index)=>{
          res.active= false;
      });

      this.years.map((res,index)=>{
        if(index===this.yearCounter){
          this.yearActive = res.year;
          if(res.year===year){          
            this.monthActive = month;
          }
          res.active= true;
        }
      });
    }
  }


  next(){
    if(this.yearCounter<this.years.length-1){


      console.log(this.yearCounter<this.years.length)
      console.log(this.yearCounter,this.years.length)
      this.yearCounter = this.yearCounter+ 1;
      let month = moment().format('MMM');
      let year = moment().format('YYYY');
      this.monthActive = "";

      this.years.map((res,index)=>{
          res.active= false;
      })
  
      this.years.map((res,index)=>{
        if(index===this.yearCounter){
          this.yearActive = res.year;
          if(res.year===year){          
            this.monthActive = month;
          }
          res.active= true;
        }
      })
    }
  }
  
  selectMonth(month){
    this.monthActive=  month;
  }

  currentMonth(){
    if(this.searchForm.get('previousMonth').value!==""){
      this.searchForm.get('previousMonth').setValue("");
    }  
  }

  previousMonth(event){
    if(this.searchForm.get('currentMonth').value===true){
      this.searchForm.get('currentMonth').setValue(false);
    }  
  }

  resetSearch(){
    this.monthFilter="";
    this.rowData = this.rowResponse;

  }

  applyCalenderFilter(){
    console.log(this.monthSelected);
    this.monthModal= false;
    this.generateFilter(this.monthSelected);
  }


  generateFilter(length){    
    
    /*Generate Key and value for startFrom Object from momentJs*/
    let currentDisplayFormat; 
    let searchedDisplayFormat;
    let searchingFormat;
    let currentSearchFormat;
    let month=0;

    if(length !=="1"){
      month=0;
      searchingFormat =  moment(this.monthActive+"-"+this.yearActive).subtract(length-1, 'months').format('MMM-YYYY');
      currentDisplayFormat = moment(this.monthActive+"-"+this.yearActive).format('MMM YY');
      currentSearchFormat = moment(this.monthActive+"-"+this.yearActive).format('MMM-YYYY');
      searchedDisplayFormat = moment(this.monthActive+"-"+this.yearActive).subtract(length-1, 'months').format('MMM YY');

    }else{

      month = 1;
      searchingFormat =  moment(this.monthActive+"-"+this.yearActive).subtract(length-1, 'months').format('MMM-YYYY');
      currentDisplayFormat = moment(this.monthActive+"-"+this.yearActive).format('MMM YY');
      searchedDisplayFormat = moment(this.monthActive+"-"+this.yearActive).subtract(length-1, 'months').format('MMM YY');
    }
    /*---------------------------------------------------------*/ 
    console.log('searched value:',searchedDisplayFormat);
    this.monthFilter = searchedDisplayFormat+" - "+currentDisplayFormat;
    console.log(this.monthFilter);

    this.calenderSearch(searchingFormat, month, currentSearchFormat)
  }

  cancelMonthModal(){
    this.monthModal= false;
  }

  formatNumber(params) {
    if(params.colDef.type === 'number'){

        return "$"+Math.floor(params.value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
  }

  cellEditorSelector(params) {
    console.log(params.colDef.type);
    
    if (params.colDef.type === 'number') {
      // return {
      //   component: 'numericCellEditor'
      // };
      return false;
    }
    else if(params.colDef.type === 'date'){
      return {
        component: 'datePicker'
      };
    }
    else if(params.colDef.type === 'text'){
      return {
        component: 'agSelectCellEditor',

      };
    }else if(params.colDef.type === 'drop down'){
      switch(params.colDef.field){
        case "status":
          return {
            component: 'agSelectCellEditor',
            params: {
                values: this.statusOption
            }
          };
          break;
        case "pay":
          return {
            component: 'agSelectCellEditor',
            params: {
                values: this.payOptions
            }
          };
          break;
          case "sales_eng":
            return {
              component: 'agSelectCellEditor',
              params: {
                  values: this.salesEngOption
              }
            };
            break;
          case "sales_person":
            return {
              component: 'agSelectCellEditor',
              params: {
                  values: this.salesPersonOption
              }
            };
            break;
          case "aftermarket_manager":
            return {
              component: 'agSelectCellEditor',
              params: {
                  values: this.afterMarketManagerOptions
              }
            };
            break;
          case "finance_manager":
            return {
              component: 'agSelectCellEditor',
              params: {
                  values: this.financeManagerOption
              }
            };
            break;
          // case "client":
          //   return {
          //     component: 'agSelectCellEditor',
          //     params: {
          //         values: this.rolesOptions
          //     }
          //   };
          //   break;
        default:
          break;
      }
    }
    return false;
  }

  toggleShowDiv(divName: string) {
    if (divName === 'divA') {
      if(this.animationState==="in"){
        this.rowData = this.rowResponse;
      }
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
    }
  }

  getMainMenuItems(params) {

    let column = params.column.colDef;
    let thisRef = params.context.thisComponent;

    var menuItems = [];
    menuItems.push({
      name: 'Pin Column',
      disabled: true,
      icon: createFlagImg('pin'),
      cssClasses: ['header-option-heading'],
    });
    menuItems.push("separator");
    menuItems.push({
      name: 'Pin Left',
      action: function() {
        thisRef.gridColumnApi.setColumnPinned(column.colId, "left");
      },
      icon: createFlagImg('arrow-right'),
      cssClasses: [''],

    });
    menuItems.push("separator");
    menuItems.push({
      name: 'No Pin',
      action: function() {
        thisRef.gridColumnApi.setColumnPinned(column.colId, null);
      },
      icon: createFlagImg('arrow-right'),
      cssClasses: [''],
    });
    menuItems.push("separator");
    menuItems.push({
      name: 'Sort Data',
      disabled: true,
      icon: createFlagImg('sort'),
      cssClasses: ['header-option-heading'],
    });
    menuItems.push("separator");
    menuItems.push({    
      name: 'Oldest to Newest',
      action: function() {
        var sort = [
          {
            colId: column.colId,
            sort: 'aesc',
          },
        ];
        thisRef.gridApi.setSortModel(sort);      
      },
      icon: createFlagImg('arrow-right'),
    });
    menuItems.push("separator");
    menuItems.push({
      name: 'Newest to Oldest',
      action: function() {
        var sort = [
          {
            colId: column.colId,
            sort: 'desc',
          },
        ];
        thisRef.gridApi.setSortModel(sort);
      },
      icon: createFlagImg('arrow-right'),
    });
    menuItems.push("separator");
    menuItems.push({
      name: 'Default settings',
      action: function() {
    },
    icon: createFlagImg('arrow-right'),
    });
    return menuItems;
  }


  calcultePreviousMonths(){
    for(let i = 4; i>0; i--){
    
      /*Generate Key and value for startFrom Object from momentJs*/ 
      let month = moment().subtract(i, 'months').format('MMM YY');
      /*---------------------------------------------------------*/ 

      this.searchDate.push({
        'month': month
      });
    }
  }

  openCalenderPopup(){
    this.monthModal= !this.monthModal;
  }

  calculteUpcomingMonths(){
    for(let i=0; i<=4; i++){
    
      /*Generate Key and value for startFrom Object from momentJs*/ 
      let month = moment().add(i, 'months').format('MMM YY');

      this.searchDate.push({
        'month': month
      });
    }

  }


  calcultePreviousYears(){
    for(let i = 5; i>0; i--){
    
      /*Generate Key and value for startFrom Object from momentJs*/ 
      let year = moment().subtract(i, 'years').format('YYYY');
      /*---------------------------------------------------------*/ 

      this.years.push({
        'year': year,
        'active': false
      });
    }
  }

  calculteUpcomingYears(){
    for(let i=0; i<=2; i++){
    
      /*Generate Key and value for startFrom Object from momentJs*/ 
      let year = moment().add(i, 'years').format('YYYY');

      this.years.push({
        'year': year,
        'active': false
      });
    }
    console.log(this.years);

  }


  onChangeDate(){
    this.gridApi.redrawRows();
  }

  getContextMenuItems(params) {

    let thisRef = params.context.thisComponent;
    var result = [
      {
        name: 'CELL OPTIONS',
        disabled: true,
        cssClasses: ['cell-option-heading'],
      },
      'separator',
      'copy',
      'separator',
      'paste',
      'separator',
      {
        name: 'History',
        subMenu: [
          {
            name: 'Only this cell',
            action: function() {
              thisRef.openModal(thisRef,HistoryComponent,'1000px',{option:2});
            },
            icon: createFlagImg('bookmark'),
          },
          {
            name: 'Show All',
            action: function() {
              thisRef.openModal(thisRef,HistoryComponent,'1000px',{option:1});
            },
            icon: createFlagImg('bookmark'),
          },
        ],
        icon: createFlagImg('bookmark'),
      },
      'separator',
      {
        name: 'DEAL OPTIONS',
        disabled: true,
        cssClasses: ['deal-heading'],
      },
      'separator',
      {
        name: 'DUPLICATE -entire record',
        action: function() {                
          var newItems = [params.node.data];
          thisRef.gridApi.applyTransaction({ add: newItems });
        },
        icon: createFlagImg('plus'),
      },
      'separator',
      {
        name: 'DELETE -entire record',
        action: thisRef.onRemoveSelected.bind(thisRef),
        icon: createFlagImg('close'),
      },
      {
        name: 'COLOR TAB CELLS',
        disabled: true,
        cssClasses: ['color-tab-heading'],
        icon:"",
      },
      'separator',
      {
        name: 'BLUE',
        action: function() {
          thisRef.rowColor.map(el=> {
            if(el.rowId=== params.node.rowIndex){
              el.color ="blue";
              el.colId = params.column.userProvidedColDef.colId;
            }
          });
          let rows = [];
          rows.push(thisRef.gridApi.getDisplayedRowAtIndex(params.node.rowIndex));

          thisRef.gridApi.redrawRows();
        },
        icon: createFlagImg('blue-color'),
        cssClasses: ['pointer'],
      },
      {
        name: 'GREEN',
        action: function() {
          thisRef.rowColor.map(el=> {
            if(el.rowId=== params.node.rowIndex){
              el.color ="green";
              el.colId = params.column.userProvidedColDef.colId;
            }
          });
          let rows = [];
          rows.push(thisRef.gridApi.getDisplayedRowAtIndex(params.node.rowIndex));
          thisRef.gridApi.redrawRows();
        },
        icon: createFlagImg('green-color'),
        cssClasses: ['pointer'],
      },
      {
        name: 'YELLOW',
        action: function() {
          thisRef.rowColor.map(el=> {
            if(el.rowId=== params.node.rowIndex){
                el.color ="yellow";
                el.colId = params.column.userProvidedColDef.colId;
            }
          });
          let rows = [];
          rows.push(thisRef.gridApi.getDisplayedRowAtIndex(params.node.rowIndex));
          thisRef.gridApi.redrawRows();
        },
        icon: createFlagImg('yellow-color'),
        cssClasses: ['pointer'],
      },
      {
        name: 'RED',
        action: function() {
          thisRef.rowColor.map(el=> {
            if(el.rowId=== params.node.rowIndex){
                el.color ="red";
                el.colId = params.column.userProvidedColDef.colId;
            }
          });
          let rows = [];
          rows.push(thisRef.gridApi.getDisplayedRowAtIndex(params.node.rowIndex));
          thisRef.gridApi.redrawRows();
        },
        icon: createFlagImg('red-color'),
        cssClasses: ['pointer'],
      },
      {
        name: 'PURPLE',
        action: function() {
          thisRef.rowColor.map(el=> {
            if(el.rowId=== params.node.rowIndex){
                el.color ="purple";
                el.colId = params.column.userProvidedColDef.colId;

            }
          });
          let rows = [];
          rows.push(thisRef.gridApi.getDisplayedRowAtIndex(params.node.rowIndex));
          thisRef.gridApi.redrawRows();
        },
        icon: createFlagImg('purple-color'),
        cssClasses: ['pointer'],
      },
      {
        name: 'Remove Tag',
        action: function() {
          thisRef.rowColor.map(el=> {
            if(el.rowId=== params.node.rowIndex){
                el.color ="";
                el.colId = params.column.userProvidedColDef.colId;
            }
          });
          let rows = [];
          rows.push(thisRef.gridApi.getDisplayedRowAtIndex(params.node.rowIndex));
          thisRef.gridApi.redrawRows();
        },
        icon: createFlagImg('close'),
        cssClasses: ['pointer'],
      },
    ];
    return result;
  }

  deleteRow(){
    // console.log('pressed',params.node.rowIndex,params,this.rowResponse);
    // this.rowResponse.filter(el=> el.rowID !==params.node.rowIndex)
  }

  openModal(thisRef,component,width,key?:any){
    thisRef.dialogRef = thisRef.dialog.open(component,{
      panelClass: 'custom-dialog-container',
      'width': width,
      data: {
        "key": key
      }
    });
    thisRef.dialogRef.afterClosed().subscribe(res=>{
      if(res && res.column){
        console.log(res.column);
        
        
        if(res.column.length > 0){
          res.column.map(res=>{
            let column = this.columnDefs.find(el=> el.headerName === res.columnName);
            if(column !== undefined){
              console.log(column.colId);
              this.gridColumnApi.setColumnVisible(column.colId, res.display);
            }
          });
        }
        setTimeout(() => {
          this.gridApi.refreshView();
          this.gridApi.sizeColumnsToFit();
        }, 0)
    
      };

    });
  }

  duplicateRow() {

    var newItems = [];
    var res = this.gridApi.applyTransaction({ add: newItems });

  }

  selctedMonth(index){
    this.searchDate.map((res,i)=>{
      if(i===index){
        this.sliderItem= res.month;
        this.sliderIndex=index;
      }
    });
    this.monthSliderSearch(this.sliderItem)
  }

  onRemoveSelected() {
    var selectedData = this.gridApi.getSelectedRows();
    var res = this.gridApi.applyTransaction({ remove: selectedData });
    console.log(res);
    if(res.remove.length> 0){
      let index = res.remove[0];
      // this.rowColor.find(el=> el.rowId=== index.rowIndex && el.colId === index.colDef.colId);
    }
  }

  getRowData() {
    var rowData = [];
    this.gridApi.forEachNode(function(node) {
      rowData.push(node.data);
    });
    console.log('Row Data:');
    console.log(rowData);
  }

  addColumn(){
    this.dialogRef = this.dialog.open(NewDealComponent,{
      panelClass: 'custom-dialog-container',
      'width': '400px'
    });
    this.dialogRef.afterClosed().subscribe(res=>{
      console.log(res);
      if(res){
        this.gridApi.applyTransaction({ add: 
          [
            {     
              orderDate: moment(res.date).format('DD-MMM-YY'),
              estimated_delivery: "",
              actual_delivery: "",
              reported_date: "",
              status: "",
              pay: "",
              sales_eng: "",
              sales_person: "",
              aftermarket_manager: "",
              finance_manager: "",
              client: "",
              company_name: "",
              drivers_name: "",
              phone_number: "",
              cust_no: "",
            }
          ] 
        });
      }
    });
  }

  excelExport(){
    this.openModal(this,ExcelExportComponent,'400px')
  }

  columnOption(){
    this.openModal(this, ColumnOptionComponent,'900px',this.gridColumnApi);
  }

  print(){
    this.printdata=1;
  }
  
}

function getDatePicker() {
  function Datepicker() {}
  Datepicker.prototype.init = function(params) {

    this.div = document.getElementsByClassName('AG_Popup');
    $(function() {

      let data = ['cancelled','pending','empty','tba'];
      let inputField = $('.AG_InputAutoCompleteEstimated');
      let dropDown = $('.ag-dropdown-style');
      let cancel = $('#cancelled');
      let pending = $('#pending');
      let tba = $('#tba');
      let empty = $('#empty');

      console.log(inputField, cancel)
      
      
      inputField.keyup(function(){
        let value = ($(this).val());
        let search =	data.find(el=> el=== value);
        if(search !== undefined){
          let element = "#"+search;
          $('tr').removeClass('selected');
          $(element).addClass('selected');
        }else{
          $('tr').removeClass('selected');
        }
      });
      
      
      inputField.on("click", function(){
        dropDown.css("display","block");
      });
      
      empty.on("click", function(){
        let value = ($(this).text().trim());
        change(this,value);
      });
      
      cancel.on("click", function(){
        let value = ($(this).text().trim());
        change(this,value);
      });
      
      pending.on("click", function(){
        let value = ($(this).text().trim());
        change(this,value);
      });
      
      tba.click(function(){
        let value = ($(this).text().trim());
        change(this, value);
      });
        
        
      function change(thisRef,value){
        $('tr').removeClass('selected');
        $(thisRef).addClass('selected');
        inputField.val(value);
        dropDown.css("display","none");
      }
      
      let format = 'd-M-y';
      let timepicker = false;
  
      if(params && params.colDef.field==="estimated_delivery"){
        format= 'd-M-y h:m A';
        timepicker = true;
      }
      
      inputField.datetimepicker({
        timepicker:timepicker,
        format:format,
      });

      
    });



    /*--------------------------------------*/ 

    // this.eInput = document.createElement('input');
    // this.eInput.value = params.value;
    // this.eInput.classList.add('ag-input');
    // this.eInput.style.height = '100%';
    // this.eInput.style.width = '100%';

    // let format = 'd-M-y';
    // let timepicker = false;

    // if(params && params.colDef.field==="estimated_delivery"){
    //   format= 'd-M-y h:m A';
    //   timepicker = true;
    // }
    
    // $(this.eInput).datetimepicker({
    //   timepicker:timepicker,
    //   format:format,
    // });
    

  };
  Datepicker.prototype.getGui = function() {
    return this.div;
  };
  Datepicker.prototype.afterGuiAttached = function() {
    this.div.focus();
    // this.div.select();
  };
  Datepicker.prototype.getValue = function() {
    return this.div.value;
  };
  Datepicker.prototype.destroy = function() {};
  Datepicker.prototype.isPopup = function() {
    return false;
  };
  return Datepicker;
}


function getDropDown() {
  function DropDown() {}
  DropDown.prototype.init = function(params) {
    this.select = document.createElement('select');
    // this.select.value = params.value;
    this.select.classList.add('email-select');
    this.select.style.height = '100%';
    this.select.style.width = '100%';
    $(this.select).selectize({
      valueField: 'name',
      labelField: 'name',
      placeholder: 'Select'
  ,    options: [
        {
            description: 'Nice Guy',
            name: 'Brian Reavis',
            imageUrl: 'http://www.fashionspictures.com/wp-content/uploads/2013/11/short-hairstyles-for-a-square-face-42-150x150.jpg'
        }, 
        {
            description: 'Other nice guy',
            name: 'Nikola Tesla',
            imageUrl: 'http://www.fashionspictures.com/wp-content/uploads/2013/11/short-hairstyles-for-a-square-face-42-150x150.jpg'
        }
      ]
  });
    // let option = document.createElement('option');
    // option.value = "One";
    // this.select.append= option;

    

  };
  DropDown.prototype.getGui = function() {
    return this.select;
  };
  DropDown.prototype.afterGuiAttached = function() {
    this.select.focus();
  };
  DropDown.prototype.getValue = function() {
    return this.select.value;
  };
  DropDown.prototype.destroy = function() {};
  DropDown.prototype.isPopup = function() {
    return false;
  };
  return DropDown;
}


function getCustomDropDown() {
  function DropDown() {}
  DropDown.prototype.init = function(params) {
    this.select = document.createElement('select');
    // this.select.value = params.value;
    this.select.classList.add('email-select');
    this.select.style.height = '100%';
    this.select.style.width = '100%';
    $(this.select).attr('theme','google');
    $(this.select).attr('data-search',true);

    // $(this.select).selectize({);
 
    for(var i = 0; i < params.values.length; i++) {
      var option = params.values[i];
      $('<option />', { value: option, text: option }).appendTo(this.select);
    }

    $(this.select).selectstyle({
      width  : 250,
      height : 300,
    });
  };
  DropDown.prototype.getGui = function() {
    return this.select;
  };
  DropDown.prototype.afterGuiAttached = function() {
    this.select.focus();
  };
  DropDown.prototype.getValue = function() {
    return this.select.value;
  };
  DropDown.prototype.destroy = function() {};
  DropDown.prototype.isPopup = function() {
    return false;
  };
  return DropDown;
}


function getRenderer() {

  function CellRenderer() {}
  CellRenderer.prototype.createGui = function() {
    var template =
      '<span style="flex-direction: row-reverse;width: 100%;display: flex;justify-content: space-between;"><img id="theButton" src="./assets/icons/down-arrow.png"><span id="theValue"></span></span>';
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = template;

    this.eGui = tempDiv.firstElementChild;
  };
  CellRenderer.prototype.init = function(params) {
    this.createGui();
    this.params = params;
    var eValue = this.eGui.querySelector('#theValue');
    eValue.innerHTML = params.value;
    this.eButton = this.eGui.querySelector('#theButton');
    this.buttonClickListener = this.onButtonClicked.bind(this);
    this.eButton.addEventListener('click', this.buttonClickListener);
  };
  CellRenderer.prototype.onButtonClicked = function() {
    var startEditingParams = {
      rowIndex: this.params.rowIndex,
      colKey: this.params.column.getId(),
    };
    this.params.api.startEditingCell(startEditingParams);
  };
  CellRenderer.prototype.getGui = function() {
    return this.eGui;
  };
  CellRenderer.prototype.destroy = function() {
    this.eButton.removeEventListener('click', this.buttonClickListener);
  };
  CellRenderer.prototype.isPopup = function() {
    return true;
  };
  return CellRenderer;
}

function getRendererDropDown(){
  function CellRenderer() {}
  CellRenderer.prototype.init = function(params) {
    

  };
  CellRenderer.prototype.getGui = function() {
    return this.eInput;
  };
  CellRenderer.prototype.afterGuiAttached = function() {
    this.eInput.focus();
    this.eInput.select();
  };
  CellRenderer.prototype.getValue = function() {
    return this.eInput.value;
  };
  CellRenderer.prototype.destroy = function() {};
  CellRenderer.prototype.isPopup = function() {
    return false;
  };
  return CellRenderer;
}

function createFlagImg(flag) {
  return (
    '<img border="0" width="15px" height="10" src="./assets/icons/'+flag+'.png"/>'
  );
}