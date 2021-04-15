import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    OnChanges,
    Input,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ToastHandlerService } from "app/shared/services/toast-handler.service";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HistoryComponent } from "../history/history.component";
import { NewDealComponent } from "../new-deal/new-deal.component";
import { XlsExportComponent } from "../xls-export/xls-export.component";
import { ColumnOptionsComponent } from "../column-options/column-options.component";

import { AllModules } from "@ag-grid-enterprise/all-modules";
import { SlideInOutAnimation } from "app/shared/animation/animation";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { EncryptionService } from "app/shared/services/encryption.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as data from "app/RoutineSheetJSON.json";
import { AuthService } from "ml-auth/shared/services/ml-auth/ml-auth.service";

import { SaleslogService } from "ml-routine/shared/services/saleslog/saleslog.service";
import { LocalStorageHandlerService } from "app/shared/services/local-storage-handler.service";
import { SharedService } from "ml-setup/shared/services/shared/shared.service";
import { SignalRService } from "ml-setup/shared/services/signal-r/signal-r.service";

import { CalenderRenderer } from "../grid-custom/calander-renderer.component";
import { CustomLoadingOverlayComponent } from "ml-shared/components/custom-loading-overlay/custom-loading-overlay.component";
import { CustomHeaderComponent } from "ml-routine/shared/components/custom-header/custom-header.component";

import { CustomDropDownRenderer } from "../grid-custom/custom-dropdown-renderer.component";
import { DropDownRenderer } from "../grid-custom/dropdown-renderer.component";

declare var $: any;

@Component({
    selector: "app-routine-sheet",
    templateUrl: "./routine-sheet.component.html",
    styleUrls: ["./routine-sheet.component.scss"],
    animations: [SlideInOutAnimation],
})
export class RoutineSheetComponent implements OnInit {
    selectedCity: number;

    @Input()
    public routineSelected: number = 1;
    public totalRows: number = 0;
    public departmentID: number = 0;
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
    printData: any;

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

    gridApi;
    gridColumnApi;

    public modules: any[] = AllModules;
    rowData = [];
    columnDefs;
    defaultColDef;
    columnTypes;
    autoGroupColumnDef;
    rows = [];

    getRowNodeId;
    aggFuncs;
    baseCondtion: number = 0;
    rowHeight: number;

