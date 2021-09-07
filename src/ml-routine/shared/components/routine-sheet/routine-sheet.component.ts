import { CustomLoadingOverlayComponent } from "../../../saleslog/components/custom-loading-overlay/custom-loading-overlay.component";

import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { ToastHandlerService } from "app/shared/services/toast-handler.service";
import { MatDialog } from "@angular/material/dialog";
import { HistoryComponent } from "ml-routine/saleslog/components/history/history.component";
import { NewDealComponent } from "../new-deal/new-deal.component";

import { AllModules } from "@ag-grid-enterprise/all-modules";
import { CustomHeaderComponent } from "ml-routine/shared/components/custom-header/custom-header.component";
import { SlideInOutAnimation } from "app/shared/animation/animation";
import { FormBuilder, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { EncryptionService } from "app/shared/services/encryption.service";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CalenderRenderer } from "../../../saleslog/containers/saleslog/calander-renderer.component";
// import * as Selectize from '../../../../../node_modules/selectize/dist/js/standalone/selectize.js';

import { CustomDropDownRenderer } from "../../../saleslog/containers/saleslog/custom-dropdown-renderer.component";
import { DropDownRenderer } from "../../../saleslog/containers/saleslog/dropdown-renderer.component";
import { SaleslogService } from "ml-routine/shared/services/saleslog/saleslog.service";
import { LocalStorageHandlerService } from "app/shared/services/local-storage-handler.service";
import { SharedService } from "ml-setup/shared/services/shared/shared.service";
import { SignalRService } from "ml-setup/shared/services/signal-r/signal-r.service";
import { ColumnOptionComponent } from "../../../saleslog/components/column-option/column-option.component";
import { XlsExportComponent } from "../xls-export/xls-export.component";

declare var $: any;

@Component({
    selector: "app-routine-sheet",
    templateUrl: "./routine-sheet.component.html",
    styleUrls: ["./routine-sheet.component.scss"],
    animations: [SlideInOutAnimation],
})
export class RoutineSheetComponent implements OnInit {
    @ViewChild("myGrid", { static: true }) agGrid: ElementRef;
    printData: any;

    @Input()
    public routineSelected: number = 1;
    public totalRows: number = 0;
    public departmentID: number = -2;

    public vehicleProfit: number = 0;
    public processGross: number = 0;

    public processedAmount: number = -0;
    public processedUnits: number = 0;
    public processedAvg: number = 0;

    public varianceAmount: number = -0;
    public varianceUnits: number = 0;
    public varianceAvg: number = 0;

    public totalAmount: number = -0;
    public totalUnits: number = 0;
    public totalAvg: number = 0;

    public missingAmount: number = -0;
    public missingUnits: number = 0;
    public missingAvg: number = 0;

    public carryOverAmount: number = -0;
    public carryOverUnits: number = 0;
    public carryOverAvg: number = 0;

    public tradeinAmount: number = -0;
    public tradeinUnits: number = 0;
    public tradeinAvg: number = 0;

    public soldAmount: number = -0;
    public soldUnits: number = 0;
    public soldAvg: number = 0;

    public coveredAmount: number = -0;
    public coveredUnits: number = 0;
    public coveredAvg: number = 0;

    public deliveredAmount: number = -0;
    public deliveredUnits: number = 0;
    public deliveredAvg: number = 0;

    resetSummaryValues() {
        this.vehicleProfit = 0;
        this.processGross = 0;

        this.processedAmount = -0;
        this.processedUnits = 0;
        this.processedAvg = 0;

        this.varianceAmount = -0;
        this.varianceUnits = 0;
        this.varianceAvg = 0;

        this.totalAmount = -0;
        this.totalUnits = 0;
        this.totalAvg = 0;

        this.missingAmount = -0;
        this.missingUnits = 0;
        this.missingAvg = 0;

        this.carryOverAmount = -0;
        this.carryOverUnits = 0;
        this.carryOverAvg = 0;

        this.tradeinAmount = -0;
        this.tradeinUnits = 0;
        this.tradeinAvg = 0;

        this.soldAmount = -0;
        this.soldUnits = 0;
        this.soldAvg = 0;

        this.coveredAmount = -0;
        this.coveredUnits = 0;
        this.coveredAvg = 0;

        this.deliveredAmount = -0;
        this.deliveredUnits = 0;
        this.deliveredAvg = 0;
    }

    public modules: any[] = AllModules;
    public rowSelection;
    public thisComponent = this;
    public emptyFieldsCount: number = 0;
    public rowColor = [];

    dateFilterApplied: number = 0;
    selectedCity: number;
    departmentNameRendered: string = "";
    gridApi;
    gridColumnApi;

