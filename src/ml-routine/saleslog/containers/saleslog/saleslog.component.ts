import { CustomLoadingOverlayComponent } from '../../components/custom-loading-overlay/custom-loading-overlay.component';

import { CustomFilterMenuComponent } from './../../../shared/components/custom-filter-menu/custom-filter-menu.component';
import { CustomDropdownComponent } from './../../../shared/components/custom-dropdown/custom-dropdown.component';
import { filter } from 'rxjs/operators';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ClipboardModule } from '@ag-grid-enterprise/clipboard';
import { AllCommunityModules, ColumnResizedEvent } from '@ag-grid-community/all-modules';
import { Component, OnInit, ChangeDetectionStrategy, Inject, OnChanges, Input } from '@angular/core';
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
import  *  as  data  from  'app/RoutineSheetJSON.json';
import { AuthService } from 'ml-auth/shared/services/ml-auth/ml-auth.service';
import { CalenderRenderer } from './calander-renderer.component';
import { SingleSelectionExampleComponent } from 'ml-routine/saleslog/components/custom-dropdown/custom-dropdown.component';
// import * as Selectize from '../../../../../node_modules/selectize/dist/js/standalone/selectize.js';

declare var $:any;
// declare var Selectize:any;
import { GlobalConstants } from 'ml-shared/common/global-constants';
import { CustomDropDownRenderer } from './custom-dropdown-renderer.component';
import { DropDownRenderer } from './dropdown-renderer.component';
import { SaleslogService } from 'ml-routine/shared/services/saleslog/saleslog.service';
import { SessionHandlerService } from 'app/shared/services/session-handler.service';
import { SharedService } from 'ml-setup/shared/services/shared/shared.service';
import { SignalRService } from 'ml-setup/shared/services/signal-r/signal-r.service';
// import  *  as  salesLogData  from  '../../RoutineSheetJSON.json';



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

  @Input() 
  public routineSelected: number = 1; 
  
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
  monthObject: any = {
    oneMonth: false,
    threeMonth: false,
    sixMonth: false,
    twelveMonth: false,
    allMonth: false,
    reset: function (){
      this.oneMonth = false;
      this.threeMonth = false;
      this.sixMonth = false;
      this.twelveMonth = false;
    }
  };

  private cellData: any = [];
  private cellMap : any;
  private salesData : any;

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
  records: any = [];
  private toggleColumns: boolean = true;
  decryptedDepartmentId: string;
  private loadingOverlayComponent;
  private loadingOverlayComponentParams;
  private pageCounter: number = 0;

  searchForm: FormGroup = this.fb.group({
    searchbar: ["",],
    currentMonth: [true],      
    previousMonth: [""],
    deletedRecords: [null],
  });

  constructor(
    private http: HttpClient, 
    private toastHandlerService: ToastHandlerService,
    public dialog: MatDialog,
    private fb: FormBuilder, 
    public sharedService: SharedService,
    private sessionHandlerService: SessionHandlerService,
    private router: Router, 
    public snackBar: MatSnackBar,
    private route: ActivatedRoute, 
    private encryptionService: EncryptionService,
    private authService: AuthService,
    private saleslog: SaleslogService,
    private signalRService: SignalRService,
    // private siteTargetSerivce: SiteTargetsService
  ) {
    this.route.paramMap.subscribe(params => {
      this.decryptedDepartmentId = this.encryptionService.convertToEncOrDecFormat('decrypt', params.get("id"));
      console.log(this.decryptedDepartmentId)
      if(this.pageCounter !==0){
        this.generateGrid();
      }
    });


         
    /**let model = Object();
     model["login"]="emadkhanqai@gmail.com";
    model["password"]="crystal123";
    model["userid"]=this.authService.user.userId;
    model["viewid"]=3;
    model["roleid"]=8
    model["deptid"]= this.decryptedDepartmentId;
    model["tilldate"]="Jun_20";
    model["pastmonths"]=1;
    let gridData:any;    
    this.http
    .post(GlobalConstants.apiURL + `viewsdata/getlivesheetdataforviews`, model)
    .subscribe(data => {
      this.salesData = data;
      //this.loadAPIData(data);
      console.log(  this.salesData);
      }); **/

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
          // console.log(params)
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
        if(
            params.colDef.field === "SE" &&
            params.colDef.field === "AFM" &&
            params.colDef.field === "FM"
        ){
          let choice = false;
          let date = moment().format('DD-MMM-YY');
          let isAfter =moment(params.data.orderDate).isSame(date);
          if(isAfter){
            choice = false;
          }else{
            let isBefore =moment(params.data.orderDate).isBefore(date);
            choice = isBefore;
          }
          // console.log("after",params.data.orderDate,isAfter,"choice:",choice);
          return params.value === '' && choice;
            
        }else if(params.colDef.field === "PT"){
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
    minWidth: 200,
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
      customdropdownRenderer: CustomDropdownComponent,
      dropdownRenderer:SingleSelectionExampleComponent,
      calenderRender: CalenderRenderer,
      dropDownRenderer : DropDownRenderer,
      customDropDownRenderer : CustomDropDownRenderer,
      customLoadingOverlay: CustomLoadingOverlayComponent,
      customFilter: CustomFilterMenuComponent,
    };

    this.rowSelection = 'single';

    this.components = { 
    // singleClickEditRenderer: getRenderer(),
    // datePicker: getDatePicker(),
    // dropdown: getDropDown(),
    // custom: getCustomDropDown()
    };

    this.loadingOverlayComponent = 'customLoadingOverlay';

    this.loadingOverlayComponentParams = {
      loadingMessage: 'One moment please...',
    };
  }



  rowResponse = [];

  url = "../../../assets/selectize/dist/js/standalone/selectize.js";
  loadAPI:any;


  loadAPIData():void {
    /** To be replaced with API url data **/

    this.salesData = (data as any).default;
   
    let gridData:any;
    //this.http.post(GlobalConstants.apiURL + `viewsdata/getlivesheetdataforviews`, model).map(this.extractData)
  }

  onColumnResized (params: any) {
    if (params.finished == true) {
      let width = params.columns[0].actualWidth;
      let colId = params.columns[0].colId;
      this.storeColumnResizeValue(width, colId);
    }
  }   

  storeColumnResizeValue(width, colId){
    let cid = colId.replace('/"/g','');
    let params = {
      "userId": this.sessionHandlerService.getSession('userObj').userId,
      "deptid": 1118, 
      "ViewID": 1, 
      "colId": cid, 
      "config": "{'width':"+width+"}" // or "{'sequence':1}"
    }

    this.saleslog.updateViewColumnOptions(params)
    .subscribe(res=>{

    })
  }

  getContextMenuItems1(params) {
    var result = [
      {
        name: 'Alert ' + params.value,
        action: function() {
          window.alert('Alerting about ' + params.value);
        },
        cssClasses: ['redFont', 'bold'],
      },
      {
        name: 'Always Disabled',
        disabled: true,
        tooltip:
          'Very long tooltip, did I mention that I am very long, well I am! Long!  Very Long!',
      },
      {
        name: 'Country',
        subMenu: [
          {
            name: 'Ireland',
            action: function() {
              console.log('Ireland was pressed');
            },
            icon: createFlagImg('ie'),
          },
          {
            name: 'UK',
            action: function() {
              console.log('UK was pressed');
            },
            icon: createFlagImg('gb'),
          },
          {
            name: 'France',
            action: function() {
              console.log('France was pressed');
            },
            icon: createFlagImg('fr'),
          },
        ],
      },
      {
        name: 'Person',
        subMenu: [
          {
            name: 'Niall',
            action: function() {
              console.log('Niall was pressed');
            },
          },
          {
            name: 'Sean',
            action: function() {
              console.log('Sean was pressed');
            },
          },
          {
            name: 'John',
            action: function() {
              console.log('John was pressed');
            },
          },
          {
            name: 'Alberto',
            action: function() {
              console.log('Alberto was pressed');
            },
          },
          {
            name: 'Tony',
            action: function() {
              console.log('Tony was pressed');
            },
          },
          {
            name: 'Andrew',
            action: function() {
              console.log('Andrew was pressed');
            },
          },
          {
            name: 'Kev',
            action: function() {
              console.log('Kev was pressed');
            },
          },
          {
            name: 'Will',
            action: function() {
              console.log('Will was pressed');
            },
          },
          {
            name: 'Armaan',
            action: function() {
              console.log('Armaan was pressed');
            },
          },
        ],
      },
      'separator',
      {
        name: 'Windows',
        shortcut: 'Alt + W',
        action: function() {
          console.log('Windows Item Selected');
        },
        icon: '<img src="../images/skills/windows.png"/>',
      },
      {
        name: 'Mac',
        shortcut: 'Alt + M',
        action: function() {
          console.log('Mac Item Selected');
        },
        icon: '<img src="../images/skills/mac.png"/>',
      },
      'separator',
      {
        name: 'Checked',
        checked: true,
        action: function() {
          console.log('Checked Selected');
        },
        icon: '<img src="../images/skills/mac.png"/>',
      },
      'copy',
      'separator',
      'chartRange',
    ];
    return result;
  }


  ngOnInit() {

    this.dateTimeCalculation();
    
  }


  dateTimeCalculation(){
      
    this.calcultePreviousMonths();
    this.calculteUpcomingMonths();

    this.calcultePreviousYears();
    this.calculteUpcomingYears();

    this.yearCounter = 5;
    
    let month = moment().format('MMM');
    let year = moment().format('YYYY');
    let sliderMonth = moment().format('MMM YY');
    
    this.monthActive = month;
    this.monthSelected="1";

    this.years.map(res=>{
      if(res.year===year){
        this.yearActive= year;
        res.active= true;
      }
    });
    
    this.searchDate.map((res,index)=>{
      if(res.month===sliderMonth){
        this.sliderItem= res.month;
        this.sliderIndex=index;
      }
    })

  }

  // /** Used To Generate row number Column with default settings */

  // generateRowColumn():void{

  //   let rowIdcolumn = new Object();
  
  //   rowIdcolumn["headerName"]= ".", 
   
  //   rowIdcolumn["colId"]= 0,
  //   rowIdcolumn["minWidth"]= 60,
  //   rowIdcolumn["maxWidth"] = 60,
  //   rowIdcolumn["cellClass"] = 'row-no',
  //   rowIdcolumn["editable"]= true, 
  
  //   rowIdcolumn["pinned"]= 'left', 
  //   rowIdcolumn["lockPinned"]= true,
   
  //   rowIdcolumn["filter"] = true,
  //   rowIdcolumn["lockPosition"]= true, 
   
  //   rowIdcolumn["cellClass"] = function(params) {
  //       // console.log(params);
  //     let i =1;
  //     return (params.data.carryOver===true?'agClassCarryOver':'agClassNoCarryOver');
        
  //   }
  //   let carryOverCount=this.carryOverUnits;
  //   rowIdcolumn["valueGetter"] = function(params) {
  //     // console.log(carryOverCount);
  //     if (params.data.carryOver===true){
  //       return null;
  //     }else {
  //       //i++;
  //       return (params.node.rowIndex+1)-carryOverCount;
  //     }
  //   }
       
  //   this.columnDefs.push(rowIdcolumn);

  // }
  

  // /** This is used to generate grid column header */

  // generateColumnHeader():void{
  //   this.columnDefs = [];
  //   this.salesData.column.forEach(element => {
  //     //  console.log(element.colName);
  //     let columnMap = new Object();
  //     columnMap["headerName"] = element.colName;
  //     columnMap["field"] = element.colCode;
  //     columnMap["sortable"] = true;
  //     columnMap["colCode"] = element.colCode;
  //     columnMap["filter"] = true,
  //     columnMap["hide"] = !element.display;
  //     let required = element.required
  //       columnMap["cellStyle"] = function(params) {
          
  //         if (required && params.value === "") {
  //             //mark police cells as red
  //             return { backgroundColor: 'red'};
  //         } else {
  //             return  null;
  //         }
          
  //     }
            

  //     if(element.type === 'Date'){
  //       columnMap["cellRenderer"] = 'calenderRender';
  //     }
  //     if(element.type === 'DD-Fixed'){
  //       columnMap["cellRenderer"] = 'customDropDownRenderer';
  //     }
  //     if(element.type === 'DD-Self'){
  //       columnMap["cellRenderer"] = 'customDropDownRenderer';
  //     }
  //     if(element.type === 'DD-Suggest'){
  //       columnMap["cellRenderer"] = 'customDropDownRenderer';
  //     }
  //     if(element.type === 'Combo'){
  //       columnMap["cellRenderer"] = 'dropDownRenderer';
  //     }
      

      
  //     // console.log(columnMap);
  //     this.columnDefs.push(columnMap);
  //   });
  //   console.log(this.columnDefs );
  // }



  /** Used To Generate row number Column with default settings */

  generateRowColumn():void{

    let rowIdcolumn = new Object();

    rowIdcolumn["headerName"]= ".", 
  
    rowIdcolumn["colId"]= 0,
    rowIdcolumn["minWidth"]= 40,
    rowIdcolumn["maxWidth"] = 40,
    rowIdcolumn["cellClass"] = 'row-no',
    rowIdcolumn["editable"]= false, 
    rowIdcolumn["sequence"] = 0;
    rowIdcolumn["pinned"]= 'left', 
    rowIdcolumn["lockPinned"]= true,
    rowIdcolumn["filter"] = true,
    rowIdcolumn["lockPosition"]= true, 
  
    rowIdcolumn["cellClass"] = function(params) {
        // console.log(params);
      let i =1;
      return (params.data.carryOver===true?'agClassCarryOver':'agClassNoCarryOver');
        
    }
    let carryOverCount=this.carryOverUnits;
    rowIdcolumn["valueGetter"] = function(params) {
      if (params.data.carryOver===true){
          return null;
      }else {
        //i++;
        return (params.node.rowIndex+1)-carryOverCount;
      }

    }
      
    this.columnDefs.push(rowIdcolumn);

  }

  /** This is used to generate grid column header */

  generateColumnHeader():void{
    let column = [];

    let rowIdcolumn = new Object();

    rowIdcolumn["headerName"]= ".", 
  
    rowIdcolumn["colId"]= 0,
    rowIdcolumn["minWidth"]= 40,
    rowIdcolumn["maxWidth"] = 40,
    rowIdcolumn["cellClass"] = 'row-no',
    rowIdcolumn["editable"]= true, 
    rowIdcolumn["sequence"] = 0;
    rowIdcolumn["pinned"]= 'left', 
    rowIdcolumn["lockPinned"]= true,
    rowIdcolumn["filter"] = true,
    rowIdcolumn["lockPosition"]= true, 
  
    rowIdcolumn["cellClass"] = function(params) {
      // console.log(params);
      let i =1;
      return (params.data.carryOver===true?'agClassCarryOver':'agClassNoCarryOver');
        
    }
    let carryOverCount=this.carryOverUnits;
    rowIdcolumn["valueGetter"] = function(params) {
      // console.log(carryOverCount);
      if (params.data.carryOver===true){
          return null;
      }else {
        //i++;
        return (params.node.rowIndex+1)-carryOverCount;
      }

    }

    column.push(rowIdcolumn);

    this.salesData.column.forEach(element => {

      let columnMap = new Object();
      columnMap["headerName"] = element.colName;
      columnMap["field"] = element.colCode;
      columnMap["colCode"] = element.colCode;
      columnMap["sequence"] = element.sequence;
      columnMap["resizable"] = true;
      columnMap["sortable"] = true;
      columnMap["filter"] = true,
      columnMap["hide"] = !element.display;
      let required = element.required
      columnMap["cellStyle"] = function(params) {
        console.log('params:',params);
        if (required && params.value === "") {
            //mark police cells as red
            return { backgroundColor: 'red'};
        } else {
            return  null;
        }
      }
          
      

      if(element.type === 'Date'){
        columnMap["cellRenderer"] = 'calenderRender';
      }
      if(element.type === 'DD-Fixed'){
        columnMap["cellRenderer"] = 'customDropDownRenderer';
      }
      if(element.type === 'DD-Self'){
        columnMap["cellRenderer"] = 'customDropDownRenderer';
      }
      if(element.type === 'DD-Suggest'){
        columnMap["cellRenderer"] = 'customDropDownRenderer';
      }
      if(element.type === 'Combo'){
        columnMap["cellRenderer"] = 'dropDownRenderer';
      }

      column.push(columnMap);
    });
    column.sort(function(a, b){
      return a.sequence - b.sequence;
    });
    this.columnDefs= column;
    console.log(this.columnDefs );
    console.log(this.rowData );
}

  dateFormatter(params) {
        
    return moment(params.value, 'DD/MM/YYYY').format('yyyy-MM-DD'); // for datetime-local use yyyy-MM-DDThh:mm to format date from input , and use yyy-MM-DD format for date
  }

  dateTimeFormatter(params) {
    
    return moment(params.value, 'DD/MM/YYYY').format('yyyy-MM-DDThh:mm'); // for datetime-local use yyyy-MM-DDThh:mm to format date from input , and use yyy-MM-DD format for date
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
    this.pageCounter = this.pageCounter +1;

    this.generateGrid();
  }

  generateGrid(months?, date?){
    this.gridApi.showLoadingOverlay();
    let obj = {
      "UserId": this.sessionHandlerService.getSession('userObj').userId,
      "RoleId": this.sessionHandlerService.getSession('userObj').roleID,
      "ViewId": 3,
      "DeptId": this.decryptedDepartmentId,
      "TillDate": (date)? date : moment().format('MMM_YY'),
      "PastMonths": (months)? months : 1,
      "ShowDeleted": null
    }
    // this.signalRService.startConnection();
    // this.signalRService.addTransferChartDataListener(); 
    
    this.saleslog.fetchAllRows(obj)
    .subscribe(res=>{

      this.rowData = [];
      this.columnDefs = [];
      let rows=  [];
      this.salesData = (data as any).default;
      // this.salesData = res;
      this.monthObject.oneMonth = true;

      this.salesData.rowData.row.forEach((element, rowIndex) => {
        this.cellMap = new Object();
        let carryOver = element.isCarryOver;
        
        if(carryOver) {
          this.carryOverUnits++;
        }
        this.cellData =[];
        let index =0;
        element.cells.forEach((element1, index) => {
          this.rowColor.push({
              rowId: rowIndex,
              colId: element1.colId,
              color:''
            })
          if(element1.colCode === "OD"){
            this.cellMap[element1.colId] =moment(element1.currentCellValue).format('MM/DD/YYYY');

            this.cellMap['"'+element1.colCode+'"'] = moment(element1.currentCellValue).format('MM/DD/YYYY');
            // console.log(this.cellMap['"'+element1.colCode+'"'])
          }else{
            this.cellMap[''+element1.colId+''] = element1.currentCellValue;
            this.cellMap['"'+element1.colCode+'"']= element1.currentCellValue;
          }
          if(element1.cellOptions.length >0) {
            this.cellMap["cellOptions_"+element1.colCode] = element1.cellOptions;
          }
          this.cellMap["carryOver"] = carryOver;
          this.cellMap["cellColor_"+element1.colCode] = element1.cellColor;

          if(index == element.cells.length-1) {
            this.cellData.push(this.cellMap);
          }
          index++;
        });

        /** Calculate Aggregared Header */
        let columnData = this.cellData[0];
        let typeArray = [];
        // console.log(this.cellData[0]);
        // console.log(this.cellData[0]['"OD"'], this.cellData[0]['"ED"'], this.cellData[0]['"VEHGRO"'], this.cellData[0]['"AD"'], this.cellData[0]["type"]);
        if(moment(this.cellData[0]['"OD"']).isBefore(moment().format('DD-MMM-YY'),'months')){
          let time = moment().isSameOrAfter(moment(this.cellData[0]['"ED"']).format('DD-MMM-YY'),'months');
          if(time){
            this.carryOverAmount = this.carryOverAmount + Number(this.cellData[0]['"VEHGRO"']);
            typeArray.push('carryOver');
          }else{
            typeArray.push('sold');

            this.soldUnits = this.soldUnits + 1;
            this.soldAmount = this.soldAmount + Number( this.cellData[0]['"VEHGRO"']);
          }
        }else{
          typeArray.push('sold');

          this.soldUnits = this.soldUnits + 1;
          this.soldAmount = this.soldAmount + Number( this.cellData[0]['"VEHGRO"']);
        }


        if(moment().isSameOrBefore(moment( this.cellData[0]['"ED"']).format('DD-MMM-YY'),'months')){
          typeArray.push('covered');

          this.coveredUnits = this.coveredUnits + 1;
          this.coveredAmount = this.coveredAmount + Number( this.cellData[0]['"VEHGRO"']);
        }

        if( this.cellData[0]['"AD"'] !== ""){
          typeArray.push('delivered');

          this.deliveredUnits = this.deliveredUnits + 1;
          this.deliveredAmount = this.deliveredAmount + Number( this.cellData[0]['"VEHGRO"']);
        }
        this.cellData[0]['type'] =typeArray;
        // console.log(this.cellData[0]['type']);
        rows.push(this.cellData[0]);
      });

      // console.log(this.carryOverAmount, this.carryOverUnits,this.cellData[0] )
      // console.log(this.soldAmount, this.soldUnits, )
      // console.log(this.coveredAmount, this.coveredUnits, )
      // console.log(this.deliveredAmount, this.deliveredUnits, )
      console.log(this.rowColor);

      this.carryOverAvg = (this.carryOverUnits > 0)? Number(this.carryOverAmount)/Number(this.carryOverUnits):0;
      this.soldAvg = (this.soldUnits > 0)? Number(this.soldAmount)/Number(this.soldUnits):0;
      this.coveredAvg = (this.coveredUnits > 0)? Number(this.coveredAmount)/Number(this.coveredUnits): 0;
      this.deliveredAvg =(this.deliveredUnits > 0)? Number(this.deliveredAmount)/Number(this.deliveredUnits):0;

      let column = [];
      let count = 0;
      let rowIdcolumn = new Object();
  
      rowIdcolumn["headerName"]= ".", 
    
      rowIdcolumn["colId"]= 0,
      rowIdcolumn["minWidth"]= 40,
      rowIdcolumn["maxWidth"] = 40,
      rowIdcolumn["cellClass"] = 'row-no',
      rowIdcolumn["editable"]= true, 
      rowIdcolumn["sequence"] = 0;
      rowIdcolumn["pinned"]= 'left', 
      rowIdcolumn["lockPinned"]= true,
      rowIdcolumn["filter"] = true,
      rowIdcolumn["lockPosition"]= true, 
    
      rowIdcolumn["cellClass"] = function(params) {
        // console.log(params.data);
        let i =1;
        return (params.data.carryOver===true?'agClassCarryOver':'agClassNoCarryOver');
      }
      let carryOverCount=this.carryOverUnits;
      rowIdcolumn["valueGetter"] = function(params) {
        // console.log(params.node.rowIndex, carryOverCount);
        if (params.data.carryOver===true){
            count = 0;
            console.log(count);
            return null;
        }else {
          //i++;
          let l = (params.node.rowIndex+1)-carryOverCount;
          console.log(params.node.rowIndex, carryOverCount, l ,params.data.carryOver);
          if(params.node.rowIndex >=carryOverCount){
            return (params.node.rowIndex+1)-carryOverCount;
          }else{
            count++;
            console.log(count);
            return count;
          }
        }
  
      }
  
      column.push(rowIdcolumn);
  
      this.salesData.column.forEach(element => {
  
        let columnMap = new Object();
        columnMap["headerName"] = element.colName;
        // columnMap["field"] = element.colCode;
        columnMap["field"] = ''+element.colId+'';
        columnMap["colId"] = element.colId;

        columnMap["colCode"] = element.colCode;
        columnMap["sequence"] = element.sequence;
        columnMap["resizable"] = true;
        columnMap["sortable"] = true;
        columnMap["filter"] = true,
        columnMap["hide"] = !element.display;
        let required = element.required
        columnMap["cellStyle"] = function(params) {
          // console.log(params.data, params.value);

          if (required && params.value === "") {
              //mark police cells as red
              return { backgroundColor: 'red'};
          } else {
              return  null;
          }
        }
  
        if(element.type === 'Date'){
          columnMap["cellRenderer"] = 'calenderRender';
        }
        if(element.type === 'DD-Fixed'){
          columnMap["cellRenderer"] = 'customDropDownRenderer';
        }
        if(element.type === 'DD-Self'){
          columnMap["cellRenderer"] = 'customDropDownRenderer';
        }
        if(element.type === 'DD-Suggest'){
          columnMap["cellRenderer"] = 'customDropDownRenderer';
        }
        if(element.type === 'Combo'){
          columnMap["cellRenderer"] = 'dropDownRenderer';
        }
  
        column.push(columnMap);
      });

      column.sort(function(a, b){
        return a.sequence - b.sequence;
      });

      this.columnDefs= column;
      this.rowData = rows;
      this.rowResponse = rows;
      // console.log(this.columnDefs );
      // console.log(this.rowData );
      console.log(this.rowColor);


    });

  }


  gridFilter(months?, date?, searchValue?){

    this.gridApi.showLoadingOverlay();

    let obj = {
      "UserId": this.sessionHandlerService.getSession('userObj').userId,
      "RoleId": this.sessionHandlerService.getSession('userObj').roleID,
      "ViewId": 3,
      "DeptId": this.decryptedDepartmentId,
      "TillDate": (date)? date : moment().format('MMM_YY'),
      "PastMonths": (months)? months : 1,
      "ShowDeleted": (this.searchForm.get('deletedRecords').value)? this.searchForm.get('deletedRecords').value: null
    }

    this.saleslog.fetchAllRows(obj).subscribe(res=>{
      this.rowResponse = [];
      this.salesData = [];
      // this.salesData = (data as any).default;
      this.salesData = res;

      let rows=  [];
      this.monthObject.oneMonth = true;

      this.salesData.rowData.row.forEach(element => {
        this.cellMap = new Object();
        let carryOver = element.isCarryOver;
        
        if(carryOver) {
          this.carryOverUnits++;
        }
        this.cellData =[];
        let index =0;
        element.cells.forEach(element1 => {
          this.cellMap[''+element1.colId+''] = element1.currentCellValue;
          if(element1.colCode === "OD"){
            this.cellMap[''+element1.colId+''] =moment(element1.currentCellValue).format('MM/DD/YYYY');

            this.cellMap['"'+element1.colCode+'"'] =moment(element1.currentCellValue).format('MM/DD/YYYY');
            console.log(this.cellMap['"'+element1.colCode+'"'])
          }else{
            this.cellMap[''+element1.colId+''] = element1.currentCellValue;
            this.cellMap['"'+element1.colCode+'"']= element1.currentCellValue;

          }
          if(element1.cellOptions.length >0) {
            this.cellMap["cellOptions_"+element1.colCode] = element1.cellOptions;
          }
          this.cellMap["carryOver"] = carryOver;
     
          if(index == element.cells.length-1) {
            this.cellData.push(this.cellMap);
          }
          index++;
        });

        /** Calculate Aggregared Header */
        let columnData = this.cellData[0];
        let typeArray = [];
        // console.log(this.cellData[0]);
        // console.log(this.cellData[0]['"OD"'], this.cellData[0]['"ED"'], this.cellData[0]['"VEHGRO"'], this.cellData[0]['"AD"'], this.cellData[0]["type"]);
        if(moment(this.cellData[0]['"OD"']).isBefore(moment().format('DD-MMM-YY'),'months')){
          let time = moment().isSameOrAfter(moment(this.cellData[0]['"ED"']).format('DD-MMM-YY'),'months');
          if(time){
            this.carryOverAmount = this.carryOverAmount + Number(this.cellData[0]['"VEHGRO"']);
            typeArray.push('carryOver');
          }else{
            typeArray.push('sold');

            this.soldUnits = this.soldUnits + 1;
            this.soldAmount = this.soldAmount + Number( this.cellData[0]['"VEHGRO"']);
          }
        }else{
          typeArray.push('sold');

          this.soldUnits = this.soldUnits + 1;
          this.soldAmount = this.soldAmount + Number( this.cellData[0]['"VEHGRO"']);
        }


        if(moment().isSameOrBefore(moment( this.cellData[0]['"ED"']).format('DD-MMM-YY'),'months')){
          typeArray.push('covered');

          this.coveredUnits = this.coveredUnits + 1;
          this.coveredAmount = this.coveredAmount + Number( this.cellData[0]['"VEHGRO"']);
        }

        if( this.cellData[0]['"AD"'] !== ""){
          typeArray.push('delivered');

          this.deliveredUnits = this.deliveredUnits + 1;
          this.deliveredAmount = this.deliveredAmount + Number( this.cellData[0]['"VEHGRO"']);
        }
        this.cellData[0]['type'] =typeArray;

        rows.push(this.cellData[0]);
      });
      this.rowResponse = rows;

      // console.log(this.carryOverAmount, this.carryOverUnits,this.cellData[0] )
      // console.log(this.soldAmount, this.soldUnits, )
      // console.log(this.coveredAmount, this.coveredUnits, )
      // console.log(this.deliveredAmount, this.deliveredUnits, )

      this.carryOverAvg = (this.carryOverUnits > 0)? Number(this.carryOverAmount)/Number(this.carryOverUnits):0;
      this.soldAvg = (this.soldUnits > 0)? Number(this.soldAmount)/Number(this.soldUnits):0;
      this.coveredAvg = (this.coveredUnits > 0)? Number(this.coveredAmount)/Number(this.coveredUnits): 0;
      this.deliveredAvg =(this.deliveredUnits > 0)? Number(this.deliveredAmount)/Number(this.deliveredUnits):0;

      // console.log(rows);
      let searchResult = rows.filter(resp=>{
        let orderDate = resp['"OD"'];
        let payType = resp['"PT"'];
        let financeManger = resp['"FM"'];
        let email = resp['"EM"'];
        let dept = resp['"Dept"'];
        // console.log(resp['"OD"'], resp['"EM"'],email);
        // console.log(email, searchValue);
        return(
          email && email.toLowerCase().includes(searchValue.toLowerCase()) || 
          dept && dept.toLowerCase().includes(searchValue.toLowerCase()) || 
          payType && payType.toLowerCase().includes(searchValue.toLowerCase()) || 
          financeManger && financeManger.toLowerCase().includes(searchValue.toLowerCase())
        )

      });


      console.log(searchResult );
      // console.log(this.rowData );

      /*Dispaly search results in grid row array and number of display records found*/ 
      this.displaySearchResult(searchResult);
      /*-------------------------*/

    });

  }

  displaySearchResult(searchResult){
    this.records = this.rowData;
    this.rowData = [];
    this.rowData = searchResult;
    console.log(this.rowResponse);
    this.toastHandlerService.generateToast(searchResult.length+' Record found','',2000);

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
    // console.log(params);
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
    // console.group('Group');
    // console.log(params['column']['userProvidedColDef']);
    // console.groupEnd();
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
    let searchVal = this.searchForm.get('searchbar').value;
    let previousMonthFilter = this.searchForm.get('previousMonth').value;
    let currentMonthFilter = this.searchForm.get('currentMonth').value;
    let currentMonth= moment();
    let startMonth =  moment().subtract(Number(previousMonthFilter)+1, 'months').format('MMM_YYYY');

    let searchResult = [];
    console.log(this.rowResponse);

    if(this.searchForm.get('searchbar').value !=="" && currentMonthFilter !==false){
      if(this.monthObject.oneMonth){

        searchResult = this.rowResponse.filter(resp=>{
          let orderDate = resp['"OD"'];
          let payType = resp['"PT"'];
          let financeManger = resp['"FM"'];
          let email = resp['"EM"'];
          let dept = resp['"Dept"'];
          console.log(resp['"OD"'], resp['"EM"']);
          console.log(email, searchVal);
          return moment(orderDate).isSame(moment()) && 
          (
            email && email.toLowerCase().includes(searchVal.toLowerCase()) || 
            dept && dept.toLowerCase().includes(searchVal.toLowerCase()) || 
            payType && payType.toLowerCase().includes(searchVal.toLowerCase()) || 
            financeManger && financeManger.toLowerCase().includes(searchVal.toLowerCase())
          )
  
        });

        /*Dispaly search results in grid row array and number of display records found*/ 
        this.displaySearchResult(searchResult);
        /*-------------------------*/
      }else{
        let month= moment().format('MMM_YY')
        this.gridFilter(previousMonthFilter, month, searchVal);
        this.monthObject.reset();
        this.monthObject.oneMonth = true;
      }
    }else if(this.searchForm.get('searchbar').value !=="" && previousMonthFilter !==""){
      if(previousMonthFilter === "3"){
        if(this.monthObject.threeMonth){
          searchResult = this.searchSalesLog(searchResult, previousMonthFilter, searchVal);

          /*Dispaly search results in grid row array and number of display records found*/ 
          this.displaySearchResult(searchResult);
          /*-------------------------*/
        }else{
          let month= moment().format('MMM_YY')
          this.gridFilter(previousMonthFilter, month, searchVal);
          this.monthObject.reset();
          this.monthObject.threeMonth = true;
        }
      }else if(previousMonthFilter === "6"){
        if(this.monthObject.sixMonth){
          searchResult = this.searchSalesLog(searchResult, previousMonthFilter, searchVal);

          /*Dispaly search results in grid row array and number of display records found*/ 
          this.displaySearchResult(searchResult);
          /*-------------------------*/ 
        }else{
          let month= moment().format('MMM_YY')
          this.gridFilter(previousMonthFilter, month, searchVal);
          this.monthObject.reset();
          this.monthObject.sixMonth = true;
        }
      }else if(previousMonthFilter === "12"){
        if(this.monthObject.twelveMonth){
          searchResult = this.searchSalesLog(searchResult, previousMonthFilter, searchVal);

          /*Dispaly search results in grid row array and number of display records found*/ 
          this.displaySearchResult(searchResult);
          /*-------------------------*/
        }else{
          let month= moment().format('MMM_YY')
          this.gridFilter(previousMonthFilter, month, searchVal);
          this.monthObject.reset();
          this.monthObject.twelveMonth = true;
        }
      }else{
        if(this.monthObject.allMonth){
          searchResult = this.searchSalesLog(searchResult, previousMonthFilter, searchVal);
          
          /*Dispaly search results in grid row array and number of display records found*/ 
          this.displaySearchResult(searchResult);
          /*-------------------------*/
        }else{
          let month= moment().format('MMM_YY')
          this.gridFilter(-1, month, searchVal);
          this.monthObject.reset();
          this.monthObject.allMonth = true;
        }
      }
      // let searchedDate =  moment().subtract(Number(previousMonthFilter)+1, 'months').format('MMM-YYYY');
      // searchResult = this.rowResponse.filter(resp=>{
      //   let datafilter;
      //   let endDate =  moment().format('MMM-YYYY');
      //   let orderDate = resp['"OD"'];
      //   let payType = resp['"PT"'];
      //   let financeManger = resp['"FM"'];
      //   let email = resp['"EM"'];
      //   let dept = resp['"Dept"'];

      //   console.log(resp);


      //   if(previousMonthFilter !== "all"){
      //     return moment(orderDate).isAfter(searchedDate) &&  moment(orderDate).isBefore(endDate) && 
      //     (
      //       email && email.toLowerCase().includes(searchVal.toLowerCase()) || 
      //       dept && dept.toLowerCase().includes(searchVal.toLowerCase()) || 
      //       payType && payType.toLowerCase().includes(searchVal.toLowerCase()) || 
      //       financeManger && financeManger.toLowerCase().includes(searchVal.toLowerCase())
      //     )
      //   }else{
      //     return (
      //       email && email.toLowerCase().includes(searchVal.toLowerCase()) || 
      //       dept && dept.toLowerCase().includes(searchVal.toLowerCase()) || 
      //       payType && payType.toLowerCase().includes(searchVal.toLowerCase()) || 
      //       financeManger && financeManger.toLowerCase().includes(searchVal.toLowerCase())
      //     )
      //   }
      //   // datefilter = Object.keys(resp).filter(res=> {
      //   //   // if(res !=="" && isNaN(Number(resp[res]))){
      //   //   //   console.log(resp[res], Number(resp[res]))
      //   //   //   return resp[res].toLowerCase()=== searchVal;
      //   //   // }
      //   // });
      //   // if(datefilter.length> 0){         
      //   //   return resp;
      //   // }

      // });

    }else{
      if(this.searchForm.get('searchbar').value !==""){
        searchResult = this.rowResponse.filter(resp=>{
          let filter = Object.keys(resp).filter(res=> resp[res].toLowerCase()=== searchVal);
          if(filter.length> 0){         
            return resp;
          }
        });

        /*Dispaly search results in grid row array and number of display records found*/ 
        this.displaySearchResult(searchResult);
        /*-------------------------*/
      }
    }
     
  }

  searchSalesLog(searchResult, previousMonthFilter, searchVal){
    let searchedDate =  moment().subtract(Number(previousMonthFilter)+1, 'months').format('MMM-YYYY');
    return searchResult = this.rowResponse.filter(resp=>{
      let datafilter;
      let endDate =  moment().format('MMM-YYYY');
      let orderDate = resp['"OD"'];
      let payType = resp['"PT"'];
      let financeManger = resp['"FM"'];
      let email = resp['"EM"'];
      let dept = resp['"Dept"'];

      console.log(email, searchVal, email && email.toLowerCase().includes(searchVal.toLowerCase()));
      console.log(moment(orderDate).isAfter(searchedDate) &&  moment(orderDate).isBefore(endDate));


      if(previousMonthFilter !== "all"){
        return moment(orderDate).isAfter(searchedDate) &&  moment(orderDate).isBefore(endDate) && 
        (
          email && email.toLowerCase().includes(searchVal.toLowerCase()) || 
          dept && dept.toLowerCase().includes(searchVal.toLowerCase()) || 
          payType && payType.toLowerCase().includes(searchVal.toLowerCase()) || 
          financeManger && financeManger.toLowerCase().includes(searchVal.toLowerCase())
        )
      }else{
        return (
          email && email.toLowerCase().includes(searchVal.toLowerCase()) || 
          dept && dept.toLowerCase().includes(searchVal.toLowerCase()) || 
          payType && payType.toLowerCase().includes(searchVal.toLowerCase()) || 
          financeManger && financeManger.toLowerCase().includes(searchVal.toLowerCase())
        )
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
  }


  ngOnDestroy(): void {
    this.snackBar.dismiss();
  }
  filterGrid(option){

    // If filter matches change active state of columns*/ 
      if(option === 0){

        let row = this.rowResponse.filter(res=>{ 
          // console.log(res.type);
          return res.type.find(el=> el ==="carryOver")
        });
        console.log(this.rowResponse, row)
        if(row.length >0){
          this.rowData = [];
          this.rowData = row;  
          this.toastHandlerService.generateToast("1 filter applied",'Clear',null);
        }
      }else if(option === 1){
        let row = this.rowResponse.filter(res=>{ 
          // console.log(res.type);
          return res.type.find(el=> el ==="sold")
        });
        if(row.length >0){
          this.rowData = [];
          this.rowData = row;  
          this.toastHandlerService.generateToast("1 filter applied",'Clear',null);
        }
      }else if(option === 2){
        let row = this.rowResponse.filter(res=>{ 
          // console.log(res.type);
          return res.type.find(el=> el ==="covered")
        });
        if(row.length >0){
          this.rowData = [];
          this.rowData = row;  
          this.toastHandlerService.generateToast("1 filter applied",'Clear',null);
        }
      }else if(option === 3){
        let row = this.rowResponse.filter(res=>{ 
          // console.log(res.type);
          return res.type.find(el=> el ==="delivered")
        });
        if(row.length >0){
          this.rowData = [];
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
        this.searchForm.get('searchbar').setValue('');
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
    // console.log(this.years);

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
              console.log(params);
              thisRef.openModal(thisRef,HistoryComponent,'1000px',{option:2, colId: Number(params.column.colId), entryId: params.node.rowIndex});
            },
            icon: createFlagImg('bookmark'),
          },
          {
            name: 'Show All',
            action: function() {
              console.log(params.column.colId);
              console.log(params.node.rowIndex);
              thisRef.openModal(thisRef,HistoryComponent,'1000px',{option:1, colId: Number(params.column.colId), entryId: params.node.rowIndex});
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
          // console.log(params);
          thisRef.duplicateRow(newItems, params.node.rowIndex);
          // thisRef.gridApi.applyTransaction({ add: newItems });
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
          thisRef.updateCellColor();
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
          thisRef.updateCellColor();
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
          thisRef.updateCellColor();
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
          thisRef.updateCellColor();
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
          thisRef.updateCellColor();
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
          thisRef.removeCellColor();
          thisRef.gridApi.redrawRows();
        },
        icon: createFlagImg('close'),
        cssClasses: ['pointer'],
      },
    ];
    return result;
  }



  openModal(thisRef,component,width,key?:any){
    console.log(key);
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

  duplicateRow(newItems, index) {
    this.gridApi.showLoadingOverlay();

    let params = {
      EntryId: index+1
    }
    this.saleslog.duplicateRows(params)
    .subscribe(res=>{
      this.gridApi.hideOverlay();

      this.gridApi.applyTransaction({ add: newItems });
    })
  }

  removeCellColor(newItems?) {
    let params = {
      EntryId: ''
    }
    this.saleslog.removeCellColor(params)
    .subscribe(res=>{
      
    })
  }

  deleteRow(index) {

    this.gridApi.showLoadingOverlay();
    let params = {
      EntryId: index+1
    }
    this.saleslog.deleteRows(params)
    .subscribe(res=>{
      this.gridApi.hideOverlay();
      this.toastHandlerService.generateToast('Row Deleted Successfully','',2000);
    })
  }

  updateCellColor(newItems?) {
    let params = {
      EntryId: ''
    }
    this.saleslog.updateCellColor(params)
    .subscribe(res=>{
    // console.log('pressed',params.node.rowIndex,params,this.rowResponse);
    // this.rowResponse.filter(el=> el.rowID !==params.node.rowIndex)
    })
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
    console.log(res, selectedData);
    if(res.remove.length> 0){
      let index = res.remove[0].rowIndex;
      console.log(index);
      this.deleteRow(index);
    }
  }

  getRowData() {
    var rowData = [];
    this.gridApi.forEachNode(function(node) {
      rowData.push(node.data);
    });
  }

  addColumn(){
    this.dialogRef = this.dialog.open(NewDealComponent,{
      panelClass: 'custom-dialog-container',
      'width': '400px',
      data: {
        "key": this.decryptedDepartmentId
      }
    });
    this.dialogRef.afterClosed().subscribe(res=>{
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
    this.openModal(this, ColumnOptionComponent,'900px',this.decryptedDepartmentId);
  }

  print(){
    this.printdata=1;
  }

  dateSetting(event){    
    this.monthActive = event.monthActive;
    this.yearActive = event.yearActive;
    this.monthFilter = event.monthFilter;
    this.monthSelected = event.monthSelected;
    this.sliderIndex = event.monthSelected;
    this.sliderItem = event.sliderItem;
    if(event.option === 1){
      this.generateGrid(1, this.sliderItem.replace(' ','_'))
    }else{
      this.generateGrid(this.monthSelected, moment(this.monthActive+"-"+this.yearActive).format('MMM_YY'))
    }
  }
  
  
}

// function getDatePicker() {
//   function Datepicker() {}
//   Datepicker.prototype.init = function(params) {

//     this.div = document.getElementsByClassName('AG_Popup');
//     $(function() {

//       let data = ['cancelled','pending','empty','tba'];
//       let inputField = $('.AG_InputAutoCompleteEstimated');
//       let dropDown = $('.ag-dropdown-style');
//       let cancel = $('#cancelled');
//       let pending = $('#pending');
//       let tba = $('#tba');
//       let empty = $('#empty');

//       console.log(inputField, cancel)
      
      
//       inputField.keyup(function(){
//         let value = ($(this).val());
//         let search =	data.find(el=> el=== value);
//         if(search !== undefined){
//           let element = "#"+search;
//           $('tr').removeClass('selected');
//           $(element).addClass('selected');
//         }else{
//           $('tr').removeClass('selected');
//         }
//       });
      
      
//       inputField.on("click", function(){
//         dropDown.css("display","block");
//       });
      
//       empty.on("click", function(){
//         let value = ($(this).text().trim());
//         change(this,value);
//       });
      
//       cancel.on("click", function(){
//         let value = ($(this).text().trim());
//         change(this,value);
//       });
      
//       pending.on("click", function(){
//         let value = ($(this).text().trim());
//         change(this,value);
//       });
      
//       tba.click(function(){
//         let value = ($(this).text().trim());
//         change(this, value);
//       });
        
        
//       function change(thisRef,value){
//         $('tr').removeClass('selected');
//         $(thisRef).addClass('selected');
//         inputField.val(value);
//         dropDown.css("display","none");
//       }
      
//       let format = 'd-M-y';
//       let timepicker = false;
  
//       if(params && params.colDef.field==="estimated_delivery"){
//         format= 'd-M-y h:m A';
//         timepicker = true;
//       }
      
//       inputField.datetimepicker({
//         timepicker:timepicker,
//         format:format,
//       });

      
//     });



//     /*--------------------------------------*/ 

//     // this.eInput = document.createElement('input');
//     // this.eInput.value = params.value;
//     // this.eInput.classList.add('ag-input');
//     // this.eInput.style.height = '100%';
//     // this.eInput.style.width = '100%';

//     // let format = 'd-M-y';
//     // let timepicker = false;

//     // if(params && params.colDef.field==="estimated_delivery"){
//     //   format= 'd-M-y h:m A';
//     //   timepicker = true;
//     // }
    
//     // $(this.eInput).datetimepicker({
//     //   timepicker:timepicker,
//     //   format:format,
//     // });
    

//   };
//   Datepicker.prototype.getGui = function() {
//     return this.div;
//   };
//   Datepicker.prototype.afterGuiAttached = function() {
//     this.div.focus();
//     // this.div.select();
//   };
//   Datepicker.prototype.getValue = function() {
//     return this.div.value;
//   };
//   Datepicker.prototype.destroy = function() {};
//   Datepicker.prototype.isPopup = function() {
//     return false;
//   };
//   return Datepicker;
// }


// function getDropDown() {
//   function DropDown() {}
//   DropDown.prototype.init = function(params) {
//     this.select = document.createElement('select');
//     // this.select.value = params.value;
//     this.select.classList.add('email-select');
//     this.select.style.height = '100%';
//     this.select.style.width = '100%';
//     $(this.select).selectize({
//       valueField: 'name',
//       labelField: 'name',
//       placeholder: 'Select'
//   ,    options: [
//         {
//             description: 'Nice Guy',
//             name: 'Brian Reavis',
//             imageUrl: 'http://www.fashionspictures.com/wp-content/uploads/2013/11/short-hairstyles-for-a-square-face-42-150x150.jpg'
//         }, 
//         {
//             description: 'Other nice guy',
//             name: 'Nikola Tesla',
//             imageUrl: 'http://www.fashionspictures.com/wp-content/uploads/2013/11/short-hairstyles-for-a-square-face-42-150x150.jpg'
//         }
//       ]
//   });
//     // let option = document.createElement('option');
//     // option.value = "One";
//     // this.select.append= option;

    

//   };
//   DropDown.prototype.getGui = function() {
//     return this.select;
//   };
//   DropDown.prototype.afterGuiAttached = function() {
//     this.select.focus();
//   };
//   DropDown.prototype.getValue = function() {
//     return this.select.value;
//   };
//   DropDown.prototype.destroy = function() {};
//   DropDown.prototype.isPopup = function() {
//     return false;
//   };
//   return DropDown;
// }


// function getCustomDropDown() {
//   function DropDown() {}
//   DropDown.prototype.init = function(params) {
//     this.select = document.createElement('select');
//     // this.select.value = params.value;
//     this.select.classList.add('email-select');
//     this.select.style.height = '100%';
//     this.select.style.width = '100%';
//     $(this.select).attr('theme','google');
//     $(this.select).attr('data-search',true);

//     // $(this.select).selectize({);
 
//     for(var i = 0; i < params.values.length; i++) {
//       var option = params.values[i];
//       $('<option />', { value: option, text: option }).appendTo(this.select);
//     }

//     $(this.select).selectstyle({
//       width  : 250,
//       height : 300,
//     });
//   };
//   DropDown.prototype.getGui = function() {
//     return this.select;
//   };
//   DropDown.prototype.afterGuiAttached = function() {
//     this.select.focus();
//   };
//   DropDown.prototype.getValue = function() {
//     return this.select.value;
//   };
//   DropDown.prototype.destroy = function() {};
//   DropDown.prototype.isPopup = function() {
//     return false;
//   };
//   return DropDown;
// }


// function getRenderer() {

//   function CellRenderer() {}
//   CellRenderer.prototype.createGui = function() {
//     var template =
//       '<span style="flex-direction: row-reverse;width: 100%;display: flex;justify-content: space-between;"><img id="theButton" src="./assets/icons/down-arrow.png"><span id="theValue"></span></span>';
//     var tempDiv = document.createElement('div');
//     tempDiv.innerHTML = template;

//     this.eGui = tempDiv.firstElementChild;
//   };
//   CellRenderer.prototype.init = function(params) {
//     this.createGui();
//     this.params = params;
//     var eValue = this.eGui.querySelector('#theValue');
//     eValue.innerHTML = params.value;
//     this.eButton = this.eGui.querySelector('#theButton');
//     this.buttonClickListener = this.onButtonClicked.bind(this);
//     this.eButton.addEventListener('click', this.buttonClickListener);
//   };
//   CellRenderer.prototype.onButtonClicked = function() {
//     var startEditingParams = {
//       rowIndex: this.params.rowIndex,
//       colKey: this.params.column.getId(),
//     };
//     this.params.api.startEditingCell(startEditingParams);
//   };
//   CellRenderer.prototype.getGui = function() {
//     return this.eGui;
//   };
//   CellRenderer.prototype.destroy = function() {
//     this.eButton.removeEventListener('click', this.buttonClickListener);
//   };
//   CellRenderer.prototype.isPopup = function() {
//     return true;
//   };
//   return CellRenderer;
// }

// function getRendererDropDown(){
//   function CellRenderer() {}
//   CellRenderer.prototype.init = function(params) {
    

//   };
//   CellRenderer.prototype.getGui = function() {
//     return this.eInput;
//   };
//   CellRenderer.prototype.afterGuiAttached = function() {
//     this.eInput.focus();
//     this.eInput.select();
//   };
//   CellRenderer.prototype.getValue = function() {
//     return this.eInput.value;
//   };
//   CellRenderer.prototype.destroy = function() {};
//   CellRenderer.prototype.isPopup = function() {
//     return false;
//   };
//   return CellRenderer;
// }

function createFlagImg(flag) {
  return (
    '<img border="0" width="15px" height="10" src="./assets/icons/'+flag+'.png"/>'
  );
}