    history: number = 3;
    period: number = 3;
    departmentName: string = "";
    startFrom: number = null;
    public emptyFieldsCount: number = 0;
    statusOption: string[] = [];
    payOptions: string[] = [];
    salesEngOption: string[] = [""];
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
    public rowColor = [];
    cellMap: any;
    salesData: any;
    postProcessPopup;
    departmentIDs: any[] = [];
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
        private http: HttpClient,
        private toastHandlerService: ToastHandlerService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        public sharedService: SharedService,
        private LocalStorageHandlerService: LocalStorageHandlerService,
        private router: Router,
        public snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private encryptionService: EncryptionService,
        private authService: AuthService,
        private saleslog: SaleslogService,
        private signalRService: SignalRService // private siteTargetSerivce: SiteTargetsService
    ) {
        this.route.paramMap.subscribe((params) => {
            this.decryptedDepartmentId = this.encryptionService.convertToEncOrDecFormat(
                "decrypt",
                params.get("id")
            );
            console.log(this.decryptedDepartmentId);
            if (this.pageCounter !== 0) {
                this.generateGrid();
            }
        });

        this.columnDefs = [];

        this.defaultColDef = {
            flex: 1,
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
                    // console.log(params)
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
                        params.colDef.field === "SE" &&
                        params.colDef.field === "AFM" &&
                        params.colDef.field === "FM"
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
                        // console.log("after",params.data.orderDate,isAfter,"choice:",choice);
                        return params.value === "" && choice;
                    } else if (params.colDef.field === "PT") {
                        let date = moment().format("DD-MMM-YY");
                        let isAfter = moment(
                            params.data.orderDate
                        ).isSameOrAfter(date);
                        let isBefore;
                        let choice;
                        if (!isAfter) {
                            choice = moment(params.data.orderDate).isBefore(
                                date
                            );
                        } else {
                            choice = isAfter;
                        }
                        // console.log(params.data.orderDate);

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

        this.getRowNodeId = function (data) {
            return data.id;
        };
        this.frameworkComponents = {
            agColumnHeader: CustomHeaderComponent,
            calenderRender: CalenderRenderer,
            dropDownRenderer: DropDownRenderer,
            customDropDownRenderer: CustomDropDownRenderer,
            customLoadingOverlay: CustomLoadingOverlayComponent,
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
            userId: this.LocalStorageHandlerService.getSession("userObj").userId,
            deptid: this.decryptedDepartmentId
                ? this.decryptedDepartmentId
                : this.departmentID,
            ViewID: this.routineSelected,
            colId: cid,
            config: "{'width':" + width + "}", // or "{'sequence':1}"
        };

        this.saleslog.updateViewColumnOptions(params).subscribe((res) => {
            this.signalRService.BroadcastLiveSheetData();
        });
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
                            console.log("Ireland was pressed");
                        },
                        icon: createFlagImg("ie"),
                    },
                    {
                        name: "UK",
                        action: function () {
                            console.log("UK was pressed");
                        },
                        icon: createFlagImg("gb"),
                    },
                    {
                        name: "France",
                        action: function () {
                            console.log("France was pressed");
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
                            console.log("Niall was pressed");
                        },
                    },
                    {
                        name: "Sean",
                        action: function () {
                            console.log("Sean was pressed");
                        },
                    },
                    {
                        name: "John",
                        action: function () {
                            console.log("John was pressed");
                        },
                    },
                    {
                        name: "Alberto",
                        action: function () {
                            console.log("Alberto was pressed");
                        },
                    },
                    {
                        name: "Tony",
                        action: function () {
                            console.log("Tony was pressed");
                        },
                    },
                    {
                        name: "Andrew",
                        action: function () {
                            console.log("Andrew was pressed");
                        },
                    },
                    {
                        name: "Kev",
                        action: function () {
                            console.log("Kev was pressed");
                        },
                    },
                    {
                        name: "Will",
                        action: function () {
                            console.log("Will was pressed");
                        },
                    },
                    {
                        name: "Armaan",
                        action: function () {
                            console.log("Armaan was pressed");
                        },
                    },
                ],
            },
            "separator",
            {
                name: "Windows",
                shortcut: "Alt + W",
                action: function () {
                    console.log("Windows Item Selected");
                },
                icon: '<img src="../images/skills/windows.png"/>',
            },
            {
                name: "Mac",
                shortcut: "Alt + M",
                action: function () {
                    console.log("Mac Item Selected");
                },
                icon: '<img src="../images/skills/mac.png"/>',
            },
            "separator",
            {
                name: "Checked",
                checked: true,
                action: function () {
                    console.log("Checked Selected");
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

    public addBroadcastLiveSheetDataForViewsListener = () => {
        this.signalRService.hubConnection.on(
            "TransferLiveSheetData",
            (data) => {
                this.generateGrid();
            }
        );
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

    /** Used To Generate row number Column with default settings */

    generateRowColumn(): void {
        let rowIdcolumn = new Object();

        (rowIdcolumn["headerName"] = "."),
            (rowIdcolumn["colId"] = 0),
            (rowIdcolumn["minWidth"] = 40),
            (rowIdcolumn["maxWidth"] = 40),
            (rowIdcolumn["cellClass"] = "row-no"),
            (rowIdcolumn["editable"] = false),
            (rowIdcolumn["sequence"] = 0);
        (rowIdcolumn["pinned"] = "left"),
            (rowIdcolumn["lockPinned"] = true),
            (rowIdcolumn["filter"] = true),
            (rowIdcolumn["lockPosition"] = true),
            (rowIdcolumn["cellClass"] = function (params) {
                // console.log(params);
                let i = 1;
                return params.data.carryOver === true
                    ? "agClassCarryOver"
                    : "agClassNoCarryOver";
            });
        let carryOverCount = this.carryOverUnits;
        rowIdcolumn["valueGetter"] = function (params) {
            if (params.data.carryOver === true) {
                return null;
            } else {
                //i++;
                return params.node.rowIndex + 1 - carryOverCount;
            }
        };

        this.columnDefs.push(rowIdcolumn);
    }

    /** This is used to generate grid column header */

    generateColumnHeader(): void {
        let column = [];

        let rowIdcolumn = new Object();

        (rowIdcolumn["headerName"] = "."),
            (rowIdcolumn["colId"] = 0),
            (rowIdcolumn["minWidth"] = 40),
            (rowIdcolumn["maxWidth"] = 40),
            (rowIdcolumn["cellClass"] = "row-no"),
            (rowIdcolumn["editable"] = true),
            (rowIdcolumn["sequence"] = 0);
        (rowIdcolumn["pinned"] = "left"),
            (rowIdcolumn["lockPinned"] = true),
            (rowIdcolumn["filter"] = true),
            (rowIdcolumn["lockPosition"] = true),
            (rowIdcolumn["cellClass"] = function (params) {
                // console.log(params);
                let i = 1;
                return params.data.carryOver === true
                    ? "agClassCarryOver"
                    : "agClassNoCarryOver";
            });
        let carryOverCount = this.carryOverUnits;
        rowIdcolumn["valueGetter"] = function (params) {
            // console.log(carryOverCount);
            if (params.data.carryOver === true) {
                return null;
            } else {
                //i++;
                return params.node.rowIndex + 1 - carryOverCount;
            }
        };

        column.push(rowIdcolumn);

        this.salesData.column.forEach((element) => {
            let columnMap = new Object();
            columnMap["headerName"] = element.colName;
            columnMap["field"] = element.colCode;
            columnMap["colCode"] = element.colCode;
            columnMap["sequence"] = element.sequence;
            columnMap["resizable"] = true;
            columnMap["sortable"] = true;
            (columnMap["filter"] = true),
                (columnMap["hide"] = !element.display);
            let required = element.required;
            columnMap["cellStyle"] = function (params) {
                console.log("params:", params);
                if (required && params.value === "") {
                    //mark police cells as red
                    return { backgroundColor: "red" };
                } else {
                    return null;
                }
            };

            if (element.type === "Date") {
                columnMap["cellEditor"] = "datePicker";
            }
            if (element.type === "DD-Fixed") {
                columnMap["cellRenderer"] = "customDropDownRenderer";
            }
            if (element.type === "DD-Self") {
                columnMap["cellRenderer"] = "customDropDownRenderer";
            }
            if (element.type === "DD-Suggest") {
                columnMap["cellRenderer"] = "customDropDownRenderer";
            }
            if (element.type === "Combo") {
                columnMap["cellRenderer"] = "dropDownRenderer";
            }

            column.push(columnMap);
        });
        column.sort(function (a, b) {
            return a.sequence - b.sequence;
        });
        this.columnDefs = column;
        console.log(this.columnDefs);
        console.log(this.rowData);
    }

    dateFormatter(params) {
        return moment(params.value, "DD/MM/YYYY").format("yyyy-MM-DD"); // for datetime-local use yyyy-MM-DDThh:mm to format date from input , and use yyy-MM-DD format for date
    }

    dateTimeFormatter(params) {
        return moment(params.value, "DD/MM/YYYY").format("yyyy-MM-DDThh:mm"); // for datetime-local use yyyy-MM-DDThh:mm to format date from input , and use yyy-MM-DD format for date
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.pageCounter = this.pageCounter + 1;

        this.generateGrid();
    }

    generateGrid(months?, date?) {
        this.gridApi.showLoadingOverlay();
        if (this.routineSelected !== 3) {
            let department = this.LocalStorageHandlerService.getSession("userObj")
                .departmentAccess;
            this.departmentIDs = department;
            let count = 0;
            let ID = 0;
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
            let department = this.LocalStorageHandlerService.getSession("userObj")
                .departmentAccess;

            department.map((res) => {
                this.departmentIDs.push({
                    value: res.departmentId,
                    viewValue: res.departmentName,
                });
            });
            let count = 0;
            let ID = 0;
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
        }

        let obj = {
            UserId: this.LocalStorageHandlerService.getSession("userObj").userId,
            RoleId: this.LocalStorageHandlerService.getSession("userObj").roleID,
            ViewId: this.routineSelected,
            DeptId: this.decryptedDepartmentId
                ? this.decryptedDepartmentId
                : this.departmentID,
            TillDate: date ? date : moment().format("MMM_YY"),
            PastMonths: months ? months : 1,
            ShowDeleted: null,
        };
        // this.signalRService.startConnection();
        // this.signalRService.addTransferChartDataListener();

        this.saleslog.fetchAllRows(obj).subscribe((res) => {
            this.rowData = [];
            this.columnDefs = [];
            let rows = [];
            this.salesData = res;
            this.monthObject.oneMonth = true;
            console.log(res);

            this.salesData.rowData.row.forEach((element, rowIndex) => {
                this.cellMap = new Object();
                let carryOver = element.isCarryOver;
                let rowIndexId = element.rowId;

                if (carryOver) {
                    this.carryOverUnits++;
                }
                this.cellData = [];
                let index = 0;
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
                        ).format("MM/DD/YYYY");

                        this.cellMap['"' + element1.colCode + '"'] = moment(
                            element1.currentCellValue
                        ).format("MM/DD/YYYY");
                        // console.log(this.cellMap['"'+element1.colCode+'"'])
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

                /** Calculate Aggregared Header */
                let columnData = this.cellData[0];
                let typeArray = [];
                // console.log(this.cellData[0]);
                // console.log(this.cellData[0]['"OD"'], this.cellData[0]['"ED"'], this.cellData[0]['"VEHGRO"'], this.cellData[0]['"AD"'], this.cellData[0]["type"]);
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
                // console.log( this.missingUnits, this.cellData[0]['"PROGRO"'] === null);
                if (this.cellData[0]['"PROGRO"'] !== null) {
                    this.processedUnits = this.processedUnits + 1;
                    this.processedAmount =
                        this.processedAmount +
                        Number(this.cellData[0]['"PROGRO"']);
                } else {
                    this.missingUnits = this.missingUnits + 1;
                    // console.log(this.missingUnits);
                }

                this.cellData[0]["type"] = typeArray;
                this.vehicleProfit =
                    this.vehicleProfit + Number(this.cellData[0]['"VEHPRO"']);
                this.totalRows = this.totalRows + 1;

                rows.push(this.cellData[0]);
            });
            this.rowResponse = rows;

            if (this.routineSelected === 1) {
                this.carryOverAvg =
                    this.carryOverUnits > 0
                        ? Number(this.carryOverAmount) /
                          Number(this.carryOverUnits)
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
                        ? Number(this.deliveredAmount) /
                          Number(this.deliveredUnits)
                        : 0;
            } else if (this.routineSelected === 2) {
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

                console.log(this.missingUnits);

                // this.missingAvg =(this.missingUnits > 0)? Number(this.missingAmount)/Number(this.missingUnits):0;
            } else {
                this.tradeinAvg =
                    this.tradeinUnits > 0
                        ? Number(this.tradeinAmount) / Number(this.tradeinUnits)
                        : 0;
            }

            let column = [];
            let count = 0;
            let rowIdcolumn = new Object();

            if (this.routineSelected !== 1) {
                (rowIdcolumn["headerName"] = "."),
                    (rowIdcolumn["colId"] = 0),
                    (rowIdcolumn["minWidth"] = 40),
                    (rowIdcolumn["maxWidth"] = 40),
                    (rowIdcolumn["cellClass"] = "row-no"),
                    (rowIdcolumn["editable"] = true),
                    (rowIdcolumn["sequence"] = 0);
                (rowIdcolumn["pinned"] = "left"),
                    (rowIdcolumn["lockPinned"] = true),
                    (rowIdcolumn["filter"] = true),
                    (rowIdcolumn["lockPosition"] = true),
                    (rowIdcolumn["valueGetter"] = function (params) {
                        count++;
                        return count;
                    });
            } else {
                (rowIdcolumn["headerName"] = "."),
                    (rowIdcolumn["colId"] = 0),
                    (rowIdcolumn["minWidth"] = 40),
                    (rowIdcolumn["maxWidth"] = 40),
                    (rowIdcolumn["cellClass"] = "row-no"),
                    (rowIdcolumn["editable"] = true),
                    (rowIdcolumn["sequence"] = 0);
                (rowIdcolumn["pinned"] = "left"),
                    (rowIdcolumn["lockPinned"] = true),
                    (rowIdcolumn["filter"] = true),
                    (rowIdcolumn["lockPosition"] = true),
                    (rowIdcolumn["cellClass"] = function (params) {
                        // console.log(params.data);
                        let i = 1;
                        return params.data.carryOver === true
                            ? "agClassCarryOver"
                            : "agClassNoCarryOver";
                    });
                let carryOverCount = this.carryOverUnits;
                rowIdcolumn["valueGetter"] = function (params) {
                    // console.log(params.node.rowIndex, carryOverCount);
                    if (params.data.carryOver === true) {
                        count = 0;
                        console.log(count);
                        return null;
                    } else {
                        //i++;
                        let l = params.node.rowIndex + 1 - carryOverCount;
                        console.log(
                            params.node.rowIndex,
                            carryOverCount,
                            l,
                            params.data.carryOver
                        );
                        if (params.node.rowIndex >= carryOverCount) {
                            return params.node.rowIndex + 1 - carryOverCount;
                        } else {
                            count++;
                            console.log(count);
                            return count;
                        }
                    }
                };
            }

            column.push(rowIdcolumn);

            this.salesData.column.forEach((element) => {
                let columnMap = new Object();
                columnMap["headerName"] = element.colName;
                // columnMap["field"] = element.colCode;
                columnMap["field"] = "" + element.colId + "";
                columnMap["colId"] = element.colId;

                columnMap["colCode"] = element.colCode;
                columnMap["sequence"] = element.sequence;
                columnMap["resizable"] = true;
                columnMap["sortable"] = true;
                (columnMap["filter"] = true),
                    (columnMap["hide"] = !element.display);
                columnMap["columnType"] = element.type;

                let required = element.required;
                columnMap["cellStyle"] = function (params) {
                    // console.log(params.data, params.value);

                    if (required && params.value === "") {
                        //mark police cells as red
                        return { backgroundColor: "red" };
                    } else {
                        return null;
                    }
                };

                if (element.type === "Date") {
                    columnMap["cellRenderer"] = "datePicker";
                }
                if (element.type === "DD-Fixed") {
                    columnMap["cellRenderer"] = "customDropDownRenderer";
                }
                if (element.type === "DD-Self") {
                    columnMap["cellRenderer"] = "customDropDownRenderer";
                }
                if (element.type === "DD-Suggest") {
                    columnMap["cellRenderer"] = "customDropDownRenderer";
                }
                if (element.type === "Combo") {
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
            // console.log(this.columnDefs );
            // console.log(this.rowData );
            // console.log(this.rowColor);
        });
    }

    gridFilter(months?, date?, searchValue?) {
        this.gridApi.showLoadingOverlay();

        let obj = {
            UserId: this.LocalStorageHandlerService.getSession("userObj").userId,
            RoleId: this.LocalStorageHandlerService.getSession("userObj").roleID,
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
            this.rowResponse = [];
            this.salesData = [];
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
                        ).format("MM/DD/YYYY");

                        this.cellMap['"' + element1.colCode + '"'] = moment(
                            element1.currentCellValue
                        ).format("MM/DD/YYYY");
                        console.log(this.cellMap['"' + element1.colCode + '"']);
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

                /** Calculate Aggregared Header */
                let columnData = this.cellData[0];
                let typeArray = [];
                // console.log(this.cellData[0]);
                // console.log(this.cellData[0]['"OD"'], this.cellData[0]['"ED"'], this.cellData[0]['"VEHGRO"'], this.cellData[0]['"AD"'], this.cellData[0]["type"]);
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
            this.rowResponse = rows;

            // console.log(this.carryOverAmount, this.carryOverUnits,this.cellData[0] )
            // console.log(this.soldAmount, this.soldUnits, )
            // console.log(this.coveredAmount, this.coveredUnits, )
            // console.log(this.deliveredAmount, this.deliveredUnits, )

            console.log(this.routineSelected);

            if (this.routineSelected === 1) {
                this.carryOverAvg =
                    this.carryOverUnits > 0
                        ? Number(this.carryOverAmount) /
                          Number(this.carryOverUnits)
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
                        ? Number(this.deliveredAmount) /
                          Number(this.deliveredUnits)
                        : 0;
            } else if (this.routineSelected === 2) {
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

                console.log(
                    this.totalAmount,
                    this.processedAmount,
                    this.vehicleProfit
                );

                // this.missingAvg =(this.missingUnits > 0)? Number(this.missingAmount)/Number(this.missingUnits):0;
            } else {
                this.tradeinAvg =
                    this.tradeinUnits > 0
                        ? Number(this.tradeinAmount) / Number(this.tradeinUnits)
                        : 0;
            }

            // console.log(rows);
            let searchResult = rows.filter((resp) => {
                let orderDate = resp['"OD"'];
                let payType = resp['"PT"'];
                let financeManager = resp['"FM"'];
                let email = resp['"EM"'];
                let dept = resp['"Dept"'];
                // console.log(resp['"OD"'], resp['"EM"'],email);
                // console.log(email, searchValue);
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

            console.log(searchResult);
            // console.log(this.rowData );

            /*Dispaly search results in grid row array and number of display records found*/
            this.displaySearchResult(searchResult);
            /*-------------------------*/
        });
    }

    displaySearchResult(searchResult) {
        this.records = this.rowData;
        this.rowData = [];
        this.rowData = searchResult;
        console.log(this.rowResponse);
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

    getCssRules(params) {
        if (params.colDef) {
            switch (params.colDef.field) {
                case "status":
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
        return {
            "border-right": "1px solid #ececec",
            backgroundColor: "#fff",
            "justify-content": "flex-start",
            overflow: "hidden",
            "white-space": "nowrap",
            "min-width": "0",
            " text-overflow": "ellipsis",
        };
    }

    search() {
        let searchVal = this.searchForm.get("searchbar").value;
        let previousMonthFilter = this.searchForm.get("previousMonth").value;
        let currentMonthFilter = this.searchForm.get("currentMonth").value;
        let currentMonth = moment();
        let startMonth = moment()
            .subtract(Number(previousMonthFilter) + 1, "months")
            .format("MMM_YYYY");

        let searchResult = [];
        console.log(this.rowResponse);

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
                    console.log(resp['"OD"'], resp['"EM"']);
                    console.log(email, searchVal);
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
            let datafilter;
            let endDate = moment().format("MMM-YYYY");
            let orderDate = resp['"OD"'];
            let payType = resp['"PT"'];
            let financeManager = resp['"FM"'];
            let email = resp['"EM"'];
            let dept = resp['"Dept"'];

            console.log(
                email,
                searchVal,
                email && email.toLowerCase().includes(searchVal.toLowerCase())
            );
            console.log(
                moment(orderDate).isAfter(searchedDate) &&
                    moment(orderDate).isBefore(endDate)
            );

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
        }));
    }

    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }
    filterGrid(option) {
        // If filter matches change active state of columns*/
        if (option === 0) {
            let row = this.rowResponse.filter((res) => {
                // console.log(res.type);
                return res.type.find((el) => el === "carryOver");
            });
            console.log(this.rowResponse, row);
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
                // console.log(res.type);
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
                // console.log(res.type);
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
                // console.log(res.type);
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
        console.log(searchingFormat, startingMonth);
        let searchResult = [];

        searchResult = this.rowData.filter((resp) => {
            let filter = Object.keys(resp).filter((res) => {
                if (res === "orderDate") {
                    let date = resp[res];
                    if (month === 1) {
                        if (date) {
                            console.log(
                                moment(resp[res]).isSame(
                                    searchingFormat,
                                    "months"
                                )
                            );
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
                        console.log(
                            "after:",
                            moment(resp[res]).isAfter(searchingFormat),
                            resp[res]
                        );
                        console.log(
                            "before:",
                            moment(resp[res]).isBefore(startingMonth),
                            resp[res]
                        );

                        return (
                            moment(resp[res]).isAfter(searchingFormat) &&
                            moment(resp[res]).isBefore(startingMonth)
                        );
                    }
                    console.log(
                        date,
                        searchingFormat,
                        moment(resp[res]).isAfter(searchingFormat)
                    );
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
        console.log(searchingFormat);
        let searchResult = [];

        this.monthFilter = searchingFormat + " - " + searchingFormat;

        searchResult = this.rowData.filter((resp) => {
            let filter = Object.keys(resp).filter((res) => {
                if (res === "orderDate") {
                    let date = moment(resp[res]).format("MMM YY");
                    if (date) {
                        console.log(date, searchingFormat);
                        console.log(date === searchingFormat);
                        return date === searchingFormat;
                    }

                    console.log(
                        date,
                        searchingFormat,
                        moment(resp[res]).isAfter(searchingFormat)
                    );
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
            this.years.map((res, index) => {
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
            console.log(this.yearCounter < this.years.length);
            console.log(this.yearCounter, this.years.length);
            this.yearCounter = this.yearCounter + 1;
            let month = moment().format("MMM");
            let year = moment().format("YYYY");
            this.monthActive = "";

            this.years.map((res, index) => {
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

    previousMonth(event) {
        if (this.searchForm.get("currentMonth").value === true) {
            this.searchForm.get("currentMonth").setValue(false);
        }
    }

    resetSearch() {
        this.monthFilter = "";
        this.rowData = this.rowResponse;
    }

    applyCalenderFilter() {
        console.log(this.monthSelected);
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
        console.log("searched value:", searchedDisplayFormat);
        this.monthFilter = searchedDisplayFormat + " - " + currentDisplayFormat;
        console.log(this.monthFilter);

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
        console.log(params.colDef.type);

        if (params.colDef.type === "number") {
            // return {
            //   component: 'numericCellEditor'
            // };
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
        // console.log(this.years);
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
                            console.log(params);
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
                            console.log(params.column.colId);
                            console.log(params.node.rowIndex);
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
                    // console.log(params);
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
                    thisRef.rowColor.map((el) => {
                        if (el.rowId === params.node.rowIndex) {
                            el.color = "blue";
                            el.colId = params.column.userProvidedColDef.colId;
                        }
                    });
                    let rows = [];
                    rows.push(
                        thisRef.gridApi.getDisplayedRowAtIndex(
                            params.node.rowIndex
                        )
                    );
                    thisRef.updateCellColor(params.node.rowIndex);
                    thisRef.gridApi.redrawRows();
                },
                icon: createFlagImg("blue-color"),
                cssClasses: ["pointer"],
            },
            {
                name: "GREEN",
                action: function () {
                    thisRef.rowColor.map((el) => {
                        if (el.rowId === params.node.rowIndex) {
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
                    thisRef.updateCellColor(params.node.rowIndex);
                    thisRef.gridApi.redrawRows();
                },
                icon: createFlagImg("green-color"),
                cssClasses: ["pointer"],
            },
            {
                name: "YELLOW",
                action: function () {
                    thisRef.rowColor.map((el) => {
                        if (el.rowId === params.node.rowIndex) {
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
                    thisRef.updateCellColor(params.node.rowIndex);
                    thisRef.gridApi.redrawRows();
                },
                icon: createFlagImg("yellow-color"),
                cssClasses: ["pointer"],
            },
            {
                name: "RED",
                action: function () {
                    thisRef.rowColor.map((el) => {
                        if (el.rowId === params.node.rowIndex) {
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
                    thisRef.updateCellColor(params.node.rowIndex);
                    thisRef.gridApi.redrawRows();
                },
                icon: createFlagImg("red-color"),
                cssClasses: ["pointer"],
            },
            {
                name: "PURPLE",
                action: function () {
                    thisRef.rowColor.map((el) => {
                        if (el.rowId === params.node.rowIndex) {
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
                    thisRef.updateCellColor(params.node.rowIndex);
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
        console.log(key);
        thisRef.dialogRef = thisRef.dialog.open(component, {
            panelClass: "custom-dialog-container",
            width: width,
            data: {
                key: key,
            },
        });
        thisRef.dialogRef.afterClosed().subscribe((res) => {
            if (res && res.column) {
                console.log(res.column);

                if (res.column.length > 0) {
                    res.column.map((res) => {
                        let column = this.columnDefs.find(
                            (el) => el.headerName === res.columnName
                        );
                        if (column !== undefined) {
                            console.log(column.colId);
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
        this.saleslog.duplicateRows(params).subscribe((res) => {
            this.gridApi.hideOverlay();
            this.gridApi.applyTransaction({ add: newItems });
            this.signalRService.BroadcastLiveSheetData();
        });
    }

    removeCellColor(newItems?) {
        let params = {
            EntryId: "",
        };
        this.saleslog.removeCellColor(params).subscribe((res) => {
            this.signalRService.BroadcastLiveSheetData();
        });
    }

    deleteRow(index) {
        this.gridApi.showLoadingOverlay();
        let params = {
            EntryId: index + 1,
        };
        this.saleslog.deleteRows(params).subscribe((res) => {
            this.gridApi.hideOverlay();
            this.toastHandlerService.generateToast(
                "Row Deleted Successfully",
                "",
                2000
            );
            this.signalRService.BroadcastLiveSheetData();
        });
    }

    updateCellColor(newItems?) {
        let params = {
            EntryId: newItems,
        };
        this.saleslog.updateCellColor(params).subscribe((res) => {
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
        console.log(res, selectedData);
        if (res.remove.length > 0) {
            let index = res.remove[0].rowIndex;
            console.log(index);
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
                key: { id: this.departmentID, viewId: this.routineSelected },
            },
        });
        this.dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.gridApi.applyTransaction({
                    add: [
                        {
                            orderDate: moment(res.date).format("DD-MMM-YY"),
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
                        },
                    ],
                });
            }
        });
    }

    excelExport() {
        this.openModal(this, XlsExportComponent, "400px");
    }

    columnOption() {
        this.openModal(this, ColumnOptionsComponent, "900px", {
            id: this.decryptedDepartmentId,
            viewId: this.routineSelected,
            depId: this.departmentID,
        });
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
