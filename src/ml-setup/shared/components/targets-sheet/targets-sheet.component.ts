import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    SimpleChanges,
    ViewEncapsulation,
    ChangeDetectorRef,
} from "@angular/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { ExcelExportModule } from "@ag-grid-enterprise/excel-export";
import "@ag-grid-community/core/dist/styles/ag-grid.css";
import "@ag-grid-community/core/dist/styles/ag-theme-alpine.css";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { HttpClient } from "@angular/common/http";
import * as moment from "moment";
import { ToastHandlerService } from "app/shared/services/toast-handler.service";
import { SiteTargetsService } from "ml-setup/shared/services/site-targets/site-targets.service";
import {
    MatSnackBar,
    MatSnackBarConfig,
    MatSnackBarRef,
} from "@angular/material/snack-bar";
import { TargetToastComponent } from "../target-toast/target-toast.component";
import { SharedService } from "ml-setup/shared/services/shared/shared.service";
import { Subject, Subscription } from "rxjs";
import { CustomLoadingOverlayComponent } from "../custom-loading-overlay/custom-loading-overlay.component";
import { IndividualTargetsService } from "ml-setup/shared/services/individual-targets/individual-targets.service";
import { DepartmentsService } from "ml-setup/shared/services/departments/departments.service";
import { environment } from "../../../../environments/environment";

@Component({
    selector: "app-targets-sheet",
    templateUrl: "./targets-sheet.component.html",
    styleUrls: ["./targets-sheet.component.scss"],
    encapsulation: ViewEncapsulation.Emulated,
})
export class TargetsSheetComponent implements OnInit {
    @Input() targetSelected: number;
    @Input() dateFilters: any;
    count: number = 0;
    gridApi;
    gridColumnApi;
    editing: boolean = false;
    emptyRows: any = [];
    private _unsubscribeAll: Subject<any>;

    public modules: any[] = [
        ClientSideRowModelModule,
        RowGroupingModule,
        ExcelExportModule,
        MenuModule,
        ColumnsToolPanelModule,
    ];
    columnDefs;
    defaultColDef;
    columnTypes;
    autoGroupColumnDef;
    rowData = [];
    columnData = [];
    getRowNodeId;
    aggFuncs;
    colLength: number = 0;
    baseCondtion: number = 0;

    history: number = 3;
    period: number = 3;
    startFrom: number = null;
    public emptyFieldsCount: number = 0;
    getRowHeight;
    overlayLoadingTemplate;
    frameworkComponents;
    loadingOverlayComponent;
    loadingOverlayComponentParams;

    toastEvent: Subscription;
    departmentsList = [];

    constructor(
        // public snackBarRef: MatSnackBarRef<TargetToastComponent>,
        public sharedService: SharedService,
        public snackBar: MatSnackBar,
        private toastHandlerService: ToastHandlerService,
        private siteTargetSerivce: SiteTargetsService,
        private individualTargetsService: IndividualTargetsService,
        private departmentsService: DepartmentsService,
        private cd: ChangeDetectorRef
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
            cellClass: "row-text-style",
            groupRowRendererParams: {
                suppressCount: true,
            },
            valueFormatter: this.formatNumber.bind(this),
            cellClassRules: {
                boldBorders: this.getCssRules.bind(this),
            },
            onCellValueChanged: this.setRowTotalValue.bind(this),
        };

        this.autoGroupColumnDef = {
            minWidth: 400,
            headerName: "Target",
        };

        this.getRowNodeId = function (data) {
            return data.id;
        };

        this.getRowHeight = function (params) {
            if (params.node.group) {
                return groupHeight;
            } else {
                return rowHeight;
            }
        };

        this.sharedService.getClickEvent().subscribe((res) => {
            this.showEmptyRecords();
        });

        this.sharedService.getClearEvent().subscribe((res) => {
            if (this.targetSelected === 0) {
                this.generateGrid(this.response, "department");
            } else {
                this.generateGrid(this.response, "user");
            }
        });

        // this.overlayLoadingTemplate =
        // '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>';

        this.frameworkComponents = {
            customLoadingOverlay: CustomLoadingOverlayComponent,
        };