    departmentIDs: any[] = [];
    departmentName: string = "";

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
    statusOption: string[] = [];
    payOptions: string[] = [];
    salesEngOption: string[] = [];
    salesPersonOption: string[] = [];
    afterMarketManagerOptions: string[] = [];
    financeManagerOption: string[] = [];
    components;
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
        private LocalStorageHandlerService: LocalStorageHandlerService,
        public snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private encryptionService: EncryptionService,
        private saleslog: SaleslogService,
        private signalRService: SignalRService // private siteTargetSerivce: SiteTargetsService
    ) {
        this.route.paramMap.subscribe((params) => {
            this.decryptedDepartmentId =
                this.encryptionService.convertToEncOrDecFormat(
                    "decrypt",
                    params.get("id")
                );
            // console.log(this.decryptedDepartmentId);

            if (
                !this.decryptedDepartmentId ||
                this.decryptedDepartmentId == ""
            ) {
                this.decryptedDepartmentId = "-2";
            }

            if (this.pageCounter !== 0) {
                this.generateGrid();
            }
        });

        this.columnDefs = [];

        this.defaultColDef = {
            enterMovesDown: true,
            enterMovesDownAfterEdit: true,
            resizable: true,
            editable: true,
            filter: true,
            cellClass: "row-text-style",
            cellClassRules: {
                "green-mark-cell": function (params) {
                    let thisRef = params.context.thisComponent;
                    const firstFilter = thisRef.salesData.rowData.row.filter(
                        (x) =>
                            x.cells.some(
                                (y) =>
                                    y.entryId === params.node.data.rowId &&
                                    y.colId === params.colDef.colId
                            )
                    );

                    if (firstFilter.length > 0) {
                        const cellColor = firstFilter[0].cells.filter(
                            (y) =>
                                y.entryId === params.node.data.rowId &&
                                y.colId === params.colDef.colId
                        )[0].cellColor;
                        return cellColor !== undefined
                            ? cellColor === "green"
                            : false;
                    } else {
                        return false;
                    }
                },
                "blue-mark-cell": function (params) {
                    let thisRef = params.context.thisComponent;
                    const firstFilter = thisRef.salesData.rowData.row.filter(
                        (x) =>
                            x.cells.some(
                                (y) =>
                                    y.entryId === params.node.data.rowId &&
                                    y.colId === params.colDef.colId
                            )
                    );

                    if (firstFilter.length > 0) {
                        const cellColor = firstFilter[0].cells.filter(
                            (y) =>
                                y.entryId === params.node.data.rowId &&
                                y.colId === params.colDef.colId
                        )[0].cellColor;

                        return cellColor !== undefined
                            ? cellColor === "blue"
                            : false;
                    } else {
                        return false;
                    }
                },
                "purple-mark-cell": function (params) {
                    let thisRef = params.context.thisComponent;
                    const firstFilter = thisRef.salesData.rowData.row.filter(
                        (x) =>
                            x.cells.some(
                                (y) =>
                                    y.entryId === params.node.data.rowId &&
                                    y.colId === params.colDef.colId
                            )
                    );

                    if (firstFilter.length > 0) {
                        const cellColor = firstFilter[0].cells.filter(
                            (y) =>
                                y.entryId === params.node.data.rowId &&
                                y.colId === params.colDef.colId
                        )[0].cellColor;
                        return cellColor !== undefined
                            ? cellColor === "purple"
                            : false;
                    } else {
                        return false;
                    }
                },
                "yellow-mark-cell": function (params) {
                    let thisRef = params.context.thisComponent;
                    const firstFilter = thisRef.salesData.rowData.row.filter(
                        (x) =>
                            x.cells.some(
                                (y) =>
                                    y.entryId === params.node.data.rowId &&
                                    y.colId === params.colDef.colId
                            )
                    );

                    if (firstFilter.length > 0) {
                        const cellColor = firstFilter[0].cells.filter(
                            (y) =>
                                y.entryId === params.node.data.rowId &&
                                y.colId === params.colDef.colId
                        )[0].cellColor;
                        return cellColor !== undefined
                            ? cellColor === "yellow"
                            : false;
                    } else {
                        return false;
                    }
                },
                "red-mark-cell": function (params) {
                    let thisRef = params.context.thisComponent;
                    const firstFilter = thisRef.salesData.rowData.row.filter(
                        (x) =>
                            x.cells.some(
                                (y) =>
                                    y.entryId === params.node.data.rowId &&
                                    y.colId === params.colDef.colId
                            )
                    );

                    if (firstFilter.length > 0) {
                        const cellColor = firstFilter[0].cells.filter(
                            (y) =>
                                y.entryId === params.node.data.rowId &&
                                y.colId === params.colDef.colId
                        )[0].cellColor;
                        return cellColor !== undefined
                            ? cellColor === "red"
                            : false;
                    } else {
                        return false;
                    }
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
                        // // // // // console.log("after",params.data.orderDate,isAfter,"choice:",choice);
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
                        // // // // // console.log(params.data.orderDate);

                        return params.value === "" && choice;
                    } else {
                        return false;
                    }
                },
            },
            //   headerComponentParams: { menuIcon: "fa-chevron-down" },
            onCellValueChanged: this.onCellChanged.bind(this),
            minWidth: 200,
            // flex: 1,
            // filter: 'customFilter',
            menuTabs: ["filterMenuTab", "columnsMenuTab", "generalMenuTab"],
            // cellClassRules: {
            //   boldBorders: this.getCssRules.bind(this),
            // },
            //valueFormatter: this.formatNumber.bind(this),
            // maxWidth: 105,
        };

        this.autoGroupColumnDef = {
            initialWidth: 200,
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
            // dateEditor: OwlDatePickerComponent
        };

        this.rowSelection = "single";

        this.components = {
            //     // datePicker: getDatePicker(),
            dateEditor: getDatePicker(),
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
            userId: this.LocalStorageHandlerService.getFromStorage("userObj")
                .userId,
            deptid: this.decryptedDepartmentId
                ? this.decryptedDepartmentId
                : this.departmentID,
            ViewID: this.routineSelected,
            colId: cid,
            config: "{'width':" + width + "}", // or "{'sequence':1}"
        };

        if (cid !== 0) {
            this.saleslog.updateViewColumnOptions(params).subscribe(() => {
                this.signalRService.BroadcastLiveSheetData();
            });
        }
    }

    getContextMenuItems1(params) {
        var result = [
            {
                name: "Alert " + params.value,
                action: function () {
                    window.alert("Alerting about " + params.value);
                },
                cssClasses: ["redFont", "bold"],
            },
            {
                name: "Always Disabled",
                disabled: true,
                tooltip:
                    "Very long tooltip, did I mention that I am very long, well I am! Long!  Very Long!",
            },
            {
                name: "Country",
                subMenu: [
                    {
                        name: "Ireland",
                        action: function () {
                            // console.log("Ireland was pressed");
                        },
                        icon: createFlagImg("ie"),
                    },
                    {
                        name: "UK",
                        action: function () {
                            // console.log("UK was pressed");
                        },
                        icon: createFlagImg("gb"),
                    },
                    {
                        name: "France",
                        action: function () {
                            // console.log("France was pressed");
                        },
                        icon: createFlagImg("fr"),
                    },
                ],
            },
            {
                name: "Person",
                subMenu: [
                    {
                        name: "Niall",
                        action: function () {
                            // console.log("Niall was pressed");
                        },
                    },
                    {
                        name: "Sean",
                        action: function () {
                            // console.log("Sean was pressed");
                        },
                    },
                    {
                        name: "John",
                        action: function () {
                            // console.log("John was pressed");
                        },
                    },
                    {
                        name: "Alberto",
                        action: function () {
                            // console.log("Alberto was pressed");
                        },
                    },
                    {
                        name: "Tony",
                        action: function () {
                            // console.log("Tony was pressed");
                        },
                    },
                    {
                        name: "Andrew",
                        action: function () {
                            // console.log("Andrew was pressed");
                        },
                    },
                    {
                        name: "Kev",
                        action: function () {
                            // console.log("Kev was pressed");
                        },
                    },
                    {
                        name: "Will",
                        action: function () {
                            // console.log("Will was pressed");
                        },
                    },
                    {
                        name: "Armaan",
                        action: function () {
                            // console.log("Armaan was pressed");
                        },
                    },
                ],
            },
            "separator",
            {
                name: "Windows",
                shortcut: "Alt + W",
                action: function () {
                    // console.log("Windows Item Selected");
                },
                icon: '<img src="../images/skills/windows.png"/>',
            },
            {
                name: "Mac",
                shortcut: "Alt + M",
                action: function () {
                    // console.log("Mac Item Selected");
                },
                icon: '<img src="../images/skills/mac.png"/>',
            },
            "separator",
            {
                name: "Checked",
                checked: true,
                action: function () {
                    // console.log("Checked Selected");
                },
                icon: '<img src="../images/skills/mac.png"/>',
            },
            "copy",
            "separator",
            "chartRange",
        ];
        return result;
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
            // // // // console.log("i:", i);
            var itemToUpdate = this.rowData[i];
            // // // // console.log(newItem);
            api.applyTransactionAsync({ update: [itemToUpdate] });
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
        // // // // console.log("preparing to load...");
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

    renderDepartmentNameHeading() {}

    isValidDate(value) {
        var dateWrapper = new Date(value);
        return !isNaN(dateWrapper.getDate());
    }

    generateGrid(months?, date?) {
        if (this.routineSelected !== 3) {
            let department =
                this.LocalStorageHandlerService.getFromStorage(
                    "userObj"
                ).departmentAccess;
            this.departmentIDs = department;
            let count = 0;
            department = department.find((el) => {
                if (count === 0) {
                    count++;
                    this.departmentID = el.departmentId;
                }
                return (
                    Number(el.departmentId) ===
                    Number(this.decryptedDepartmentId)
                );
            });
            this.departmentName = department.departmentName;
        } else {
        }

        if (this.rowData.length === 0) {
            this.gridApi.showLoadingOverlay();
        }

        let obj = {
            UserId: this.LocalStorageHandlerService.getFromStorage("userObj")
                .userId,
            RoleId: this.LocalStorageHandlerService.getFromStorage("userObj")
                .roleID,
            ViewId: this.routineSelected,
            DeptId: this.decryptedDepartmentId
                ? this.decryptedDepartmentId
                : this.departmentID,
            TillDate: date ? date : moment().format("MMM_YY"),
            PastMonths: months ? months : 1,
            ShowDeleted: null,
        };

        this.renderDepartmentNameHeading();

        this.saleslog.fetchAllRows(obj).subscribe((res) => {
            this.rowData = [];
            this.columnDefs = [];
            let rows = [];
            this.salesData = res;
            this.monthObject.oneMonth = true;
            // console.log(res);

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
                        color: element1.cellColor,
                    });
                    this.cellMap["rowId"] = rowIndexId;

                    if (element1.colType && element1.colType === "Date") {
                        if (
                            element1.currentCellValue &&
                            element1.currentCellValue !== null &&
                            element1.currentCellValue !== undefined &&
                            this.isValidDate(element1.currentCellValue)
                        ) {
                            this.cellMap[element1.colId] = moment(element1.currentCellValue).format("DD/MM/YYYY");
                            this.cellMap['"' + element1.colCode + '"'] = moment(element1.currentCellValue).format("DD/MM/YYYY");
                        }
                    } else if (
                        element1.colType &&
                        element1.colType === "Combo"
                    ) {
                        // console.log("COMBOOO: ", element1.currentCellValue);
                        if (
                            element1.currentCellValue &&
                            element1.currentCellValue !== null &&
                            element1.currentCellValue !== undefined &&
                            this.isValidDate(element1.currentCellValue)
                        ) {
                            this.cellMap[element1.colId] = moment(element1.currentCellValue).format("DD/MM/YYYY hh:mm");
                            this.cellMap['"' + element1.colCode + '"'] = moment(element1.currentCellValue).format("DD/MM/YYYY hh:mm");
                        }
                    } else {
                        this.cellMap["" + element1.colId + ""] = element1.currentCellValue;
                        this.cellMap['"' + element1.colCode + '"'] = element1.currentCellValue;
                    }
                    if (element1.cellOptions.length > 0) {
                        this.cellMap["cellOptions_" + element1.colCode] = element1.cellOptions;
                    }
                    this.cellMap["carryOver"] = carryOver;
                    this.cellMap["cellColor_" + element1.colCode] = element1.cellColor;

                    if (index == element.cells.length - 1) {
                        this.cellData.push(this.cellMap);
                    }
                    index++;
                });

                let typeArray = [];
                var OD_M = moment(this.cellData[0]['"OD"'], 'DD/MM/YYYY').format('M');
                var ED_M = moment(this.cellData[0]['"ED"'], 'DD/MM/YYYY').format('M');
                var AD_M = moment(this.cellData[0]['"AD"'], 'DD/MM/YYYY').format('M');
                var SD_M = moment().format("M");

                if (OD_M <= SD_M) 
                {
                    if(this.cellData[0]['"ED"'] !== undefined) {
                        let time = SD_M >= ED_M;
                        
                        if (time) {
                         //   console.log('time: YES');
                            this.carryOverAmount = 
                            this.carryOverAmount + Number(this.cellData[0]['"VEHGRO"']) + Number(this.cellData[0]['"VEHHOLDB"']);
                            typeArray.push("carryOver");
                        } else {
                       //     console.log('time: No');
                            typeArray.push("sold");
                            this.soldUnits = this.soldUnits + 1;
                            this.soldAmount = this.soldAmount + Number(this.cellData[0]['"VEHGRO"']) + Number(this.cellData[0]['"VEHHOLDB"']);
                        }
                    }
                    else{
                     //   console.log('No Estimated Delivery');
                        typeArray.push("sold");
                        this.soldUnits = this.soldUnits + 1;
                        this.soldAmount = this.soldAmount + Number(this.cellData[0]['"VEHGRO"']) + Number(this.cellData[0]['"VEHHOLDB"']);
                    }
                } 
                else {
                    typeArray.push("sold");
                    this.soldUnits = this.soldUnits + 1;
                    this.soldAmount = this.soldAmount + Number(this.cellData[0]['"VEHGRO"']) + Number(this.cellData[0]['"VEHHOLDB"']);;
                }

                // Covered: Whose Est. Del is not in future months.
                if (
                    this.cellData[0]['"ED"'] !== "" &&
                    this.cellData[0]['"ED"'] !== undefined &&
                    this.cellData[0]['"ED"'] !== null &&
                    ED_M <= SD_M  
                    ) 
                {
                    typeArray.push("covered");
                    this.coveredUnits = this.coveredUnits + 1;
                    this.coveredAmount = this.coveredAmount + Number(this.cellData[0]['"VEHGRO"']);
                }

                if (
                    this.cellData[0]['"AD"'] !== "" &&
                    this.cellData[0]['"AD"'] !== undefined &&
                    this.cellData[0]['"AD"'] !== null
                ) {
                    typeArray.push("delivered");
                    this.deliveredUnits = this.deliveredUnits + 1;
                    this.deliveredAmount = this.deliveredAmount + Number(this.cellData[0]['"VEHGRO"']);
                }

                if (this.cellData[0]['"PROGRO"'] !== null) {
                    this.processedUnits = this.processedUnits + 1;
                    this.processedAmount = this.processedAmount + Number(this.cellData[0]['"PROGRO"']);
                } else {
                    this.missingUnits = this.missingUnits + 1;
                }

                this.cellData[0]["type"] = typeArray;
                this.vehicleProfit = this.vehicleProfit + Number(this.cellData[0]['"VEHPRO"']);
                this.totalRows = this.totalRows + 1;

                rows.push(this.cellData[0]);
            });

            if (this.routineSelected === 2) {
                this.deliveredAvg =
                    this.totalRows > 0
                        ? Number(this.vehicleProfit) / Number(this.totalRows)
                        : 0;

                this.processedAvg =
                    this.processedUnits > 0
                        ? Number(this.processedAmount) /
                          Number(this.processedUnits)
                        : 0;

                this.varianceAmount = this.processedAmount - this.vehicleProfit;
                this.varianceAvg =
                    this.totalRows > 0
                        ? this.varianceAmount / this.totalRows
                        : 0;

                this.totalAmount =
                    Number(this.processedAmount) + Number(this.vehicleProfit);
                this.totalAvg =
                    this.totalRows > 0
                        ? this.totalAmount / Number(this.totalRows)
                        : 0;

            } else {
                this.tradeinAvg =
                    this.tradeinUnits > 0
                        ? Number(this.tradeinAmount) / Number(this.tradeinUnits)
                        : 0;
            }

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
            rowIdcolumn["suppressMovable"] = true;
            rowIdcolumn["hide"] = false;
            rowIdcolumn["pinned"] = "left";
            rowIdcolumn["lockPinned"] = true;
            rowIdcolumn["filter"] = true;
            rowIdcolumn["lockPosition"] = true;
            rowIdcolumn["cellClass"] = function (params) {
                // // // // console.log(params.data);
                return params.data.carryOver === true
                    ? "agClassCarryOver"
                    : "agClassNoCarryOver";
            };

            let carryOverCount = this.carryOverUnits;
            rowIdcolumn["valueGetter"] = function (params) {
                return params.node.rowIndex + 1;
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
                columnMap["suppressMovable"] = true;
                columnMap["filter"] = true;
                columnMap["volatile"] = true;
                columnMap["hide"] = !element.display;
                columnMap["columnType"] = element.type;
                columnMap["width"] = element.colWidth;

                let required = element.required;
                columnMap["cellStyle"] = function (params) {
                    if (required && params.value === "") {
                        return { backgroundColor: "red" };
                    } else {
                        return null;
                    }
                };

                if (element.type === "Date") {
                    columnMap["cellEditor"] = "dateEditor";
                    columnMap["valueFormatter"] =
                        this.isoDateValueFormatter.bind(this);
                } else if (element.type === "DD-Fixed") {
                    columnMap["cellRenderer"] = "customDropDownRenderer";
                } else if (element.type === "DD-Self") {
                    columnMap["cellRenderer"] = "customDropDownRenderer";
                } else if (element.type === "DD-Suggest") {
                    columnMap["cellRenderer"] = "customDropDownRenderer";
                } else if (element.type === "Combo") {
                    columnMap["cellRenderer"] = "dropDownRenderer";
                }

                column.push(columnMap);
            });

            column.sort(function (a, b) {
                return a.sequence - b.sequence;
            });

            this.columnDefs = column;
            this.rowData = rows;
            this.rowResponse = rows;
            // this.gridApi.sizeColumnsToFit();
        });
    }

    isoDateValueFormatter(params) {
        // // console.log(params.value);
    }

    onCellChanged(event) {
        // console.log("on cell changed");
        // console.log("event: ", event);
        if (event.newValue === undefined) {
            event.newValue = "";
        }
        // // // console.log("------------------");
        // // // console.log("event::", event);
        // // // console.log("------------------");
        if (
            event.newValue ||
            event.newValue === "" ||
            event.newValue === null
        ) {
            let params = {
                userid: this.LocalStorageHandlerService.getFromStorage(
                    "userObj"
                ).userId,
                EntryId: event.data.rowId, // Parent ID of the row for which cell he is editing
                ViewId: this.routineSelected,
                DeptId: this.decryptedDepartmentId
                    ? this.decryptedDepartmentId
                    : this.departmentID,
                colId: event.colDef.colId,
                ColType: event.colDef.columnType, // You need to send the column type
                Value: event.newValue,
                OriginalValue: event.newValue
            };

            if (Object.keys(params).length !== 0) {
                this.saleslog.insertCellValue(params).subscribe(() => {
                    // this.toastNotification.generateToast('Update successful', 'OK', 2000);
                    this.signalRService.BroadcastLiveSheetData();
                });
            }
        }
    }

    gridFilter(months?, date?, searchValue?) {
        this.gridApi.showLoadingOverlay();

        let obj = {
            UserId: this.LocalStorageHandlerService.getFromStorage("userObj")
                .userId,
            RoleId: this.LocalStorageHandlerService.getFromStorage("userObj")
                .roleID,
            ViewId: this.routineSelected,
            DeptId: this.decryptedDepartmentId
                ? this.decryptedDepartmentId
                : this.departmentID,
            TillDate: date ? date : moment().format("MMM_YY"),
            PastMonths: months ? months : 1,
            ShowDeleted: this.searchForm.get("deletedRecords").value
                ? this.searchForm.get("deletedRecords").value
                : null,
        };

        this.saleslog.fetchAllRows(obj).subscribe((res) => {
            this.resetSummaryValues();

            this.rowResponse = [];
            this.salesData = [];
            this.salesData = res;

            let rows = [];
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
                        color: element1.cellColor,
                    });

                    this.cellMap["rowId"] = rowIndexId;

                    if (element1.colType && element1.colType === "Date") {
                        if (
                            element1.currentCellValue &&
                            element1.currentCellValue !== null &&
                            element1.currentCellValue !== undefined &&
                            this.isValidDate(element1.currentCellValue)
                        ) {
                            this.cellMap[element1.colId] = moment(
                                element1.currentCellValue
                            ).format("DD/MM/YYYY");
                            this.cellMap['"' + element1.colCode + '"'] = moment(
                                element1.currentCellValue
                            ).format("DD/MM/YYYY");
                        }
                    } else if (
                        element1.colType &&
                        element1.colType === "Combo"
                    ) {
                        // console.log("COMBOOO: ", element1.currentCellValue);
                        if (
                            element1.currentCellValue &&
                            element1.currentCellValue !== null &&
                            element1.currentCellValue !== undefined &&
                            this.isValidDate(element1.currentCellValue)
                        ) {
                            this.cellMap[element1.colId] = moment(
                                element1.currentCellValue
                            ).format("DD/MM/YYYY hh:mm");
                            this.cellMap['"' + element1.colCode + '"'] = moment(
                                element1.currentCellValue
                            ).format("DD/MM/YYYY hh:mm");
                        }
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
                var OD_M = moment(this.cellData[0]['"OD"'], 'DD/MM/YYYY').format('M');
                var ED_M = moment(this.cellData[0]['"ED"'], 'DD/MM/YYYY').format('M');
                var AD_M = moment(this.cellData[0]['"AD"'], 'DD/MM/YYYY').format('M');
                var SD_M = moment().format("M");

                if (OD_M <= SD_M) 
                {
                    if(this.cellData[0]['"ED"'] !== undefined) {
                        let time = SD_M >= ED_M;
                        
                        if (time) {
                         //   console.log('time: YES');
                            this.carryOverAmount = 
                            this.carryOverAmount + Number(this.cellData[0]['"VEHGRO"']) + Number(this.cellData[0]['"VEHHOLDB"']);
                            typeArray.push("carryOver");
                        } else {
                       //     console.log('time: No');
                            typeArray.push("sold");
                            this.soldUnits = this.soldUnits + 1;
                            this.soldAmount = this.soldAmount + Number(this.cellData[0]['"VEHGRO"']) + Number(this.cellData[0]['"VEHHOLDB"']);
                        }
                    }
                    else{
                     //   console.log('No Estimated Delivery');
                        typeArray.push("sold");
                        this.soldUnits = this.soldUnits + 1;
                        this.soldAmount = this.soldAmount + Number(this.cellData[0]['"VEHGRO"']) + Number(this.cellData[0]['"VEHHOLDB"']);
                    }
                } 
                else {
                    typeArray.push("sold");
                    this.soldUnits = this.soldUnits + 1;
                    this.soldAmount = this.soldAmount + Number(this.cellData[0]['"VEHGRO"']) + Number(this.cellData[0]['"VEHHOLDB"']);;
                }

                // Covered: Whose Est. Del is not in future months.
                if (
                    this.cellData[0]['"ED"'] !== "" &&
                    this.cellData[0]['"ED"'] !== undefined &&
                    this.cellData[0]['"ED"'] !== null &&
                    ED_M <= SD_M  
                    ) 
                {
                    typeArray.push("covered");
                    this.coveredUnits = this.coveredUnits + 1;
                    this.coveredAmount = this.coveredAmount + Number(this.cellData[0]['"VEHGRO"']);
                }

                if (
                    this.cellData[0]['"AD"'] !== "" &&
                    this.cellData[0]['"AD"'] !== undefined &&
                    this.cellData[0]['"AD"'] !== null
                ) {
                    typeArray.push("delivered");
                    this.deliveredUnits = this.deliveredUnits + 1;
                    this.deliveredAmount = this.deliveredAmount + Number(this.cellData[0]['"VEHGRO"']);
                }

                if (this.cellData[0]['"PROGRO"'] !== "") {
                    this.processedUnits = this.processedUnits + 1;
                    this.processedAmount =
                        this.processedAmount +
                        Number(this.cellData[0]['"PROGRO"']);
                } else {
                    this.missingUnits = this.missingUnits + 1;
                }

                this.cellData[0]["type"] = typeArray;
                this.vehicleProfit =
                    this.vehicleProfit + Number(this.cellData[0]['"VEHPRO"']);
                this.totalRows = this.totalRows + 1;

                rows.push(this.cellData[0]);
            });

            if (this.routineSelected === 2) {
                this.deliveredAvg =
                    this.totalRows > 0
                        ? Number(this.vehicleProfit) / Number(this.totalRows)
                        : 0;
                this.processedAvg =
                    this.processedUnits > 0
                        ? Number(this.processedAmount) /
                          Number(this.processedUnits)
                        : 0;

                this.varianceAmount = this.processedAmount - this.vehicleProfit;
                this.varianceAvg =
                    this.totalUnits > 0
                        ? this.varianceAmount / this.totalRows
                        : 0;

                this.totalAmount =
                    Number(this.processedAmount) + Number(this.vehicleProfit);
                this.totalAvg =
                    this.totalUnits > 0
                        ? this.totalAmount / Number(this.totalRows)
                        : 0;
               
            } 
            else {
                this.tradeinAvg =
                    this.tradeinUnits > 0
                        ? Number(this.tradeinAmount) / Number(this.tradeinUnits)
                        : 0;
            }

            // // console.log(rows);
            let searchResult = rows.filter((resp) => {
                let payType = resp['"PT"'];
                let financeManager = resp['"FM"'];
                let email = resp['"EM"'];
                let dept = resp['"Dept"'];
                let cL = resp['"CL"'];

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
                            .includes(searchValue.toLowerCase())) ||
                    (cL && cL.toLowerCase().includes(searchValue.toLowerCase()))
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

    search() {
        let searchVal = this.searchForm.get("searchbar").value;
        let previousMonthFilter = this.searchForm.get("previousMonth").value;
        let currentMonthFilter = this.searchForm.get("currentMonth").value;
        let searchResult = [];

        if (currentMonthFilter !== false) {
            if (this.monthObject.oneMonth) {
                let month = moment().format("MMM_YY");
                this.gridFilter(previousMonthFilter, month, searchVal);

                if (this.searchForm.get("deletedRecords").value) {
                    // // console.log('Delete Value 1',this.searchForm.get("deletedRecords").value);
                    this.monthObject.reset();
                    this.monthObject.oneMonth = true;
                } else {
                    // // console.log('Delete Value 2',this.searchForm.get("deletedRecords").value);
                    searchResult = this.rowResponse.filter((resp) => {
                        let orderDate = resp['"OD"'];
                        let payType = resp['"PT"'];
                        let financeManager = resp['"FM"'];
                        let email = resp['"EM"'];
                        let dept = resp['"Dept"'];
                        let cL = resp['"CL"'];

                        return (
                            (moment(orderDate).isSame(moment()) &&
                                email &&
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
                                    .includes(searchVal.toLowerCase())) ||
                            (cL &&
                                cL
                                    .toLowerCase()
                                    .includes(searchVal.toLowerCase()))
                        );
                    });
                    /*Dispaly search results in grid row array and number of display records found*/
                    this.displaySearchResult(searchResult);
                    /*-------------------------*/
                }
            } else {
                let month = moment().format("MMM_YY");
                this.gridFilter(previousMonthFilter, month, searchVal);
                this.monthObject.reset();
                this.monthObject.oneMonth = true;
            }
        } else if (previousMonthFilter !== "") {
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
            if (1 == 1) {
                searchResult = this.rowResponse.filter((resp) => {
                    let filter = Object.keys(resp).filter(
                        (res) =>
                            resp[res].toLowerCase() === searchVal.toLowerCase()
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

            // // // // console.log(
            //     email,
            //     searchVal,
            //     email && email.toLowerCase().includes(searchVal.toLowerCase())
            // );
            // // // // console.log(
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
            //   //   // // // // console.log(resp[res], Number(resp[res]))
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
            // // // // console.log(this.rowResponse, row);
            if (row.length > 0) {
                this.rowData = [];
                this.rowData = row;
                this.toastHandlerService.generateToast(
                    "1 filter applied",
                    "",
                    null
                );
            }
        } else if (option === 1) {
            let row = this.rowResponse.filter((res) => {
                // // // // // console.log(res.type);
                return res.type.find((el) => el === "sold");
            });
            if (row.length > 0) {
                this.rowData = [];
                this.rowData = row;
                this.toastHandlerService.generateToast(
                    "1 filter applied",
                    "",
                    null
                );
            }
        } else if (option === 2) {
            let row = this.rowResponse.filter((res) => {
                // // // // // console.log(res.type);
                return res.type.find((el) => el === "covered");
            });
            if (row.length > 0) {
                this.rowData = [];
                this.rowData = row;
                this.toastHandlerService.generateToast(
                    "1 filter applied",
                    "",
                    null
                );
            }
        } else if (option === 3) {
            let row = this.rowResponse.filter((res) => {
                // // // // // console.log(res.type);
                return res.type.find((el) => el === "delivered");
            });
            if (row.length > 0) {
                this.rowData = [];
                this.rowData = row;
                this.toastHandlerService.generateToast(
                    "1 filter applied",
                    "",
                    null
                );
            }
        }
    }

    calenderSearch(searchingFormat, month, startingMonth) {
        // // // // console.log(searchingFormat, startingMonth);
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
                    // // // // console.log(
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
        // // // // console.log(searchingFormat);
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
        // // // // console.log(this.monthSelected);
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

    toggleShowDiv(divName: string) {
        if (divName === "divA") {
            if (this.animationState === "in") {
                this.searchForm.get("searchbar").setValue("");
                // this.rowData = this.rowResponse;
                this.search();
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
                        sort: "asc",
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

        // // // console.log("********************");
        // // // console.log("thisRef.rowColor: ", thisRef.rowColor);
        // // // console.log("params: ", params);
        // // // console.log("********************");

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
                            // // // // console.log(params);
                            thisRef.openModal(
                                thisRef,
                                HistoryComponent,
                                "1000px",
                                {
                                    option: 2,
                                    colId: Number(params.column.colId),
                                    entryId: params.node.data.rowId,
                                }
                            );
                        },
                        icon: createFlagImg("bookmark"),
                    },
                    // {
                    //     name: "Show All",
                    //     action: function () {
                    //         // // // // console.log(params.column.colId);
                    //         // // // // console.log(params.node.rowIndex);
                    //         thisRef.openModal(
                    //             thisRef,
                    //             HistoryComponent,
                    //             "1000px",
                    //             {
                    //                 option: 1,
                    //                 colId: Number(params.column.colId),
                    //                 entryId: params.node.data.rowId,
                    //             }
                    //         );
                    //     },
                    //     icon: createFlagImg("bookmark"),
                    // },
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
                    // // // // // console.log(params);
                    thisRef.duplicateRow(newItems, params.node.data.rowId);
                    // thisRef.gridApi.applyTransaction({ add: newItems });
                },
                icon: createFlagImg("plus"),
            },
            "separator",
            {
                name: "DELETE - Entire Record",
                action: function () {
                    var newItems = [params.node.data];
                    thisRef.deleteRow(newItems, params.node.data.rowId);
                },
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
                        if (
                            el.rowId === params.node.rowIndex &&
                            el.colId === params.column.userProvidedColDef.colId
                        ) {
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

                    thisRef.updateCellColor(
                        params.context.salesData.rowData.row,
                        params.node.data.rowId,
                        params.column.userProvidedColDef.colId,
                        "blue"
                    );
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
                        if (
                            el.rowId === params.node.rowIndex &&
                            el.colId === params.column.userProvidedColDef.colId
                        ) {
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
                    thisRef.updateCellColor(
                        params.context.salesData.rowData.row,
                        params.node.data.rowId,
                        params.column.userProvidedColDef.colId,
                        "green"
                    );
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
                        if (
                            el.rowId === params.node.rowIndex &&
                            el.colId === params.column.userProvidedColDef.colId
                        ) {
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
                    thisRef.updateCellColor(
                        params.context.salesData.rowData.row,
                        params.node.data.rowId,
                        params.column.userProvidedColDef.colId,
                        "yellow"
                    );
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
                        if (
                            el.rowId === params.node.rowIndex &&
                            el.colId === params.column.userProvidedColDef.colId
                        ) {
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
                    thisRef.updateCellColor(
                        params.context.salesData.rowData.row,
                        params.node.data.rowId,
                        params.column.userProvidedColDef.colId,
                        "red"
                    );
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
                        if (
                            el.rowId === params.node.rowIndex &&
                            el.colId === params.column.userProvidedColDef.colId
                        ) {
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
                    thisRef.updateCellColor(
                        params.context.salesData.rowData.row,
                        params.node.data.rowId,
                        params.column.userProvidedColDef.colId,
                        "purple"
                    );
                    thisRef.gridApi.redrawRows();
                },
                icon: createFlagImg("purple-color"),
                cssClasses: ["pointer"],
            },
            {
                name: "Remove Tag",
                action: function () {
                    thisRef.rowColor.map((el) => {
                        if (
                            el.rowId === params.node.rowIndex &&
                            el.colId === params.column.userProvidedColDef.colId
                        ) {
                            el.color = null;
                            el.colId = params.column.userProvidedColDef.colId;
                        }
                    });
                    let rows = [];
                    rows.push(
                        thisRef.gridApi.getDisplayedRowAtIndex(
                            params.node.rowIndex
                        )
                    );

                    thisRef.removeCellColor(
                        params.context.salesData.rowData.row,
                        params.node.data.rowId,
                        params.column.userProvidedColDef.colId
                    );

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
                viewId: this.routineSelected,
                DeptId: this.decryptedDepartmentId
                    ? this.decryptedDepartmentId
                    : this.departmentID,
            },
        });
        thisRef.dialogRef.afterClosed().subscribe((res) => {
            if (res && res.column) {
                // console.log(res.column);

                if (res.column.length > 0) {
                    res.column.map((res) => {
                        let column = this.columnDefs.find(
                            (el) => el.headerName === res.columnName
                        );
                        if (column !== undefined) {
                            // console.log(column.colId);
                            this.gridColumnApi.setColumnVisible(
                                column.colId,
                                res.display
                            );
                        }
                    });
                }

                window.location.reload();

                // setTimeout(() => {
                //     this.gridApi.refreshView();
                //    // this.gridApi.sizeColumnsToFit();
                // }, 0);
            }
        });
    }

    duplicateRow(newItems, index) {
        // // // console.log("************");
        // // // console.log("duplicate row method called", newItems, index);
        // // // console.log("************");
        this.gridApi.showLoadingOverlay();

        let params = {
            EntryId: index,
        };
        this.saleslog.duplicateRows(params).subscribe(() => {
            this.gridApi.hideOverlay();
            this.signalRService.BroadcastLiveSheetData();
            this.gridApi.applyTransaction({ add: newItems });
        });
    }

    removeCellColor(rowArray, entryId, columnId, value) {
        const firstFilter = rowArray.filter((x) =>
            x.cells.some((y) => y.entryId === entryId && y.colId === columnId)
        );
        const entryValueId = firstFilter[0].cells.filter(
            (y) => y.entryId === entryId && y.colId === columnId
        )[0].entryValueId;

        let params = {
            EntryId: entryId,
            EntryValueId: entryValueId,
            Name: "background",
            Value: value,
            UserId: this.LocalStorageHandlerService.getFromStorage("userObj")
                .userId,
            ViewId: this.routineSelected,
            DeptId: this.decryptedDepartmentId
                ? this.decryptedDepartmentId
                : this.departmentID,
        };

        this.saleslog.removeCellColor(params).subscribe(() => {
            this.signalRService.BroadcastLiveSheetData();
        });
    }

    deleteRow(newItems, index) {
        this.gridApi.showLoadingOverlay();
        let params = {
            EntryId: index,
        };
        this.saleslog.deleteRows(params).subscribe(() => {
            this.gridApi.hideOverlay();
            this.signalRService.BroadcastLiveSheetData();
            this.gridApi.applyTransaction({ remove: newItems });
            this.toastHandlerService.generateToast(
                "Row Deleted Successfully",
                "",
                2000
            );
        });
    }

    updateCellColor(rowArray, entryId, columnId, value) {
        const firstFilter = rowArray.filter((x) =>
            x.cells.some((y) => y.entryId === entryId && y.colId === columnId)
        );
        const entryValueId = firstFilter[0].cells.filter(
            (y) => y.entryId === entryId && y.colId === columnId
        )[0].entryValueId;

        let params = {
            EntryId: entryId,
            EntryValueId: entryValueId,
            Name: "background",
            Value: value,
            UserId: this.LocalStorageHandlerService.getFromStorage("userObj")
                .userId,
            ViewId: this.routineSelected,
            DeptId: this.decryptedDepartmentId
                ? this.decryptedDepartmentId
                : this.departmentID,
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
                key: {
                    id: this.departmentID,
                    viewId: this.routineSelected,
                    DeptId: this.decryptedDepartmentId
                        ? this.decryptedDepartmentId
                        : this.departmentID,
                },
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
        var excelParams = {
            fileName: this.generateFileName()+'.xlsx',
        }
        this.gridApi.exportDataAsExcel(excelParams);
        // this.openModal(this, ExcelExportComponent, "400px");
    }

    csvExport() {
        var csvParams = {
            fileName: this.generateFileName()+'.csv',
        }
        this.gridApi.exportDataAsCsv(csvParams);
        // this.openModal(this, ExcelExportComponent, "400px");
    }

    generateFileName() {
        if(this.routineSelected === 3) {
            return 'Arriving_'+ new Date().toLocaleDateString();
        }else{
            return this.departmentName.replace('-','_').replace(' ','_').trim()+'_'+'Delivered';
        }
    }

    columnOption() {
        this.openModal(this, ColumnOptionComponent, "900px", this.departmentID);
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
        if (event.option === 1) {
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
            format: "d/m/Y",
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
