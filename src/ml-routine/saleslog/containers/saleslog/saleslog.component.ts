import { CustomLoadingOverlayComponent } from "../../components/custom-loading-overlay/custom-loading-overlay.component";

import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    Renderer2,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ToastHandlerService } from "app/shared/services/toast-handler.service";
import { MatDialog } from "@angular/material/dialog";
import { HistoryComponent } from "ml-routine/saleslog/components/history/history.component";
import { NewDealComponent } from "ml-routine/saleslog/components/new-deal/new-deal.component";
import { ExcelExportComponent } from "ml-routine/saleslog/components/excel-export/excel-export.component";
import { ColumnOptionComponent } from "ml-routine/saleslog/components/column-option/column-option.component";

import { AllModules } from "@ag-grid-enterprise/all-modules";
import { CustomHeaderComponent } from "ml-routine/shared/components/custom-header/custom-header.component";
import { SlideInOutAnimation } from "app/shared/animation/animation";
import { FormBuilder, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { EncryptionService } from "app/shared/services/encryption.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "ml-auth/shared/services/ml-auth/ml-auth.service";
import { CalenderRenderer } from "./calander-renderer.component";
// import * as Selectize from '../../../../../node_modules/selectize/dist/js/standalone/selectize.js';

declare var $: any;
import { CustomDropDownRenderer } from "./custom-dropdown-renderer.component";
import { DropDownRenderer } from "./dropdown-renderer.component";
import { SaleslogService } from "ml-routine/shared/services/saleslog/saleslog.service";
import { SessionHandlerService } from "app/shared/services/session-handler.service";
import { SharedService } from "ml-setup/shared/services/shared/shared.service";
import { SignalRService } from "ml-setup/shared/services/signal-r/signal-r.service";

@Component({
    selector: "ml-saleslog",
    templateUrl: "./saleslog.component.html",
    styleUrls: ["./saleslog.component.scss"],
    animations: [SlideInOutAnimation],
})
export class SaleslogComponent implements OnInit {
    selectedCity: number;
    departmentNameRendered: string = "";
    @Input()
    public routineSelected: number = 1;
    @ViewChild("myGrid", { static: true }) agGrid: ElementRef;

    public carryOverAmount: number = -0;
    public carryOverUnits: number = 0;
    public carryOverAvg: number = 0;

    public soldAmount: number = -0;
    public soldUnits: number = 0;
    public soldAvg: number = 0;

    public coveredAmount: number = -0;
    public coveredUnits: number = 0;
    public coveredAvg: number = 0;
    dateFilterApplied: number = 0;

    public deliveredAmount: number = -0;
    public deliveredUnits: number = 0;
    public deliveredAvg: number = 0;

    gridApi;
    gridColumnApi;

    public modules: any[] = AllModules;
    columnDefs;
    defaultColDef;
    columnTypes;
    autoGroupColumnDef;
    rowData = [];
    rows = [];

    getRowNodeId;
    aggFuncs;
    baseCondtion: number = 0;
    rowHeight: number;

    history: number = 3;
    period: number = 3;
    startFrom: number = null;
    public emptyFieldsCount: number = 0;
    statusOption: string[] = [];
    payOptions: string[] = [];
    salesEngOption: string[] = [];
    salesPersonOption: string[] = [];
    afterMarketManagerOptions: string[] = [];
    financeManagerOption: string[] = [];
    components;
    public rowSelection;
    public thisComponent = this;
    getRowClass;
    dialogRef: any;
    frameworkComponents: any;
    printdata: any;
    monthObject: any = {
        oneMonth: false,
        threeMonth: false,
        sixMonth: false,
        twelveMonth: false,
        allMonth: false,
        reset: function () {
            this.oneMonth = false;
            this.threeMonth = false;
            this.sixMonth = false;
            this.twelveMonth = false;
        },
    };

    cellData: any = [];
    cellMap: any;
    salesData: any;

    public rowColor = [];
    postProcessPopup;

    monthSearch: any;
    animationState = "out";
    searchDate: any = [];
    currentDate: any = [];
    years: any = [];
    months: any = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    monthActive: any;
    yearCounter = 0;
    monthModal: boolean = false;
    monthSelected: any;
    monthFilter: string;
    yearActive: string;
    sliderItem: string;
    sliderIndex: number;
    records: any = [];
    toggleColumns: boolean = true;
    decryptedDepartmentId: string;
    loadingOverlayComponent;
    loadingOverlayComponentParams;
    pageCounter: number = 0;

    searchForm: FormGroup = this.fb.group({
        searchbar: [""],
        currentMonth: [true],
        previousMonth: [""],
        deletedRecords: [null],
    });

    constructor(
        private toastHandlerService: ToastHandlerService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        public sharedService: SharedService,
        private sessionHandlerService: SessionHandlerService,
        public snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private encryptionService: EncryptionService,
        private saleslog: SaleslogService,
        private signalRService: SignalRService // private siteTargetSerivce: SiteTargetsService
    ) {
        this.route.paramMap.subscribe((params) => {
            this.decryptedDepartmentId = this.encryptionService.convertToEncOrDecFormat(
                "decrypt",
                params.get("id")
                );
                this.dateFilterApplied = 0;
            if (this.pageCounter !== 0) {
                this.generateGrid();
            }
        });

        this.columnDefs = [];
        
        this.defaultColDef = {
            flex: 1,
            minWidth: 200,
            editable: true,
            filter: true,
            cellClass: "row-text-style",
            cellClassRules: {
                "green-color": function (params) {
                    return params.value === "OFA";
                },
                "blue-color": function (params) {
                    return params.value === "Cash";
                },
                "pink-color": function (params) {
                    return params.value === "IHP";
                },

                "green-mark": function (params) {
                    // // console.log(params)
                    let thisRef = params.context.thisComponent;
                    let currentRow;
                    if (params.colDef) {
                        currentRow = thisRef.rowColor.find(
                            (el) =>
                                el.rowId === params.rowIndex &&
                                el.colId === params.colDef.colId
                        );
                    }
                    return currentRow !== undefined
                        ? currentRow.color === "green"
                        : false;
                },
                "blue-mark": function (params) {
                    let thisRef = params.context.thisComponent;
                    let currentRow;
                    if (params.colDef) {
                        currentRow = thisRef.rowColor.find(
                            (el) =>
                                el.rowId === params.rowIndex &&
                                el.colId === params.colDef.colId
                        );
                    }
                    return currentRow !== undefined
                        ? currentRow.color === "blue"
                        : false;
                },
                "purple-mark": function (params) {
                    let thisRef = params.context.thisComponent;
                    let currentRow;
                    if (params.colDef) {
                        currentRow = thisRef.rowColor.find(
                            (el) =>
                                el.rowId === params.rowIndex &&
                                el.colId === params.colDef.colId
                        );
                    }
                    return currentRow !== undefined
                        ? currentRow.color === "purple"
                        : false;
                },

                "yellow-mark": function (params) {
                    let thisRef = params.context.thisComponent;
                    let currentRow;
                    if (params.colDef) {
                        currentRow = thisRef.rowColor.find(
                            (el) =>
                                el.rowId === params.rowIndex &&
                                el.colId === params.colDef.colId
                        );
                    }
                    return currentRow !== undefined
                        ? currentRow.color === "yellow"
                        : false;
                },
                "red-mark": function (params) {
                    let thisRef = params.context.thisComponent;
                    let currentRow;
                    if (params.colDef) {
                        currentRow = thisRef.rowColor.find(
                            (el) =>
                                el.rowId === params.rowIndex &&
                                el.colId === params.colDef.colId
                        );
                    }
                    return currentRow !== undefined
                        ? currentRow.color === "red"
                        : false;
                },
                "red-field-color": function (params) {
                    if (
                        params.colDef.colCode === "SE" ||
                        params.colDef.colCode === "AFM" ||
                        params.colDef.colCode === "FM"
                    ) {
                        let choice = false;
                        let date = moment().format("DD-MMM-YY");
                        let isAfter = moment(params.data.orderDate).isSame(
                            date
                        );
                        if (isAfter) {
                            choice = false;
                        } else {
                            let isBefore = moment(
                                params.data.orderDate
                            ).isBefore(date);
                            choice = isBefore;
                        }
                        // // console.log("after",params.data.orderDate,isAfter,"choice:",choice);
                        return params.value === "" && choice;
                    } else if (params.colDef.colCode === "PT") {
                        let date = moment().format("DD-MMM-YY");
                        let isAfter = moment(
                            params.data.orderDate
                        ).isSameOrAfter(date);
                        let choice;
                        if (!isAfter) {
                            choice = moment(params.data.orderDate).isBefore(
                                date
                            );
                        } else {
                            choice = isAfter;
                        }
                        // // console.log(params.data.orderDate);

                        return params.value === "" && choice;
                    } else {
                        return false;
                    }
                },
            },
            // filter: 'customFilter',
            // menuTabs: ['filterMenuTab','columnsMenuTab','generalMenuTab'],
            headerComponentParams: { menuIcon: "fa-chevron-down" },
            // cellStyle: this.cellStyling.bind(this),
            // maxWidth: 100,
            // cellClassRules: {
            //   boldBorders: this.getCssRules.bind(this),
            // },
            onCellValueChanged: this.onCellChanged.bind(this),
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

        this.getRowNodeId = function (data) {
            return data.id;
        };
        this.frameworkComponents = {
            dropDownRenderer: DropDownRenderer,
            customDropDownRenderer: CustomDropDownRenderer,
            customLoadingOverlay: CustomLoadingOverlayComponent,
            calenderRender: CalenderRenderer,
            agColumnHeader: CustomHeaderComponent,
        };

        this.rowSelection = "single";

        this.components = {
            datePicker: getDatePicker(),
        };

        this.loadingOverlayComponent = "customLoadingOverlay";

        this.loadingOverlayComponentParams = {
            loadingMessage: "One moment please...",
        };
    }

    rowResponse = [];

    url = "../../../assets/selectize/dist/js/standalone/selectize.js";
    loadAPI: any;

    onColumnResized(params: any) {
        if (params.finished == true) {
            let width = params.columns[0].actualWidth;
            let colId = params.columns[0].colId;
            this.storeColumnResizeValue(width, colId);
        }
    }

    storeColumnResizeValue(width, colId) {
        let cid = colId.replace('/"/g', "");
        let params = {
            userId: this.sessionHandlerService.getSession("userObj").userId,
            deptid: this.decryptedDepartmentId,
            ViewID: 1,
            colId: cid,
            config: "{'width':" + width + "}", // or "{'sequence':1}"
        };

        this.saleslog.updateViewColumnOptions(params).subscribe(() => {
           this.signalRService.BroadcastLiveSheetData();
        });
    }

    ngOnInit() {
        this.dateTimeCalculation();

        /*Start connection to grid data*/
        this.signalRService.startConnection();
        this.addBroadcastLiveSheetDataForViewsListener();
        /*----------------------------*/
    }

    onAsyncUpdate() {
        var api = this.gridApi;

        for (var i = 0; i < this.rowData.length; i++) {
            // console.log("i:", i);
            var itemToUpdate = this.rowData[i];
            var newItem = copyObject(itemToUpdate);
            // console.log(newItem);
            api.applyTransactionAsync({ update: [itemToUpdate] });
        }
        function copyObject(object) {
            var newObject = {};
            Object.keys(object).forEach(function (key) {
                newObject[key] = object[key];
            });
            return newObject;
        }
    }

    public addBroadcastLiveSheetDataForViewsListener = () => {
        this.signalRService.hubConnection.on("TransferLiveSheetData", () => {
            if (this.dateFilterApplied === 0) {
                this.generateGrid();
            } else if (this.dateFilterApplied === 1) {
                this.generateGrid(1, this.sliderItem.replace(" ", "_"));
            } else {
                this.generateGrid(
                    this.monthSelected,
                    moment(this.monthActive + "-" + this.yearActive).format(
                        "MMM_YY"
                    )
                );
            }
        });
    };

    dateTimeCalculation() {
        this.calculatePreviousMonths();
        this.calculateUpcomingMonths();

        this.calculatePreviousYears();
        this.calculateUpcomingYears();

        this.yearCounter = 5;

        let month = moment().format("MMM");
        let year = moment().format("YYYY");
        let sliderMonth = moment().format("MMM YY");

        this.monthActive = month;
        this.monthSelected = "1";

        this.years.map((res) => {
            if (res.year === year) {
                this.yearActive = year;
                res.active = true;
            }
        });

        this.searchDate.map((res, index) => {
            if (res.month === sliderMonth) {
                this.sliderItem = res.month;
                this.sliderIndex = index;
            }
        });
    }

    dateFormatter(params) {
        return moment(params.value, "DD/MM/YYYY").format("yyyy-MM-DD"); // for datetime-local use yyyy-MM-DDThh:mm to format date from input , and use yyy-MM-DD format for date
    }

    dateTimeFormatter(params) {
        return moment(params.value, "DD/MM/YYYY").format("yyyy-MM-DDThh:mm"); // for datetime-local use yyyy-MM-DDThh:mm to format date from input , and use yyy-MM-DD format for date
    }

    public loadScript() {
        // console.log("preparing to load...");
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
        this.pageCounter = this.pageCounter + 1;
        this.gridApi.showLoadingOverlay();
      
        this.generateGrid();
    }

    departmentIDs: any[] = [];
    public departmentID: number = 0;

    renderDepartmentNameHeading() {
        let department = this.sessionHandlerService.getSession("userObj")
            .departmentAccess;
        this.departmentIDs = department;
        let count = 0;
        department = department.find((el) => {
            if (count === 0) {
                count++;
                this.departmentID = el.departmentId;
            }
            return (
                Number(el.departmentId) === Number(this.decryptedDepartmentId)
            );
        });
        this.departmentNameRendered = department.departmentName;
    }

    generateGrid(months?, date?) {
        if (this.rowData.length === 0) {
            this.gridApi.showLoadingOverlay();
        }
        let obj = {
            UserId: this.sessionHandlerService.getSession("userObj").userId,
            RoleId: this.sessionHandlerService.getSession("userObj").roleID,
            ViewId: 1,
            DeptId: this.decryptedDepartmentId,
            TillDate: date ? date : moment().format("MMM_YY"),
            PastMonths: months ? months : 1,
            ShowDeleted: null,
        };

        this.renderDepartmentNameHeading();

        this.saleslog.fetchAllRows(obj).subscribe((res) => {
            // console.log("Triggered");

            this.rowData = [];
            this.columnDefs = [];
            let rows = [];
            this.salesData = res;
            // this.salesData = res;
            this.monthObject.oneMonth = true;

            this.salesData.rowData.row.forEach((element, rowIndex) => {
                this.cellMap = new Object();
                let carryOver = element.isCarryOver;
                let rowIndexId = element.rowId;

                if (carryOver) {
                    this.carryOverUnits++;
                }
                this.cellData = [];
                element.cells.forEach((element1, index) => {
                    this.rowColor.push({
                        rowId: rowIndex,
                        colId: element1.colId,
                        color: "",
                    });
                    this.cellMap["rowId"] = rowIndexId;

                    if (element1.colCode === "OD") {
                        this.cellMap[element1.colId] = moment(
                            element1.currentCellValue
                        ).format("DD/MM/YYYY");

                        this.cellMap['"' + element1.colCode + '"'] = moment(
                            element1.currentCellValue
                        ).format("DD/MM/YYYY");
                    } else {
                        this.cellMap["" + element1.colId + ""] =
                            element1.currentCellValue;
                        this.cellMap['"' + element1.colCode + '"'] =
                            element1.currentCellValue;
                    }
                    if (element1.cellOptions.length > 0) {
                        this.cellMap["cellOptions_" + element1.colCode] =
                            element1.cellOptions;
                    }
                    this.cellMap["carryOver"] = carryOver;
                    this.cellMap["cellColor_" + element1.colCode] =
                        element1.cellColor;

                    if (index == element.cells.length - 1) {
                        this.cellData.push(this.cellMap);
                    }
                    index++;
                });

                let typeArray = [];
                if (
                    moment(this.cellData[0]['"OD"']).isBefore(
                        moment().format("DD-MMM-YY"),
                        "months"
                    )
                ) {
                    let time = moment().isSameOrAfter(
                        moment(this.cellData[0]['"ED"']).format("DD-MMM-YY"),
                        "months"
                    );
                    if (time) {
                        this.carryOverAmount =
                            this.carryOverAmount +
                            Number(this.cellData[0]['"VEHGRO"']);
                        typeArray.push("carryOver");
                    } else {
                        typeArray.push("sold");

                        this.soldUnits = this.soldUnits + 1;
                        this.soldAmount =
                            this.soldAmount +
                            Number(this.cellData[0]['"VEHGRO"']);
                    }
                } else {
                    typeArray.push("sold");

                    this.soldUnits = this.soldUnits + 1;
                    this.soldAmount =
                        this.soldAmount + Number(this.cellData[0]['"VEHGRO"']);
                }

                if (
                    moment().isSameOrBefore(
                        moment(this.cellData[0]['"ED"']).format("DD-MMM-YY"),
                        "months"
                    )
                ) {
                    typeArray.push("covered");

                    this.coveredUnits = this.coveredUnits + 1;
                    this.coveredAmount =
                        this.coveredAmount +
                        Number(this.cellData[0]['"VEHGRO"']);
                }

                if (this.cellData[0]['"AD"'] !== "") {
                    typeArray.push("delivered");

                    this.deliveredUnits = this.deliveredUnits + 1;
                    this.deliveredAmount =
                        this.deliveredAmount +
                        Number(this.cellData[0]['"VEHGRO"']);
                }
                this.cellData[0]["type"] = typeArray;
                // // console.log(this.cellData[0])
                rows.push(this.cellData[0]);
            });

            // // console.log(this.carryOverAmount, this.carryOverUnits,this.cellData[0] )
            // // console.log(this.soldAmount, this.soldUnits, )
            // // console.log(this.coveredAmount, this.coveredUnits, )
            // // console.log(this.deliveredAmount, this.deliveredUnits, )
            // // console.log(this.rowColor);

            this.carryOverAvg =
                this.carryOverUnits > 0
                    ? Number(this.carryOverAmount) / Number(this.carryOverUnits)
                    : 0;
            this.soldAvg =
                this.soldUnits > 0
                    ? Number(this.soldAmount) / Number(this.soldUnits)
                    : 0;
            this.coveredAvg =
                this.coveredUnits > 0
                    ? Number(this.coveredAmount) / Number(this.coveredUnits)
                    : 0;
            this.deliveredAvg =
                this.deliveredUnits > 0
                    ? Number(this.deliveredAmount) / Number(this.deliveredUnits)
                    : 0;

            let column = [];
            let count = 0;
            let rowIdcolumn = new Object();

            rowIdcolumn["headerName"] = ".";
            rowIdcolumn["colId"] = 0;
            rowIdcolumn["minWidth"] = 40;
            rowIdcolumn["maxWidth"] = 40;
            rowIdcolumn["cellClass"] = "row-no";
            rowIdcolumn["editable"] = true;
            rowIdcolumn["sequence"] = 0;
            rowIdcolumn["hide"] = false;
            rowIdcolumn["pinned"] = "left";
            rowIdcolumn["lockPinned"] = true;
            rowIdcolumn["filter"] = true;
            rowIdcolumn["lockPosition"] = true;
            rowIdcolumn["cellClass"] = function (params) {
                // console.log(params.data);
                return params.data.carryOver === true
                    ? "agClassCarryOver"
                    : "agClassNoCarryOver";
            };

            let carryOverCount = this.carryOverUnits;
            rowIdcolumn["valueGetter"] = function (params) {
                // // console.log(params.node.rowIndex, carryOverCount);
                if (params.data.carryOver === true) {
                    count = 0;
                    // // console.log(count);
                    return null;
                } else {
                    //i++;
                    if (params.node.rowIndex >= carryOverCount) {
                        return params.node.rowIndex + 1 - carryOverCount;
                    } else {
                        count++;
                        return count;
                    }
                }
            };

            column.push(rowIdcolumn);

            this.salesData.column.forEach((element) => {
                let columnMap = new Object();
                columnMap["headerName"] = element.colName;
                columnMap["field"] = "" + element.colId + "";
                columnMap["colId"] = element.colId;
                columnMap["colCode"] = element.colCode;

                columnMap["sequence"] = element.sequence;
                columnMap["resizable"] = true;
                columnMap["sortable"] = true;
                columnMap["filter"] = true;
                columnMap["hide"] = !element.display;
                columnMap["columnType"] = element.type;
                columnMap["width"] = element.colWidth;

                let required = element.required;
                columnMap["cellStyle"] = function (params) {
                    if (required && params.value === "") {
                        //mark police cells as red
                        return { backgroundColor: "red" };
                    } else {
                        return null;
                    }
                };

                if (element.type === "Date") {
                    columnMap["cellEditor"] = "datePicker";
                } else if (element.type === "DD-Fixed") {
                    columnMap["cellRenderer"] = "customDropDownRenderer";
                } else if (element.type === "DD-Self") {
                    columnMap["cellRenderer"] = "customDropDownRenderer";
                } else if (element.type === "DD-Suggest") {
                    columnMap["cellRenderer"] = "customDropDownRenderer";
                } else if (element.type === "Combo") {
                    columnMap["cellRenderer"] = "dropDownRenderer";
                } else {
                    // columnMap["onCellValueChanged"] = this.onCellChanged();
                }

                column.push(columnMap);
            });

            column.sort(function (a, b) {
                return a.sequence - b.sequence;
            });

            // if(!months){
            this.columnDefs = column;
            // console.log("columns::::", column);
            this.rowData = rows;
            this.rowResponse = rows;
            // }
            // this.onAsyncUpdate();
            this.gridApi.sizeColumnsToFit();
        });
    }

    onCellChanged(event) {
        if (event.newValue === undefined) {
            event.newValue = "";
        }
        console.log(event);
        if (
            event.newValue ||
            event.newValue === "" ||
            event.newValue === null
        ) {
            let params = {
                userid: this.sessionHandlerService.getSession("userObj").userId,
                EntryId: event.data.rowId, // Parent ID of the row for which cell he is editing
                ViewID: 1,
                colId: event.colDef.colId,
                ColType: event.colDef.columnType, // You need to send the column type
                Value: event.newValue,
            };
            this.saleslog.insertCellValue(params).subscribe(() => {
                // this.toastNotification.generateToast('Update successful', 'OK', 2000);
                this.signalRService.BroadcastLiveSheetData();
            });
        }
    }

    gridFilter(months?, date?, searchValue?) {
        this.gridApi.showLoadingOverlay();

        let obj = {
            UserId: this.sessionHandlerService.getSession("userObj").userId,
            RoleId: this.sessionHandlerService.getSession("userObj").roleID,
            ViewId: 1,
            DeptId: this.decryptedDepartmentId,
            TillDate: date ? date : moment().format("MMM_YY"),
            PastMonths: months ? months : 1,
            ShowDeleted: this.searchForm.get("deletedRecords").value
                ? this.searchForm.get("deletedRecords").value
                : null,
        };

        this.saleslog.fetchAllRows(obj).subscribe((res) => {
            this.rowResponse = [];
            this.salesData = [];
            // this.salesData = res;
            this.salesData = res;

            let rows = [];
            this.monthObject.oneMonth = true;

            this.salesData.rowData.row.forEach((element) => {
                this.cellMap = new Object();
                let carryOver = element.isCarryOver;

                if (carryOver) {
                    this.carryOverUnits++;
                }

                this.cellData = [];
                let index = 0;

                element.cells.forEach((element1) => {
                    this.cellMap["" + element1.colId + ""] =
                        element1.currentCellValue;
                    if (element1.colCode === "OD") {
                        this.cellMap["" + element1.colId + ""] = moment(
                            element1.currentCellValue
                        ).format("DD/MM/YYYY");
                        this.cellMap['"' + element1.colCode + '"'] = moment(
                            element1.currentCellValue
                        ).format("DD/MM/YYYY");
                        // console.log(this.cellMap['"' + element1.colCode + '"']);
                    } else {
                        this.cellMap["" + element1.colId + ""] =
                            element1.currentCellValue;
                        this.cellMap['"' + element1.colCode + '"'] =
                            element1.currentCellValue;
                    }
                    if (element1.cellOptions.length > 0) {
                        this.cellMap["cellOptions_" + element1.colCode] =
                            element1.cellOptions;
                    }
                    this.cellMap["carryOver"] = carryOver;

                    if (index == element.cells.length - 1) {
                        this.cellData.push(this.cellMap);
                    }
                    index++;
                });

                let typeArray = [];

                if (
                    moment(this.cellData[0]['"OD"']).isBefore(
                        moment().format("DD-MMM-YY"),
                        "months"
                    )
                ) {
                    let time = moment().isSameOrAfter(
                        moment(this.cellData[0]['"ED"']).format("DD-MMM-YY"),
                        "months"
                    );
                    if (time) {
                        this.carryOverAmount =
                            this.carryOverAmount +
                            Number(this.cellData[0]['"VEHGRO"']);
                        typeArray.push("carryOver");
                    } else {
                        typeArray.push("sold");

                        this.soldUnits = this.soldUnits + 1;
                        this.soldAmount =
                            this.soldAmount +
                            Number(this.cellData[0]['"VEHGRO"']);
                    }
                } else {
                    typeArray.push("sold");

                    this.soldUnits = this.soldUnits + 1;
                    this.soldAmount =
                        this.soldAmount + Number(this.cellData[0]['"VEHGRO"']);
                }

                if (
                    moment().isSameOrBefore(
                        moment(this.cellData[0]['"ED"']).format("DD-MMM-YY"),
                        "months"
                    )
                ) {
                    typeArray.push("covered");

                    this.coveredUnits = this.coveredUnits + 1;
                    this.coveredAmount =
                        this.coveredAmount +
                        Number(this.cellData[0]['"VEHGRO"']);
                }

                if (this.cellData[0]['"AD"'] !== "") {
                    typeArray.push("delivered");

                    this.deliveredUnits = this.deliveredUnits + 1;
                    this.deliveredAmount =
                        this.deliveredAmount +
                        Number(this.cellData[0]['"VEHGRO"']);
                }
                this.cellData[0]["type"] = typeArray;
                rows.push(this.cellData[0]);
            });

            this.rowResponse = rows;

            // console.log(this.cellData);
            // // console.log(this.soldAmount, this.soldUnits, )
            // // console.log(this.coveredAmount, this.coveredUnits, )
            // // console.log(this.deliveredAmount, this.deliveredUnits, )

            this.carryOverAvg =
                this.carryOverUnits > 0
                    ? Number(this.carryOverAmount) / Number(this.carryOverUnits)
                    : 0;
            this.soldAvg =
                this.soldUnits > 0
                    ? Number(this.soldAmount) / Number(this.soldUnits)
                    : 0;
            this.coveredAvg =
                this.coveredUnits > 0
                    ? Number(this.coveredAmount) / Number(this.coveredUnits)
                    : 0;
            this.deliveredAvg =
                this.deliveredUnits > 0
                    ? Number(this.deliveredAmount) / Number(this.deliveredUnits)
                    : 0;

            // // console.log(rows);
            let searchResult = rows.filter((resp) => {
                let payType = resp['"PT"'];
                let financeManager = resp['"FM"'];
                let email = resp['"EM"'];
                let dept = resp['"Dept"'];

                return (
                    (email &&
                        email
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())) ||
                    (dept &&
                        dept
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())) ||
                    (payType &&
                        payType
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())) ||
                    (financeManager &&
                        financeManager
                            .toLowerCase()
                            .includes(searchValue.toLowerCase()))
                );
            });

            /*Dispaly search results in grid row array and number of display records found*/
            this.displaySearchResult(searchResult);
            /*-------------------------*/
        });
    }

    displaySearchResult(searchResult) {
        this.records = this.rowData;
        this.rowData = [];
        this.rowData = searchResult;
        // console.log(this.rowResponse);
        this.toastHandlerService.generateToast(
            searchResult.length + " Record found",
            "",
            2000
        );
    }

    methodFromParent(cell) {
        alert("Parent Component Method from " + cell + "!");
    }

    getClassRules(params, color) {
        let thisRef = params.context.thisComponent;
        let currentRow = thisRef.rowColor.find(
            (el) =>
                el.rowId === params.rowIndex &&
                el.colId === params.column.userProvidedColDef.colId
        );

        return currentRow !== undefined ? currentRow.color === color : "";
    }

    getStatusColor(params) {
        // // console.log(params);
        if (params.value) {
            switch (params.value) {
                case "status":
                    return true;
                    break;
                case "status":
                    return true;
                    break;
                case "status":
                    return true;
                    break;
                default:
                    break;
            }
        }
    }

    search() {
        let searchVal = this.searchForm.get("searchbar").value;
        let previousMonthFilter = this.searchForm.get("previousMonth").value;
        let currentMonthFilter = this.searchForm.get("currentMonth").value;

        let searchResult = [];
        // console.log(this.rowResponse);

        if (
            this.searchForm.get("searchbar").value !== "" &&
            currentMonthFilter !== false
        ) {
            if (this.monthObject.oneMonth) {
                searchResult = this.rowResponse.filter((resp) => {
                    let orderDate = resp['"OD"'];
                    let payType = resp['"PT"'];
                    let financeManager = resp['"FM"'];
                    let email = resp['"EM"'];
                    let dept = resp['"Dept"'];
                    // console.log(resp['"OD"'], resp['"EM"']);
                    // console.log(email, searchVal);
                    return (
                        moment(orderDate).isSame(moment()) &&
                        ((email &&
                            email
                                .toLowerCase()
                                .includes(searchVal.toLowerCase())) ||
                            (dept &&
                                dept
                                    .toLowerCase()
                                    .includes(searchVal.toLowerCase())) ||
                            (payType &&
                                payType
                                    .toLowerCase()
                                    .includes(searchVal.toLowerCase())) ||
                            (financeManager &&
                                financeManager
                                    .toLowerCase()
                                    .includes(searchVal.toLowerCase())))
                    );
                });

                /*Dispaly search results in grid row array and number of display records found*/
                this.displaySearchResult(searchResult);
                /*-------------------------*/
            } else {
                let month = moment().format("MMM_YY");
                this.gridFilter(previousMonthFilter, month, searchVal);
                this.monthObject.reset();
                this.monthObject.oneMonth = true;
            }
        } else if (
            this.searchForm.get("searchbar").value !== "" &&
            previousMonthFilter !== ""
        ) {
            if (previousMonthFilter === "3") {
                if (this.monthObject.threeMonth) {
                    searchResult = this.searchSalesLog(
                        searchResult,
                        previousMonthFilter,
                        searchVal
                    );

                    /*Dispaly search results in grid row array and number of display records found*/
                    this.displaySearchResult(searchResult);
                    /*-------------------------*/
                } else {
                    let month = moment().format("MMM_YY");
                    this.gridFilter(previousMonthFilter, month, searchVal);
                    this.monthObject.reset();
                    this.monthObject.threeMonth = true;
                }
            } else if (previousMonthFilter === "6") {
                if (this.monthObject.sixMonth) {
                    searchResult = this.searchSalesLog(
                        searchResult,
                        previousMonthFilter,
                        searchVal
                    );

                    /*Dispaly search results in grid row array and number of display records found*/
                    this.displaySearchResult(searchResult);
                    /*-------------------------*/
                } else {
                    let month = moment().format("MMM_YY");
                    this.gridFilter(previousMonthFilter, month, searchVal);
                    this.monthObject.reset();
                    this.monthObject.sixMonth = true;
                }
            } else if (previousMonthFilter === "12") {
                if (this.monthObject.twelveMonth) {
                    searchResult = this.searchSalesLog(
                        searchResult,
                        previousMonthFilter,
                        searchVal
                    );

                    /*Dispaly search results in grid row array and number of display records found*/
                    this.displaySearchResult(searchResult);
                    /*-------------------------*/
                } else {
                    let month = moment().format("MMM_YY");
                    this.gridFilter(previousMonthFilter, month, searchVal);
                    this.monthObject.reset();
                    this.monthObject.twelveMonth = true;
                }
            } else {
                if (this.monthObject.allMonth) {
                    searchResult = this.searchSalesLog(
                        searchResult,
                        previousMonthFilter,
                        searchVal
                    );

                    /*Dispaly search results in grid row array and number of display records found*/
                    this.displaySearchResult(searchResult);
                    /*-------------------------*/
                } else {
                    let month = moment().format("MMM_YY");
                    this.gridFilter(-1, month, searchVal);
                    this.monthObject.reset();
                    this.monthObject.allMonth = true;
                }
            }
        } else {
            if (this.searchForm.get("searchbar").value !== "") {
                searchResult = this.rowResponse.filter((resp) => {
                    let filter = Object.keys(resp).filter(
                        (res) => resp[res].toLowerCase() === searchVal
                    );
                    if (filter.length > 0) {
                        return resp;
                    }
                });

                /*Dispaly search results in grid row array and number of display records found*/
                this.displaySearchResult(searchResult);
                /*-------------------------*/
            }
        }
    }

    searchSalesLog(searchResult, previousMonthFilter, searchVal) {
        let searchedDate = moment()
            .subtract(Number(previousMonthFilter) + 1, "months")
            .format("MMM-YYYY");
        return (searchResult = this.rowResponse.filter((resp) => {
            let endDate = moment().format("MMM-YYYY");
            let orderDate = resp['"OD"'];
            let payType = resp['"PT"'];
            let financeManager = resp['"FM"'];
            let email = resp['"EM"'];
            let dept = resp['"Dept"'];

            // console.log(
            //     email,
            //     searchVal,
            //     email && email.toLowerCase().includes(searchVal.toLowerCase())
            // );
            // console.log(
            //     moment(orderDate).isAfter(searchedDate) &&
            //         moment(orderDate).isBefore(endDate)
            // );

            if (previousMonthFilter !== "all") {
                return (
                    moment(orderDate).isAfter(searchedDate) &&
                    moment(orderDate).isBefore(endDate) &&
                    ((email &&
                        email
                            .toLowerCase()
                            .includes(searchVal.toLowerCase())) ||
                        (dept &&
                            dept
                                .toLowerCase()
                                .includes(searchVal.toLowerCase())) ||
                        (payType &&
                            payType
                                .toLowerCase()
                                .includes(searchVal.toLowerCase())) ||
                        (financeManager &&
                            financeManager
                                .toLowerCase()
                                .includes(searchVal.toLowerCase())))
                );
            } else {
                return (
                    (email &&
                        email
                            .toLowerCase()
                            .includes(searchVal.toLowerCase())) ||
                    (dept &&
                        dept.toLowerCase().includes(searchVal.toLowerCase())) ||
                    (payType &&
                        payType
                            .toLowerCase()
                            .includes(searchVal.toLowerCase())) ||
                    (financeManager &&
                        financeManager
                            .toLowerCase()
                            .includes(searchVal.toLowerCase()))
                );
            }
            // datefilter = Object.keys(resp).filter(res=> {
            //   // if(res !=="" && isNaN(Number(resp[res]))){
            //   //   // console.log(resp[res], Number(resp[res]))
            //   //   return resp[res].toLowerCase()=== searchVal;
            //   // }
            // });
            // if(datefilter.length> 0){
            //   return resp;
            // }
        }));
    }

    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }

    filterGrid(option) {
        // If filter matches change active state of columns*/
        if (option === 0) {
            let row = this.rowResponse.filter((res) => {
                return res.type.find((el) => el === "carryOver");
            });
            // console.log(this.rowResponse, row);
            if (row.length > 0) {
                this.rowData = [];
                this.rowData = row;
                this.toastHandlerService.generateToast(
                    "1 filter applied",
                    "Clear",
                    null
                );
            }
        } else if (option === 1) {
            let row = this.rowResponse.filter((res) => {
                // // console.log(res.type);
                return res.type.find((el) => el === "sold");
            });
            if (row.length > 0) {
                this.rowData = [];
                this.rowData = row;
                this.toastHandlerService.generateToast(
                    "1 filter applied",
                    "Clear",
                    null
                );
            }
        } else if (option === 2) {
            let row = this.rowResponse.filter((res) => {
                // // console.log(res.type);
                return res.type.find((el) => el === "covered");
            });
            if (row.length > 0) {
                this.rowData = [];
                this.rowData = row;
                this.toastHandlerService.generateToast(
                    "1 filter applied",
                    "Clear",
                    null
                );
            }
        } else if (option === 3) {
            let row = this.rowResponse.filter((res) => {
                // // console.log(res.type);
                return res.type.find((el) => el === "delivered");
            });
            if (row.length > 0) {
                this.rowData = [];
                this.rowData = row;
                this.toastHandlerService.generateToast(
                    "1 filter applied",
                    "Clear",
                    null
                );
            }
        }
    }

    calenderSearch(searchingFormat, month, startingMonth) {
        // console.log(searchingFormat, startingMonth);
        let searchResult = [];

        searchResult = this.rowData.filter((resp) => {
            let filter = Object.keys(resp).filter((res) => {
                if (res === "orderDate") {
                    let date = resp[res];
                    if (month === 1) {
                        if (date) {
                            return (
                                moment(resp[res]).isSame(
                                    searchingFormat,
                                    "months"
                                ) &&
                                moment(resp[res]).isSame(
                                    searchingFormat,
                                    "years"
                                )
                            );
                        }
                    } else {
                        return (
                            moment(resp[res]).isAfter(searchingFormat) &&
                            moment(resp[res]).isBefore(startingMonth)
                        );
                    }
                    // console.log(
                    //     date,
                    //     searchingFormat,
                    //     moment(resp[res]).isAfter(searchingFormat)
                    // );
                }
            });
            if (filter.length > 0) {
                return resp;
            }
        });
        this.rowData = [];
        this.rowData = searchResult;
        if (searchResult.length > 0) {
            let text = searchResult.length > 1 ? "Records" : "Record";
            this.toastHandlerService.generateToast(
                searchResult.length + " " + text + " found",
                "",
                2000
            );
        }
    }

    monthSliderSearch(searchingFormat) {
        // console.log(searchingFormat);
        let searchResult = [];

        this.monthFilter = searchingFormat + " - " + searchingFormat;

        searchResult = this.rowData.filter((resp) => {
            let filter = Object.keys(resp).filter((res) => {
                if (res === "orderDate") {
                    let date = moment(resp[res]).format("MMM YY");
                    if (date) {
                        return date === searchingFormat;
                    }
                }
            });
            if (filter.length > 0) {
                return resp;
            }
        });
        this.rowData = [];
        this.rowData = searchResult;
        if (searchResult.length > 0) {
            let text = searchResult.length > 1 ? "Records" : "Record";
            this.toastHandlerService.generateToast(
                searchResult.length + " " + text + " found",
                "",
                2000
            );
        }
    }

    previous() {
        if (this.yearCounter !== 0) {
            this.yearCounter = this.yearCounter - 1;
            let month = moment().format("MMM");
            let year = moment().format("YYYY");
            this.monthActive = "";
            this.years.map((res) => {
                res.active = false;
            });

            this.years.map((res, index) => {
                if (index === this.yearCounter) {
                    this.yearActive = res.year;
                    if (res.year === year) {
                        this.monthActive = month;
                    }
                    res.active = true;
                }
            });
        }
    }

    next() {
        if (this.yearCounter < this.years.length - 1) {
            this.yearCounter = this.yearCounter + 1;
            let month = moment().format("MMM");
            let year = moment().format("YYYY");
            this.monthActive = "";

            this.years.map((res) => {
                res.active = false;
            });

            this.years.map((res, index) => {
                if (index === this.yearCounter) {
                    this.yearActive = res.year;
                    if (res.year === year) {
                        this.monthActive = month;
                    }
                    res.active = true;
                }
            });
        }
    }

    selectMonth(month) {
        this.monthActive = month;
    }

    currentMonth() {
        if (this.searchForm.get("previousMonth").value !== "") {
            this.searchForm.get("previousMonth").setValue("");
        }
    }

    previousMonth() {
        if (this.searchForm.get("currentMonth").value === true) {
            this.searchForm.get("currentMonth").setValue(false);
        }
    }

    resetSearch() {
        this.monthFilter = "";
        this.rowData = this.rowResponse;
    }

    applyCalenderFilter() {
        // console.log(this.monthSelected);
        this.monthModal = false;
        this.generateFilter(this.monthSelected);
    }

    generateFilter(length) {
        /*Generate Key and value for startFrom Object from momentJs*/
        let currentDisplayFormat;
        let searchedDisplayFormat;
        let searchingFormat;
        let currentSearchFormat;
        let month = 0;

        if (length !== "1") {
            month = 0;
            searchingFormat = moment(this.monthActive + "-" + this.yearActive)
                .subtract(length - 1, "months")
                .format("MMM-YYYY");
            currentDisplayFormat = moment(
                this.monthActive + "-" + this.yearActive
            ).format("MMM YY");
            currentSearchFormat = moment(
                this.monthActive + "-" + this.yearActive
            ).format("MMM-YYYY");
            searchedDisplayFormat = moment(
                this.monthActive + "-" + this.yearActive
            )
                .subtract(length - 1, "months")
                .format("MMM YY");
        } else {
            month = 1;
            searchingFormat = moment(this.monthActive + "-" + this.yearActive)
                .subtract(length - 1, "months")
                .format("MMM-YYYY");
            currentDisplayFormat = moment(
                this.monthActive + "-" + this.yearActive
            ).format("MMM YY");
            searchedDisplayFormat = moment(
                this.monthActive + "-" + this.yearActive
            )
                .subtract(length - 1, "months")
                .format("MMM YY");
        }
        /*---------------------------------------------------------*/
        this.monthFilter = searchedDisplayFormat + " - " + currentDisplayFormat;

        this.calenderSearch(searchingFormat, month, currentSearchFormat);
    }

    cancelMonthModal() {
        this.monthModal = false;
    }

    formatNumber(params) {
        if (params.colDef.type === "number") {
            return (
                "$" +
                Math.floor(params.value)
                    .toString()
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
            );
        }
    }

    cellEditorSelector(params) {
        // console.log(params.colDef.type);

        if (params.colDef.type === "number") {
            return false;
        } else if (params.colDef.type === "date") {
            return {
                component: "datePicker",
            };
        } else if (params.colDef.type === "text") {
            return {
                component: "agSelectCellEditor",
            };
        } else if (params.colDef.type === "drop down") {
            switch (params.colDef.field) {
                case "status":
                    return {
                        component: "agSelectCellEditor",
                        params: {
                            values: this.statusOption,
                        },
                    };
                    break;
                case "pay":
                    return {
                        component: "agSelectCellEditor",
                        params: {
                            values: this.payOptions,
                        },
                    };
                    break;
                case "sales_eng":
                    return {
                        component: "agSelectCellEditor",
                        params: {
                            values: this.salesEngOption,
                        },
                    };
                    break;
                case "sales_person":
                    return {
                        component: "agSelectCellEditor",
                        params: {
                            values: this.salesPersonOption,
                        },
                    };
                    break;
                case "aftermarket_manager":
                    return {
                        component: "agSelectCellEditor",
                        params: {
                            values: this.afterMarketManagerOptions,
                        },
                    };
                    break;
                case "finance_manager":
                    return {
                        component: "agSelectCellEditor",
                        params: {
                            values: this.financeManagerOption,
                        },
                    };
                default:
                    break;
            }
        }
        return false;
    }

    toggleShowDiv(divName: string) {
        if (divName === "divA") {
            if (this.animationState === "in") {
                this.searchForm.get("searchbar").setValue("");
                this.rowData = this.rowResponse;
            }
            this.animationState = this.animationState === "out" ? "in" : "out";
        }
    }

    getMainMenuItems(params) {
        let column = params.column.colDef;
        let thisRef = params.context.thisComponent;

        var menuItems = [];
        menuItems.push({
            name: "Pin Column",
            disabled: true,
            icon: createFlagImg("pin"),
            cssClasses: ["header-option-heading"],
        });
        menuItems.push("separator");
        menuItems.push({
            name: "Pin Left",
            action: function () {
                thisRef.gridColumnApi.setColumnPinned(column.colId, "left");
            },
            icon: createFlagImg("arrow-right"),
            cssClasses: [""],
        });
        menuItems.push("separator");
        menuItems.push({
            name: "No Pin",
            action: function () {
                thisRef.gridColumnApi.setColumnPinned(column.colId, null);
            },
            icon: createFlagImg("arrow-right"),
            cssClasses: [""],
        });
        menuItems.push("separator");
        menuItems.push({
            name: "Sort Data",
            disabled: true,
            icon: createFlagImg("sort"),
            cssClasses: ["header-option-heading"],
        });
        menuItems.push("separator");
        menuItems.push({
            name: "Oldest to Newest",
            action: function () {
                var sort = [
                    {
                        colId: column.colId,
                        sort: "aesc",
                    },
                ];
                thisRef.gridApi.setSortModel(sort);
            },
            icon: createFlagImg("arrow-right"),
        });
        menuItems.push("separator");
        menuItems.push({
            name: "Newest to Oldest",
            action: function () {
                var sort = [
                    {
                        colId: column.colId,
                        sort: "desc",
                    },
                ];
                thisRef.gridApi.setSortModel(sort);
            },
            icon: createFlagImg("arrow-right"),
        });
        menuItems.push("separator");
        menuItems.push({
            name: "Default settings",
            action: function () {},
            icon: createFlagImg("arrow-right"),
        });
        return menuItems;
    }

    calculatePreviousMonths() {
        for (let i = 4; i > 0; i--) {
            /*Generate Key and value for startFrom Object from momentJs*/
            let month = moment().subtract(i, "months").format("MMM YY");
            /*---------------------------------------------------------*/

            this.searchDate.push({
                month: month,
            });
        }
    }

    openCalenderPopup() {
        this.monthModal = !this.monthModal;
    }

    calculateUpcomingMonths() {
        for (let i = 0; i <= 4; i++) {
            /*Generate Key and value for startFrom Object from momentJs*/
            let month = moment().add(i, "months").format("MMM YY");

            this.searchDate.push({
                month: month,
            });
        }
    }

    calculatePreviousYears() {
        for (let i = 5; i > 0; i--) {
            /*Generate Key and value for startFrom Object from momentJs*/
            let year = moment().subtract(i, "years").format("YYYY");
            /*---------------------------------------------------------*/

            this.years.push({
                year: year,
                active: false,
            });
        }
    }

    calculateUpcomingYears() {
        for (let i = 0; i <= 2; i++) {
            /*Generate Key and value for startFrom Object from momentJs*/
            let year = moment().add(i, "years").format("YYYY");

            this.years.push({
                year: year,
                active: false,
            });
        }
    }

    onChangeDate() {
        this.gridApi.redrawRows();
    }

    getContextMenuItems(params) {
        let thisRef = params.context.thisComponent;
        var result = [
            {
                name: "CELL OPTIONS",
                disabled: true,
                cssClasses: ["cell-option-heading"],
            },
            "separator",
            "copy",
            "separator",
            "paste",
            "separator",
            {
                name: "History",
                subMenu: [
                    {
                        name: "Only this cell",
                        action: function () {
                            // console.log(params);
                            thisRef.openModal(
                                thisRef,
                                HistoryComponent,
                                "1000px",
                                {
                                    option: 2,
                                    colId: Number(params.column.colId),
                                    entryId: params.node.rowIndex,
                                }
                            );
                        },
                        icon: createFlagImg("bookmark"),
                    },
                    {
                        name: "Show All",
                        action: function () {
                            // console.log(params.column.colId);
                            // console.log(params.node.rowIndex);
                            thisRef.openModal(
                                thisRef,
                                HistoryComponent,
                                "1000px",
                                {
                                    option: 1,
                                    colId: Number(params.column.colId),
                                    entryId: params.node.rowIndex,
                                }
                            );
                        },
                        icon: createFlagImg("bookmark"),
                    },
                ],
                icon: createFlagImg("bookmark"),
            },
            "separator",
            {
                name: "DEAL OPTIONS",
                disabled: true,
                cssClasses: ["deal-heading"],
            },
            "separator",
            {
                name: "DUPLICATE - Entire Record",
                action: function () {
                    var newItems = [params.node.data];
                    // // console.log(params);
                    thisRef.duplicateRow(newItems, params.node.rowIndex);
                    // thisRef.gridApi.applyTransaction({ add: newItems });
                },
                icon: createFlagImg("plus"),
            },
            "separator",
            {
                name: "DELETE - Entire Record",
                action: thisRef.onRemoveSelected.bind(thisRef),
                icon: createFlagImg("close"),
            },
            {
                name: "COLOR TAB CELLS",
                disabled: true,
                cssClasses: ["color-tab-heading"],
                icon: "",
            },
            "separator",
            {
                name: "BLUE",
                action: function () {
                    let color = "";
                    thisRef.rowColor.map((el) => {
                        if (el.rowId === params.node.rowIndex) {
                            el.color = "blue";
                            color = el.color;
                            el.colId = params.column.userProvidedColDef.colId;
                        }
                    });
                    let rows = [];
                    rows.push(
                        thisRef.gridApi.getDisplayedRowAtIndex(
                            params.node.rowIndex
                        )
                    );
                    thisRef.updateCellColor(params.node.rowIndex, "blue");
                    thisRef.gridApi.redrawRows();
                },
                icon: createFlagImg("blue-color"),
                cssClasses: ["pointer"],
            },
            {
                name: "GREEN",
                action: function () {
                    let color = "";
                    thisRef.rowColor.map((el) => {
                        if (el.rowId === params.node.rowIndex) {
                            color = el.color;
                            el.color = "green";
                            el.colId = params.column.userProvidedColDef.colId;
                        }
                    });
                    let rows = [];
                    rows.push(
                        thisRef.gridApi.getDisplayedRowAtIndex(
                            params.node.rowIndex
                        )
                    );
                    thisRef.updateCellColor(params.node.rowIndex, "green");
                    thisRef.gridApi.redrawRows();
                },
                icon: createFlagImg("green-color"),
                cssClasses: ["pointer"],
            },
            {
                name: "YELLOW",
                action: function () {
                    let color = "";
                    thisRef.rowColor.map((el) => {
                        if (el.rowId === params.node.rowIndex) {
                            color = el.color;
                            el.color = "yellow";
                            el.colId = params.column.userProvidedColDef.colId;
                        }
                    });
                    let rows = [];
                    rows.push(
                        thisRef.gridApi.getDisplayedRowAtIndex(
                            params.node.rowIndex
                        )
                    );
                    thisRef.updateCellColor(params.node.rowIndex, "yellow");
                    thisRef.gridApi.redrawRows();
                },
                icon: createFlagImg("yellow-color"),
                cssClasses: ["pointer"],
            },
            {
                name: "RED",
                action: function () {
                    let color = "";
                    thisRef.rowColor.map((el) => {
                        if (el.rowId === params.node.rowIndex) {
                            color = el.color;
                            el.color = "red";
                            el.colId = params.column.userProvidedColDef.colId;
                        }
                    });
                    let rows = [];
                    rows.push(
                        thisRef.gridApi.getDisplayedRowAtIndex(
                            params.node.rowIndex
                        )
                    );
                    thisRef.updateCellColor(params.node.rowIndex, "red");
                    thisRef.gridApi.redrawRows();
                },
                icon: createFlagImg("red-color"),
                cssClasses: ["pointer"],
            },
            {
                name: "PURPLE",
                action: function () {
                    let color = "";
                    thisRef.rowColor.map((el) => {
                        if (el.rowId === params.node.rowIndex) {
                            color = el.color;
                            el.color = "purple";
                            el.colId = params.column.userProvidedColDef.colId;
                        }
                    });
                    let rows = [];
                    rows.push(
                        thisRef.gridApi.getDisplayedRowAtIndex(
                            params.node.rowIndex
                        )
                    );
                    thisRef.updateCellColor(params.node.rowIndex, "purple");
                    thisRef.gridApi.redrawRows();
                },
                icon: createFlagImg("purple-color"),
                cssClasses: ["pointer"],
            },
            {
                name: "Remove Tag",
                action: function () {
                    thisRef.rowColor.map((el) => {
                        if (el.rowId === params.node.rowIndex) {
                            el.color = "";
                            el.colId = params.column.userProvidedColDef.colId;
                        }
                    });
                    let rows = [];
                    rows.push(
                        thisRef.gridApi.getDisplayedRowAtIndex(
                            params.node.rowIndex
                        )
                    );
                    thisRef.removeCellColor();
                    thisRef.gridApi.redrawRows();
                },
                icon: createFlagImg("close"),
                cssClasses: ["pointer"],
            },
        ];
        return result;
    }

    openModal(thisRef, component, width, key?: any) {
        // console.log(key);
        thisRef.dialogRef = thisRef.dialog.open(component, {
            panelClass: "custom-dialog-container",
            width: width,
            data: {
                key: key,
            },
        });
        thisRef.dialogRef.afterClosed().subscribe((res) => {
            if (res && res.column) {
                if (res.column.length > 0) {
                    res.column.map((res) => {
                        let column = this.columnDefs.find(
                            (el) => el.headerName === res.columnName
                        );
                        if (column !== undefined) {
                            this.gridColumnApi.setColumnVisible(
                                column.colId,
                                res.display
                            );
                        }
                    });
                }
                setTimeout(() => {
                    this.gridApi.refreshView();
                    this.gridApi.sizeColumnsToFit();
                }, 0);
            }
        });
    }

    duplicateRow(newItems, index) {
        this.gridApi.showLoadingOverlay();

        let params = {
            EntryId: index + 1,
        };
        this.saleslog.duplicateRows(params).subscribe(() => {
            this.gridApi.hideOverlay();
            this.signalRService.BroadcastLiveSheetData();

            this.gridApi.applyTransaction({ add: newItems });
        });
    }

    removeCellColor() {
        let params = {
            EntryId: "",
        };
        this.saleslog.removeCellColor(params).subscribe(() => {
            this.signalRService.BroadcastLiveSheetDataForViews();
        });
    }

    deleteRow(index) {
        this.gridApi.showLoadingOverlay();
        let params = {
            EntryId: index + 1,
        };
        this.saleslog.deleteRows(params).subscribe(() => {
            this.signalRService.BroadcastLiveSheetDataForViews();
            this.gridApi.hideOverlay();
            this.toastHandlerService.generateToast(
                "Row Deleted Successfully",
                "",
                2000
            );
        });
    }

    updateCellColor(newItems?, color?) {
        let params = {
            EntryId: newItems,
            Code: "",
            valText: "",
            details: {
                color: color,
            },
        };
        this.saleslog.updateCellColor(params).subscribe(() => {
            this.signalRService.BroadcastLiveSheetData();
        });
    }

    selctedMonth(index) {
        this.searchDate.map((res, i) => {
            if (i === index) {
                this.sliderItem = res.month;
                this.sliderIndex = index;
            }
        });
        this.monthSliderSearch(this.sliderItem);
    }

    onRemoveSelected() {
        var selectedData = this.gridApi.getSelectedRows();
        var res = this.gridApi.applyTransaction({ remove: selectedData });

        if (res.remove.length > 0) {
            let index = res.remove[0].rowIndex;
            this.signalRService.BroadcastLiveSheetData();

            this.deleteRow(index);
        }
    }

    getRowData() {
        var rowData = [];
        this.gridApi.forEachNode(function (node) {
            rowData.push(node.data);
        });
    }

    addColumn() {
        this.dialogRef = this.dialog.open(NewDealComponent, {
            panelClass: "custom-dialog-container",
            width: "400px",
            data: {
                key: this.decryptedDepartmentId,
            },
        });
        this.dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.gridApi.applyTransaction({
                    add: [
                        {
                            orderDate: moment(res.date).format("DD-MMM-YY"),
                        },
                    ],
                });
            }
        });
    }

    onBtPrint() {
        var api = this.gridApi;
        this.setPrinterFriendly(api);
        let thisRef = this;
        setTimeout(function () {
            window.print();
            thisRef.setNormal(api);
        }, 2000);
    }

    setPrinterFriendly(api) {
        let eGridDiv: HTMLElement = document.getElementById(
            "myGrid"
        ) as HTMLElement;
        eGridDiv.style.height = "";

        api.setDomLayout("print");
    }
    setNormal(api) {
        let eGridDiv: HTMLElement = document.getElementById(
            "myGrid"
        ) as HTMLElement;
        eGridDiv.style.width = "100%";
        eGridDiv.style.height = "600px";

        api.setDomLayout(null);
    }

    excelExport() {
        this.openModal(this, ExcelExportComponent, "400px");
    }

    columnOption() {
        this.openModal(
            this,
            ColumnOptionComponent,
            "900px",
            this.decryptedDepartmentId
        );
    }

    print() {
        this.printdata = 1;
    }

    dateSetting(event) {
        this.monthActive = event.monthActive;
        this.yearActive = event.yearActive;
        this.monthFilter = event.monthFilter;
        this.monthSelected = event.monthSelected;
        this.sliderIndex = event.monthSelected;
        this.sliderItem = event.sliderItem;
        this.dateFilterApplied = event.option;

        if (this.dateFilterApplied === 0) {
            this.generateGrid();
        } else if (this.dateFilterApplied === 1) {
            this.generateGrid(1, this.sliderItem.replace(" ", "_"));
        } else {
            this.generateGrid(
                this.monthSelected,
                moment(this.monthActive + "-" + this.yearActive).format(
                    "MMM_YY"
                )
            );
        }
    }
}

function createFlagImg(flag) {
    return (
        '<img border="0" width="15px" height="10" src="./assets/icons/' +
        flag +
        '.png"/>'
    );
}

function getDatePicker() {
    function Datepicker() {}
    Datepicker.prototype.init = function (params) {
        this.eInput = document.createElement("input");
        this.eInput.value = params.value;
        this.eInput.classList.add("ag-input");
        this.eInput.style.height = "100%";
        this.eInput.style.width = "100%";

        $.datetimepicker.setLocale("en");
        $(this.eInput).datetimepicker({
            // mask:true,
            format: "m/d/Y",
            timepicker: false,
            inline: false,
        });
    };
    Datepicker.prototype.getGui = function () {
        return this.eInput;
    };
    Datepicker.prototype.afterGuiAttached = function () {
        this.eInput.focus();
        this.eInput.select();
    };
    Datepicker.prototype.getValue = function () {
        return this.eInput.value;
    };
    Datepicker.prototype.destroy = function () {};
    Datepicker.prototype.isPopup = function () {
        return false;
    };
    return Datepicker;
}