        this.loadingOverlayComponent = "customLoadingOverlay";

        this.loadingOverlayComponentParams = {
            loadingMessage: "One moment please...",
        };
    }

    configSuccess: MatSnackBarConfig = {
        panelClass: "style-success",
        duration: 38000,
        horizontalPosition: "center",
        verticalPosition: "bottom",
    };

    response = [
        {
            department: [],
        },
    ];

    indivisual_response = [
        {
            department: [],
        },
    ];

    target = [
        {
            value: "Vehicle Orders",
        },
        {
            value: "Vehicle Profit",
        },
        {
            value: "Trade-in %",
        },
    ];

    selectedDepartment: any = "-1";

    onSelectedDepartment($event) {
        this.selectedDepartment = "-1";

        this.departmentsList
            .filter((x) => x.code === $event)
            .map((x) => {
                this.selectedDepartment = x.code;
            });

        // console.log(this.selectedDepartment, " :: ", this.targetSelected);

        this.generateGridForcefully();
        this.dateFilter(this.dateFilters);
    }

    generateGridForcefully() {
        this.gridApi.showLoadingOverlay();

        let start = moment().format("MMM YY");
        start = start.toLowerCase().replace(" ", "_");

        groupHeight = 20;
        rowHeight = 30;
        this.gridApi.resetRowHeights();

        if (this.targetSelected === 0) {
            let apiParams = {
                Period: this.period,
                startDate: start.toUpperCase(),
                ActualHistory: this.history,
                deptId: this.selectedDepartment,
            };
            /*Fetch all columns data*/
            this.siteTargetSerivce.getTarget(apiParams).subscribe((res) => {
                this.response = res;
                this.generateGrid(this.response, "department");
            });
        } else {
            let apiParams = {
                Period: this.period,
                startDate: start.toUpperCase(),
                ActualHistory: this.history,
                deptId: this.selectedDepartment,
            };
            /*Fetch all columns data*/
            this.individualTargetsService
                .getTarget(apiParams)
                .subscribe((res) => {
                    this.response = res;
                    groupHeight = 20;
                    rowHeight = 30;
                    this.gridApi.resetRowHeights();
                    this.generateGrid(this.response, "user");
                });
        }
    }

    defaultValueOfDepartment;

    getAllDepartmentsByUserId() {
        this.selectedDepartment = "-1";
        // console.log("targetSelected", this.targetSelected);
        this.departmentsService.getAllDepartmentsByUserId().subscribe((res) => {
            res.map((res) => {
                this.departmentsList.push({
                    code: res.id,
                    description: res.name,
                });
            });
            if (this.targetSelected != 0) {
                // this.selectedDepartment = this.departmentsList[0].code;
                this.defaultValueOfDepartment = this.selectedDepartment;
                // console.log("0: ", this.selectedDepartment);
            } else {
                this.defaultValueOfDepartment = "View all";
                // console.log("1: ", this.selectedDepartment);
            }
            this.generateGridForcefully();
        });
    }

    ngOnInit() {
        this.getAllDepartmentsByUserId();
    }

    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            console.log('propName:', propName);
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case "dateFilters": {
                        if (this.dateFilters) {
                            // console.log("date filter");
                            this.dateFilter(this.dateFilters);
                        }
                    }
                }
            }
        }
    }

    valueSetter(params) {
        if (params.data && params.data.target === "Vehicle Orders") {
            let columnName = params.column.userProvidedColDef.field;
            let rowData = this.getAllRows(columnName);
            rowData.forEach((res) => {
                // // console.log(res.data);
            });
        }
        // // console.log(params.newValue,params.oldValue);

        return params.newValue;
    }

    getCssRules(params) {
        if (params.colDef) {
            if (
                params.colDef.type === "current" &&
                params.data.department !== environment.PARENT_SITE_NAME
            ) {
                // // console.log(params.value, isNaN(params.value));
                return (
                    params.value === "" ||
                    params.value === undefined ||
                    isNaN(params.value) ||
                    params.value === null
                );
            }
        }
    }

    getclass(grid, row, col, rowIndex, colIndex) {
        var val = grid.getCellValue(row, col);
        if (val === "male") {
            return "blue";
        } else if (val === "female") {
            return "pink";
        }
    }

    openSnackBar(message) {
        this.snackBar.openFromComponent(TargetToastComponent, {
            data: message,
            ...this.configSuccess,
        });
    }

    showEmptyRecords() {
        this.rowData = [];

        let departmentRow = [];

        let departmentName = environment.PARENT_SITE_NAME;
        if (this.targetSelected === 0) {
            departmentRow.push(
                {
                    id: "total_orders",
                    rowId: "total_orders",
                    target: "Vehicle Orders",
                    department: departmentName,
                },
                {
                    id: "total_profit",
                    rowId: "total_profit",
                    target: "Vehicle Profit",
                    department: departmentName,
                },
                {
                    id: "trade_in",
                    rowId: "trade_in",
                    target: "Trade-in %",
                    department: departmentName,
                },
                ...this.emptyRows
            );
        } else {
            departmentRow.push(
                {
                    id: "total_orders",
                    rowId: "total_orders",
                    target: "Vehicle Orders",
                    department: departmentName,
                },
                {
                    id: "total_profit",
                    rowId: "total_profit",
                    target: "Vehicle Profit",
                    department: departmentName,
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

    getAllRows(columnName?: any, targetColumn?: string) {
        console.log("*************** START ***************");
        console.log("Function: getAllRows");
        console.log("columnName: ", columnName);
        console.log("targetColumn: ", targetColumn);
        
        var rowData = [];
        
        if (this.targetSelected === 1 && this.selectedDepartment == "-1") {
            return rowData;
        }

        let columnData = this.getAllColumn();
        this.gridApi.forEachNode((node) => {
            columnData.forEach((column) => {
                if (node.data && node.data.rowId) {

                    // Individual Target == 1 
                    // Site Target == 0

                    if (this.targetSelected === 1) {
                        let finalColumnName = typeof columnName === "string" ? columnName : columnName.column.userProvidedColDef.field;
                       
                        if (
                            node.data &&
                            node.data.target === targetColumn &&
                            column.userProvidedColDef.field === finalColumnName &&
                            node.data.rowId !== "total_orders" &&
                            node.data.rowId !== "total_profit"
                        ) {
                            let value = Number(
                                node.data[column.userProvidedColDef.field]
                            );

                            rowData.push({
                                department: node.data.department,
                                target: node.data.target,
                                column: column.userProvidedColDef.field,
                                data: value,
                            });

                           
                            console.log("option is 1 and column is: ",column.userProvidedColDef.field);
                            console.log("node.data: ", node.data);
                            console.log("node.data.target: ", node.data.target);
                            console.log("rowData: ", rowData);
                        }
                    } else {
                        if (
                            node.data &&
                            node.data.target === targetColumn &&
                            column.userProvidedColDef.field === columnName &&
                            node.data.rowId !== "total_orders" &&
                            node.data.rowId !== "total_profit"
                        ) {
                            let value = Number(
                                node.data[column.userProvidedColDef.field]
                            );
                            rowData.push({
                                department: node.data.department,
                                target: node.data.target,
                                column: column.userProvidedColDef.field,
                                data: value,
                            });

                            console.log("option is 0 and column is: ",column.userProvidedColDef.field);
                            console.log("node.data: ", node.data);
                            console.log("node.data.target: ", node.data.target);
                            console.log("rowData: ", rowData);
                        }
                    }
                }
            });
        });

        console.log("*************** END ***************");
        return rowData;
    }

    getRows(currentColumn?: string, targetColumn?: string, column?, rows?) {
        var rowData = [];

        rows.forEachNode((node) => {
            column.forEach((column) => {
                if (node.data && node.data.rowId) {
                    if (
                        node.data &&
                        node.data.target === targetColumn &&
                        column.userProvidedColDef.field === currentColumn
                    ) {
                        let value = Number(
                            node.data[column.userProvidedColDef.field]
                        );
                        rowData.push({
                            department: node.data.department,
                            target: node.data.target,
                            column: column.userProvidedColDef.field,
                            data: value,
                        });
                    }
                }
            });
        });
        return rowData;
    }

    getAllCurrentRows() {
        this.emptyRows = [];
        let columnData = this.getAllColumn();

        this.gridApi.forEachNode((node) => {
            columnData.forEach((column) => {
                if (
                    node.data &&
                    column.userProvidedColDef.type === "current" &&
                    node.data.rowId !== "total_orders" &&
                    node.data.rowId !== "total_profit" &&
                    node.data.rowId !== "trade_in"
                ) {
                    let value = Number(
                        node.data[column.userProvidedColDef.field]
                    );

                    if (value === 0 || isNaN(value)) {
                        this.emptyRows.push(node.data);
                        this.emptyFieldsCount = this.emptyFieldsCount + 1;
                    }
                }
            });
        });

        return this.emptyFieldsCount;
    }

    getAllColumn(column?: string) {
        return this.gridColumnApi.getAllColumns();
    }

    formatNumber(params) {
        if (params.data && params.data.target) {
            var number = params.value;
            var column = params.data.target;

            let rowData = this.target.find((el) => el.value === params.value);

            if (
                params.value !== undefined &&
                rowData === undefined &&
                isNaN(Number(params.value))
            ) {
                return "";
            } else {
                if (
                    typeof params.value !== "undefined" &&
                    column === "Trade-in %"
                ) {
                    let rowData = this.target.find(
                        (res) => res.value === params.value
                    );
                    if (
                        rowData === undefined &&
                        params.value !== "" &&
                        params.value !== null
                    ) {
                        if (Number(params.value) <= 100) {
                            return params.value + "%";
                        } else {
                            return "";
                        }
                    }
                } else if (
                    column !== "Vehicle Orders" &&
                    params.value !== undefined &&
                    column === "Vehicle Profit"
                ) {
                    let rowData = this.target.find(
                        (res) => res.value === params.value
                    );

                    if (
                        rowData === undefined &&
                        params.value !== "" &&
                        params.value !== null
                    ) {
                        return (
                            "$" +
                            Math.floor(number)
                                .toString()
                                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                        );
                    }
                } else if (
                    params.data.rowId === "total_profit" &&
                    column === "Vehicle Profit" &&
                    typeof params.value === "undefined"
                ) {
                    return "$0";
                } else if (
                    params.data.rowId === "total_orders" &&
                    column === "Vehicle Orders" &&
                    typeof params.value === "undefined"
                ) {
                    return "0";
                } else if (
                    params.data.rowId === "trade_in" &&
                    column === "Trade-in %" &&
                    typeof params.value === "undefined"
                ) {
                    return "0%";
                }
            }
        }
    }

    getRowValue(params) {
        let rowIndex = params.node.rowIndex;
        let rowData = [];
        this.gridApi.forEachNode((node) => rowData.push(node.data));

        if (params.data.target === "Trade-in %") {
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

        console.log("*************** START ***************");
        console.log("Function: setRowTotalValue");
        console.log("params: ", params);

        if (
            params.data.rowId !== "total_profit" &&
            params.data.rowId !== "total_orders" &&
            params.data.rowId !== "trade_in"
        ) {
            /*If target column equal to vehicle orders then allow*/
            if (params.data && params.data.target === "Vehicle Orders") {
                this.calculateRowData(
                    params,
                    "Vehicle Orders",
                    "total_orders",
                    this.targetSelected
                );
                this.baseCondtion = 1;
                this.insertCellData(params);
            } else if (params.data && params.data.target === "Vehicle Profit") {
                this.calculateRowData(
                    params,
                    "Vehicle Profit",
                    "total_profit",
                    this.targetSelected
                );
                this.baseCondtion = 1;
                this.insertCellData(params);
            } else if (params.data && params.data.target === "Trade-in %") {
                this.calculateRowData(params, "Trade-in %", "trade_in", 0);
                this.baseCondtion = 1;
                this.insertCellData(params);
            }

            /*------------------------------------------------------*/
        }

        console.log("*************** END ***************");
    }

    insertCellData(params) {

        console.log('*************** START ***************')
        console.log("Function: insertCellData");
        console.log("params: ",params);

        if (this.targetSelected === 0) {
            /*Insert data*/
            let apiParams = {
                period: params.colDef.field,
                deptId: params.data.rowId,
                ColumnName: params.data.target,
                rowValue: params.newValue,
            };
            this.siteTargetSerivce.postTarget(apiParams).subscribe(
                (res) => {
                    this.toastHandlerService.generateToast(
                        res.message,
                        "Clear",
                        2000
                    );
                },
                (err) => {
                    let message = "Error has occured.";
                    this.toastHandlerService.generateToast(
                        message,
                        "Clear",
                        2000
                    );
                }
            );
            /*------------*/
        } else {
            /*Insert data*/
            let apiParams = {
                period: params.colDef.field,
                deptId: params.data.deptId,
                userId: params.data.rowId,
                ColumnName: params.data.target,
                rowValue: params.newValue,
            };
            this.individualTargetsService.updateTarget(apiParams).subscribe(
                (res) => {
                    this.toastHandlerService.generateToast(
                        res.message,
                        "Clear",
                        2000
                    );
                },
                (err) => {
                    let message = "Error has occured.";
                    this.toastHandlerService.generateToast(
                        message,
                        "Clear",
                        2000
                    );
                }
            );
            /*------------*/
        }

        console.log('*************** END ***************')
    }

    calculateRowData(
        params,
        targetColumn: string,
        rowName: string,
        option?: number
    ) {

        const consoleStyle  = 'font-weight: bold; font-size: 15px;color: red; font-family:"exo"';
        const consoleStyle2 = 'font-weight: bold; font-size: 15px;color: blue; font-family:"exo"';
        const consoleStyle3 = 'font-weight: bold; font-size: 15px;color: orange; font-family:"exo"';

        console.log('*************** START ***************')
        console.log('%c Function: calculateRowData!', consoleStyle);
        console.log("option: ", option);
        console.log("%c params: ", consoleStyle ,  params);

        let columnName;

        let finalColumnName = typeof params === "string" ? params : params.colDef.field;

        if (option === 1) {
            /*Fetch All columns*/
            columnName = finalColumnName;
            /*-----------------*/
        } else {
            /*Fetch All columns*/
            columnName = params.column.userProvidedColDef.field;
            /*-----------------*/
        }

        /*Fetch all Rows*/
        let rowData = this.getAllRows(columnName, targetColumn);
        /*--------------*/


        console.log("rowName: ", rowName);
        console.log("targetColumn: ", targetColumn);
        console.log("columnName: ", columnName);
        console.log("rowData: ", rowData);
       

        /*Loop over rows and get calculate total*/

        let total = 0;
        rowData.forEach((res) => {
            if (!isNaN(res.data)) {
                total = total + res.data;
            }
        });

        console.log("total: ", total);

        /*-----------------------*/

        /*Fetch Total orders Node with getRowNode method of gridAPI*/
        var rowNode = this.gridApi.getRowNode(rowName);
        console.log("%c rowNode: ", consoleStyle2, rowNode);
        /*----------------------------------------------------*/

        if (option === 1) {
            if (total && total > 0) {
                /*Set total data calculated of Vehicle Orders */

                setTimeout(() => {
                    console.log("%c finalColumnName: ", consoleStyle3, finalColumnName);
                    rowNode.setDataValue(finalColumnName, total);
                },1000);

             
                /*---------------------------------------------*/
            }
        } else {
            /*Set total data calculated of Vehicle Orders */
            rowNode.setDataValue(params.colDef.field, total);
            /*---------------------------------------------*/
        }

        console.log('%c *************** END ***************', consoleStyle)
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        this.gridApi.showLoadingOverlay();

        let start = moment().format("MMM YY");
        start = start.toLowerCase().replace(" ", "_");

        groupHeight = 20;
        rowHeight = 30;
        this.gridApi.resetRowHeights();

        if (this.targetSelected === 0) {
            let apiParams = {
                Period: this.period,
                startDate: start.toUpperCase(),
                ActualHistory: this.history,
            };
            /*Fetch all columns data*/
            this.siteTargetSerivce.getTarget(apiParams).subscribe((res) => {
                this.response = res;
                this.generateGrid(this.response, "department");
            });
        } else {
            let apiParams = {
                Period: this.period,
                startDate: start.toUpperCase(),
                ActualHistory: this.history,
                deptId: this.selectedDepartment,
            };
            /*Fetch all columns data*/
            this.individualTargetsService
                .getTarget(apiParams)
                .subscribe((res) => {
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

    generateGrid(targetResponse, key) {
        console.log('*************** START ***************')
        console.log("Function: generateGrid");

        this.gridApi.showLoadingOverlay();

        /*Initalize all variables*/
        let response = [];
        let row1 = {};
        let departmentRow = [];
        let column = [];
        let period = [];
        let history = [];
        let current = [];
        this.count = 0;
        this.colLength = 0;
        this.columnDefs = [];
        this.rowData = [];
        this.emptyFieldsCount = 0;
        /*------------------------*/

        // console.log("targetResponse", targetResponse);
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
                headerName: "Target",
                field: "target",
                minWidth: 300,
                maxWidth: 300,
                pinned: "left",
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

        if (key === "department") {
            departmentRow.push(
                {
                    id: "total_orders",
                    rowId: "total_orders",
                    target: "Vehicle Orders",
                    department: environment.PARENT_SITE_NAME,
                },
                {
                    id: "total_profit",
                    rowId: "total_profit",
                    target: "Vehicle Profit",
                    department: environment.PARENT_SITE_NAME,
                },
                {
                    id: "trade_in",
                    rowId: "trade_in",
                    target: "Trade-in %",
                    department: environment.PARENT_SITE_NAME,
                }
            );
        } else {
            departmentRow.push(
                {
                    id: "total_orders",
                    rowId: "total_orders",
                    target: "Vehicle Orders",
                    department: environment.PARENT_SITE_NAME,
                },
                {
                    id: "total_profit",
                    rowId: "total_profit",
                    target: "Vehicle Profit",
                    department: environment.PARENT_SITE_NAME,
                }
            );
        }

        /*----------------------------*/

        let count = 0;

        /*Fetch data from API request and Format for Grid*/
        response.forEach((depart) => {
            /*Departments Array*/
            depart["column"].map((res, index) => {
                row1 = {};
                let result = res;

                if (result.hasOwnProperty("vehicleOrders")) {
                    result["vehicleOrders"].map((res) => {
                        row1["id"] = count;
                        if (key === "department") {
                            row1["rowId"] = depart["deptId"];
                            row1["department"] = depart["departmentName"];
                        } else {
                            row1["rowId"] = depart["userId"];
                            row1["deptId"] = depart["deptId"];
                            row1["department"] = depart["userName"];
                        }
                        row1[res.period] = res.value;
                        row1["target"] = "Vehicle Orders";
                    });
                    departmentRow.push({ ...row1 });
                    count++;
                }

                if (result.hasOwnProperty("vehicleProfit")) {
                    result["vehicleProfit"].map((res) => {
                        row1["id"] = count;
                        if (key === "department") {
                            row1["rowId"] = depart["deptId"];
                            row1["department"] = depart["departmentName"];
                        } else {
                            row1["rowId"] = depart["userId"];
                            row1["deptId"] = depart["deptId"];
                            row1["department"] = depart["userName"];
                        }
                        row1[res.period] = res.value;
                        row1["target"] = "Vehicle Profit";
                    });
                    departmentRow.push({ ...row1 });
                    count++;
                }

                if (result.hasOwnProperty("tradeInPercentage")) {
                    result["tradeInPercentage"].map((res) => {
                        row1["id"] = count;
                        if (key === "department") {
                            row1["rowId"] = depart["deptId"];
                            row1["department"] = depart["departmentName"];
                        } else {
                            row1["rowId"] = depart["userId"];
                            row1["deptId"] = depart["deptId"];
                            row1["department"] = depart["userName"];
                        }
                        row1[res.period] = res.value;
                        row1["target"] = "Trade-in %";
                    });
                    departmentRow.push({ ...row1 });
                    count++;
                }
            });
        });
        /*------------------------------*/

        // console.log("Column:", column);
        // // console.log('DepartmentRow:',departmentRow);

        /*Load Fetched data into Grid*/
        this.columnDefs = column;
        this.columnData = column;
        this.rowData = departmentRow;
        /*---------------------------*/

        console.log("columnDefs: ",column);

        this.calculateTotal(column, 0);
        console.log('*************** END ***************')
    }

    calculateTotal(column, option) {
        /*Set Toast for empty Rows*/
        setTimeout(() => {
            let col = column.filter((el) => {
                return (
                    el.headerName !== "Target" && el.headerName !== "department"
                );
            });

            // this.colLength = col.length * 2;

            column.map((res) => {
                /*Calculate total orders and profit*/
                this.calculateRowData(
                    res.field,
                    "Vehicle Orders",
                    "total_orders",
                    1
                );
                this.calculateRowData(
                    res.field,
                    "Vehicle Profit",
                    "total_profit",
                    1
                );

                /*------------------------------------------------------*/
            });

            /*Fetch all Empty Rows*/
            let emptyRows = this.getAllCurrentRows();
            /*--------------------*/

            if (option === 1) {
                this.configSuccess.duration = null;
                let message = "1 filter applied";
                this.openSnackBar(message);
            } else {
                // /*If empty rows exist show toast*/
                // if (emptyRows > 0) {
                //     let message = emptyRows + " Values missing.";
                //     this.openSnackBar(message);
                // }
            }
            /*------------------------------*/
        }, 1000);
        /*------------------------*/
    }

    generateColumns(history, current, period) {
        this.fetchHistoryMonths(history);
        this.fetchCurrentMonths(current);
        this.fetchPeriods(period);
    }

    fetchCurrentMonths(column) {

        /*Generate Key and value for startFrom Object from momentJs*/
        let month = this.startFrom
            ? moment(this.startFrom).format("MMM YY")
            : moment().format("MMM YY");
        let key = month.toLowerCase().replace(" ", "_");

        column.push({
            headerName: month.toUpperCase(),
            field: key,
            suppressMovable: true,
            type: "current",
        });
    }

    cellClass(grid, row, col, rowIndex, colIndex) {
        var val = this.gridColumnApi.getCellValue(row, col);
        if (val === "") {
            return "required";
        }
    }

    fetchHistoryMonths(column) {
        for (let i = this.history; i > 0; i--) {
            /*Generate Key and value for startFrom Object from momentJs*/
            let month = this.startFrom
                ? moment(this.startFrom).subtract(i, "months").format("MMM YY")
                : moment().subtract(i, "months").format("MMM YY");
            let key = month.toLowerCase().replace(" ", "_");
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

    fetchPeriods(column) {

        for (let i = 1; i <= this.period; i++) {
            /*Generate Key and value for startFrom Object from momentJs*/
            let month = this.startFrom
                ? moment(this.startFrom).add(i, "months").format("MMM YY")
                : moment().add(i, "months").format("MMM YY");
            let key = month.toLowerCase().replace(" ", "_");


            column.push({
                headerName: month.toUpperCase(),
                field: key,
                suppressMovable: true,
                // colId: key,
                type: "period",
            });
        }
    }

    dateFilter(object: any) {
        let period = object.period;
        let history = object.history;
        let startFrom = object.startFrom;

        this.period = period;
        this.history = history;
        this.startFrom = startFrom;

        let start = moment(this.startFrom).format("MMM YY");
        start = start.toLowerCase().replace(" ", "_");

        let apiParams = {
            period: this.period,
            StartDate: start.toUpperCase(),
            ActualHistory: this.history,
        };

        this.gridApi.showLoadingOverlay();

        groupHeight = 20;
        rowHeight = 30;
        this.gridApi.resetRowHeights();

        if (this.targetSelected === 0) {
            let apiParams = {
                Period: this.period,
                startDate: start.toUpperCase(),
                ActualHistory: this.history,
            };
            /*Fetch all columns data*/
            this.siteTargetSerivce.getTarget(apiParams).subscribe((res) => {
                this.response = res;
                this.generateGrid(this.response, "department");
            });
        } else {
            let apiParams = {
                Period: this.period,
                startDate: start.toUpperCase(),
                ActualHistory: this.history,
                deptId: this.selectedDepartment,
            };
            /*Fetch all columns data*/
            this.individualTargetsService
                .getTarget(apiParams)
                .subscribe((res) => {
                    this.response = res;
                    this.generateGrid(this.response, "user");
                });
        }
    }

    cellStyling(params) {
        if (params.node.level === 0) {
            return {
                backgroundColor: "#2076D2",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                height: "30px",
            };
        } else if (
            params.data.rowId !== "total_orders" &&
            params.data.rowId !== "total_profit" &&
            params.data.rowId !== "trade_in" &&
            params["column"]["userProvidedColDef"].type === "current"
        ) {
            return {
                backgroundColor: "#fff",
                "border-right": "1px solid #ececec",
                color: "#000",
                "font-weight": "normal",
            };
        } else if (
            params.data.rowId === "total_orders" &&
            params["column"]["userProvidedColDef"].type === "history" &&
            params["column"]["userProvidedColDef"].type !== "department" &&
            params["column"]["userProvidedColDef"].pinned !== "left"
        ) {
            return {
                backgroundColor: "#fffbde",
                color: "#4b8cd8",
                cursor: "pointer",
                "font-weight": "normal",
                "pointer-events": "none",
                "border-right": "1px solid #ececec",
            };
        } else if (
            params.data.rowId === "total_profit" &&
            params["column"]["userProvidedColDef"].type === "history" &&
            params["column"]["userProvidedColDef"].type !== "department" &&
            params["column"]["userProvidedColDef"].pinned !== "left"
        ) {
            return {
                backgroundColor: "#fffbde",
                color: "#4b8cd8",
                cursor: "pointer",
                "font-weight": "normal",
                "pointer-events": "none",
                "border-right": "1px solid #ececec",
            };
        } else if (
            params.data.rowId === "trade_in" &&
            params["column"]["userProvidedColDef"].type === "history" &&
            params["column"]["userProvidedColDef"].type !== "department" &&
            params["column"]["userProvidedColDef"].pinned !== "left"
        ) {
            return {
                backgroundColor: "#fffbde",
                color: "#4b8cd8",
                cursor: "pointer",
                "font-weight": "normal",
                "pointer-events": "none",
                "border-right": "1px solid #ececec",
            };
        } else if (
            params["column"]["userProvidedColDef"].type === "history" &&
            params["column"]["userProvidedColDef"].type !== "current"
        ) {
            return {
                backgroundColor: "#fffbde",
                color: "#000",
                cursor: "pointer",
                "pointer-events": "none",
                "border-right": "1px solid #ececec",
                "font-weight": "normal",
            };
        } else if (
            params.data.rowId === "total_orders" &&
            params["column"]["userProvidedColDef"].type !== "history" &&
            params["column"]["userProvidedColDef"].type !== "department" &&
            params["column"]["userProvidedColDef"].pinned !== "left"
        ) {
            return {
                "pointer-events": "none",
                backgroundColor: "#e7eefd",
                color: "#4b8cd8",
                "font-weight": "normal",
                cursor: "pointer",
            };
        } else if (
            params.data.rowId === "total_profit" &&
            params["column"]["userProvidedColDef"].type !== "history" &&
            params["column"]["userProvidedColDef"].type !== "department" &&
            params["column"]["userProvidedColDef"].pinned !== "left"
        ) {
            return {
                "pointer-events": "none",
                backgroundColor: "#e7eefd",
                color: "#4b8cd8",
                "font-weight": "normal",
                cursor: "pointer",
            };
        } else if (
            params.data.rowId === "trade_in" &&
            params["column"]["userProvidedColDef"].type !== "history" &&
            params["column"]["userProvidedColDef"].type !== "department" &&
            params["column"]["userProvidedColDef"].pinned !== "left"
        ) {
            return {
                "pointer-events": "none",
                backgroundColor: "#e7eefd",
                color: "#4b8cd8",
                "font-weight": "normal",
                cursor: "pointer",
            };
        }

        return {
            backgroundColor: "#fff",
            "border-right": "1px solid #ececec",
            color: "#000",
            "font-weight": "normal",
        };
    }

    exportGird() {
        this.gridApi.exportDataAsExcel({
            exportMode: "xlsx",
            sheetName: "site-target",
            processRowGroupCallback: rowGroupCallback,
        });
    }
}

function rowGroupCallback(params) {
    return params.node.key;
}

var groupHeight, rowHeight;
