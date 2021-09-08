import { LocalStorageHandlerService } from "../../../../app/shared/services/local-storage-handler.service";
import {
    Component,
    OnInit,
    ElementRef,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EncryptionService } from "app/shared/services/encryption.service";
import * as Highcharts from "highcharts";
import * as moment from "moment";
import { ToastHandlerService } from "app/shared/services/toast-handler.service";
import * as data from "../salesGraph.json";
import * as filteredData from "./salesFilterByGraph.json";
import * as pivotDD from "../pivotTable.json";

import * as _ from "lodash";
import { DashboardService } from "ml-routine/shared/services/dashboard/dashboard.service";


declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);

export interface SalesGraphUser {
    users: SalesGraphUserObject[];
}

export interface SalesGraphUserObject {
    name: string;
    seriesData: SeriesDatum[];
}

export interface SeriesDatum {
    graphType: string;
    legendName: string;
    yAxis: number;
    isYAxis: boolean;
    isXAxis: boolean;
    tooltip: SalesGraphUserTooltip;
    columnData: Datum[] | null;
    color: string;
    splineData: Datum[] | null;
}

export interface Datum {
    x: Date;
    y: number;
}

export interface SalesGraphUserTooltip {
    valuePrefix: string;
}

@Component({
    selector: "ml-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
    @ViewChild("container", { static: false }) container;
    @ViewChild("saleperson", { static: false }) saleperson;

    @ViewChildren(DashboardComponent) collapses: DashboardComponent[];

    vehicleProfit = 0;
    vehicleOrders = 0;
    highcharts = Highcharts;

    sliderIndex: number;
    searchDate: any = [];
    rowData: any;
    seriesData: any[] = [];
    seriesObj: any;
    pivotData = [];
    graphData = [];
    private postProcessPopup;

    monthSearch: any;
    animationState = "out";

    currentDate: any = "";
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
        "Nov",
        "Dec",
    ];
    monthActive: any;
    yearCounter = 0;
    monthModal: boolean = false;
    monthSelected: any;
    monthFilter: string;
    searchDateBar: string;

    yearActive: string;
    sliderItem: string;

    private toggleColumns: boolean = true;
    decryptedDepartmentId: string;

    groupByHeader: string;
    orderHeader: string = "Orders";
    time: string = "Today";
    field: string;
    tableHeaderData: any[] = [];
    tableData: any;
    chartLoader: boolean = false;
    staticTableHeader = pivotDD.pivotData.staticTableHeader;
    salesPersonGrossLabel: string = "";
    salesPersonVehicleLabel: string = "";

    options = [
        { key: "Group by: Total", value: "By Total" },
        { key: "Group by: By Sale Person", value: "By Sale Person" },
        { key: "Group by: By Department", value: "By Department" },
    ];

    orderOptions = [
        { key: "Order covered", value: "Covered" },
        { key: "Order delivered", value: "Delivered" },
        { key: "Order sold", value: "Sold" },
    ];

    filterList: any[] = [
        { key: "DEP/SP", value: "Department / Sales Person" },
        { key: "DEP/VEHTP", value: "Department / VEH.Type" },
        { key: "SP", value: "Sales Person" },
        { key: "SP/VEHTP", value: "Sales Person / VEH.Type" },
        { key: "SP/DM", value: "Sales Person / Delivery Month" },
        { key: "VEHTP/VEHMOD", value: "VEH.Type / VEH.Model" },
        { key: "VEHTP/VEHCOL", value: "VEH.Type / VEH.Colour" },
        { key: "INQ/SP", value: "Inquiry / Sales Person" },
        { key: "ST/SP", value: "Status / Sales Person" },
        { key: "ST/VEHTP", value: "Status / VEH.Type" },
        { key: "ST/DEPT", value: "Status / Dept." },
        { key: "SOV/VEHTP", value: "Source of Vehicle / VEH.Type" },
        { key: "SOV/SP", value: "Source of Vehicle / Sales Person" },
    ];

    filterValue: any = { key: "DEP/SP", value: "Department / Sales Person" };

    orderList = [
        { key: "Orders Delivered", value: "Delivered" },
        { key: "Orders Sold", value: "Sold" },
        // { key: "Orders Reportable", value: "Reportable" },
        // { key: "Orders Reported", value: "Reported" },
    ];

    dateRange = [
        { key: "This Month", value: "This Month" },
        // { key: "Today", value: "Today" },
        // { key: "Yesterday", value: "Yesterday" },
        // { key: "Date Range", value: "Date Range" },
    ];

    groupBy = 1;
    tab = 1;

    dataValue: any = { key: "Group by: Total", value: "By Total" };
    orderValue: any = { key: "Order covered", value: "Covered" };
    filter = "";
    salepersonArray = [];
    displayKey = "value";
    isDisable = false;

    styleGuide = {
        // caretClass: 'caret',
        selectBoxClass: "ng-dropdown-wrapper",
        selectMenuClass: "dropdown2",
        optionsClass: "option",
    };

    chartOptions: any;
    chartsalepersonOptions: any;

    grandTotalOrders = 0;
    grandTotalProfit = 0;

    defaultDate: any = "This Month";
    defaultOrder: any = { key: "Orders Delivered", value: "Delivered" };
    departmentName: string = "";
    isDataList = false;
    searchKeys = ["key", "value"];
    activeRow: any = [];
    activeAccrdn: any = 1;
    pivotTab: any = [];

    isGroupDashboard = false;
    targetObj: any = {
        vehOrders: {
            target: 0,
            mtdTarget: 0,
            mtdResult: 0,
            mtdDifference: 0,
            mdtPercentage: 0,
        },
        vehProfit: {
            target: 0,
            mtdTarget: 0,
            mtdResult: 0,
            mtdDifference: 0,
            mdtPercentage: 0,
        },
    };
    pivotLoader: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private LocalStorageHandlerService: LocalStorageHandlerService,
        private dashboardService: DashboardService,
        private encryptionService: EncryptionService,
        private toastHandlerService: ToastHandlerService
    ) {
        this.route.paramMap.subscribe((params) => {
            this.chartLoader = true;
            this.decryptedDepartmentId = "";
            this.groupBy = 1;

            var coll = document.getElementsByClassName("collapsible");
            var i;
            let dateFormat = moment().add().format("MMM_YY").toUpperCase();
            this.monthFilter = dateFormat;
            this.currentDate = moment().format("MMM - DD");

            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function () {
                    this.classList.toggle("active");
                    var content = this.nextElementSibling;
                    if (content.style.display === "block") {
                        content.style.display = "none";
                    } else {
                        content.style.display = "block";
                    }
                });
            }

            if (params.get("id") != null) {
                this.decryptedDepartmentId = this.encryptionService.convertToEncOrDecFormat(
                    "decrypt",
                    params.get("id")
                );
                this.departmentName = this.LocalStorageHandlerService
                    .getFromStorage("userObj")
                    .departmentAccess.find((res) => {
                        return (
                            Number(res.departmentId) ===
                            Number(this.decryptedDepartmentId)
                        );
                    }).departmentName;

                this.constructPivotTableDD();
                this.fetchSaleGraph(
                    this.dataValue.value,
                    this.orderValue.value
                );
            } else {
                // { key: "Group by: By Sale Person", value: "By Sale Person" },
                this.options = this.options.filter(
                    (x) => x.key !== "Group by: By Sale Person"
                );
                this.constructPivotTableDD();
                this.fetchSaleGraph(
                    this.dataValue.value,
                    this.orderValue.value
                );
            }
        });
    }

    fetchSaleGraph(groupBy, orderBy) {
        this.chartLoader = true;
        let param = {
            Deptid: this.decryptedDepartmentId
                ? this.decryptedDepartmentId
                : "-1", // if called on GROUP DASHBOARD then this would be -1
            PastMonths: 1, // it will always be 1
            TillDate: this.monthFilter, // take this value from calendar and sent to this API
            GroupBy: groupBy, // Take values from first dropdown
            OrderBy: orderBy, // Possible values are Delivered, Covered, Sold
            UserId: this.LocalStorageHandlerService.getFromStorage("userObj").userId
        };

        this.dashboardService.generateSalesGraph(param).subscribe(
            (data) => {
                if (
                    data &&
                    data.seriesData !== null &&
                    data.seriesData !== undefined
                ) {
                    // console(data.seriesData);
                    this.generateSalesGraph(data);
                } else {
                    this.chartLoader = false;
                }
            },
            (err) => {
                this.chartLoader = false;
            }
        );
    }

    ngOnInit() {}

    dateSetting(event) {
        this.monthActive = event.monthActive;
        this.yearActive = event.yearActive;
        this.monthSelected = event.monthSelected;
        this.sliderIndex = event.monthSelected;
        this.sliderItem = event.sliderItem;
        this.searchDateBar = event.monthFilter;

        if (this.tab === 1) {
            this.graphData = this.seriesData;
            if (event.option === 1) {
                this.monthFilter = event.dateFormat;
            } else {
                this.monthFilter = event.calender;
            }

            if (this.dataValue.value === "By Sale Person") {
                this.groupBy = 2;
                this.fetchSalePersonsGraph(
                    this.dataValue.value,
                    this.orderValue.value
                );
            } else {
                this.groupBy = 1;
                this.fetchSaleGraph(
                    this.dataValue.value,
                    this.orderValue.value
                );
            }
        } else {
            this.pivotData = this.pivotTab;
            if (event.option === 1) {
                this.monthFilter = event.dateFormat;
            } else {
                this.monthFilter = event.calender;
            }
            this.constructPivotTableDD();
        }
    }

    calculateTableData(graphData, filterOptions?) {
        let salesObject: any = new Object();
        salesObject = graphData["target"];

        if (
            salesObject &&
            this.targetObj["vehOrders"] &&
            this.targetObj["vehProfit"]
        ) {
            /*Vechicle Orders*/
            this.targetObj["vehOrders"]["target"] = salesObject["vehOrders"]["target"];
            this.targetObj["vehOrders"]["mtdTarget"] = salesObject["vehOrders"]["mtdTarget"];
            this.targetObj["vehOrders"]["mtdResult"] = salesObject["vehOrders"]["mtdResult"];
            this.targetObj["vehOrders"]["mtdPercentage"] = salesObject["vehOrders"]["mtdTarget"] &&
                salesObject["vehOrders"]["mtdResult"] ? (salesObject["vehOrders"]["mtdResult"] /
                          salesObject["vehOrders"]["mtdTarget"]) * 100 : 0;
            this.targetObj["vehOrders"]["mtdDifference"] = salesObject["vehOrders"]["mtdTarget"] &&
                salesObject["vehOrders"]["mtdResult"] 
                    ? salesObject["vehOrders"]["mtdResult"] - salesObject["vehOrders"]["mtdTarget"]
                    : 0;

            /*Vechicle Profit*/
            this.targetObj["vehProfit"]["target"] = salesObject["vehProfit"]["target"];
            this.targetObj["vehProfit"]["mtdTarget"] = salesObject["vehProfit"]["mtdTarget"];
            this.targetObj["vehProfit"]["mtdResult"] = salesObject["vehProfit"]["mtdResult"];
            this.targetObj["vehProfit"]["mtdPercentage"] = salesObject["vehProfit"]["mtdTarget"] &&
                salesObject["vehProfit"]["mtdResult"]
                    ? (salesObject["vehProfit"]["mtdResult"] / salesObject["vehProfit"]["mtdTarget"]) *
                      100
                    : 0;
            this.targetObj["vehProfit"]["mtdDifference"] = salesObject["vehProfit"]["mtdTarget"] &&
                salesObject["vehProfit"]["mtdResult"]
                    ? salesObject["vehProfit"]["mtdResult"] - salesObject["vehProfit"]["mtdTarget"]
                    : 0;
        }
    }

    resetSearch() {
        this.searchDateBar = "";

        let dateFormat = moment().add().format("MMM_YY").toUpperCase();
        this.monthFilter = dateFormat;
        this.currentDate = moment().format("MMM - DD");

        if (this.tab === 1) {
            this.fetchSaleGraph(this.dataValue.value, this.orderValue.value);
        } else {
            this.constructPivotTableDD();
        }
    }

    generateSalesGraph(graphData) {
        let dataAry = [];
        let legendArray: any[] = [];
        this.seriesData = [];

        this.calculateTableData(graphData);

        graphData.seriesData.forEach((element) => {
            let salesObject: any = new Object();
            let markerObj = new Object();
            let valuePrefx: any = new Object();

            salesObject["type"] = element.graphType;
            salesObject["name"] = element.legendName;
            salesObject["yAxis"] = element.yAxis;

            switch (element.month) {
                case "Jan": {
                    salesObject["pointStart"] = Date.UTC(2010, 0, 1);
                    break;
                }
                case "Feb": {
                    salesObject["pointStart"] = Date.UTC(2010, 1, 1);
                    break;
                }
                case "Mar": {
                    salesObject["pointStart"] = Date.UTC(2010, 2, 1);
                    break;
                }
                case "Apr": {
                    salesObject["pointStart"] = Date.UTC(2010, 3, 1);
                    break;
                }
                case "May": {
                    salesObject["pointStart"] = Date.UTC(2010, 4, 1);
                    break;
                }
                case "Jun": {
                    salesObject["pointStart"] = Date.UTC(2010, 5, 1);
                    break;
                }
                case "Jul": {
                    salesObject["pointStart"] = Date.UTC(2010, 6, 1);
                    break;
                }

                case "Aug": {
                    salesObject["pointStart"] = Date.UTC(2010, 7, 1);
                    break;
                }
                case "Sep": {
                    salesObject["pointStart"] = Date.UTC(2010, 8, 1);
                    break;
                }
                case "Oct": {
                    salesObject["pointStart"] = Date.UTC(2010, 9, 1);
                    break;
                }
                case "Nov": {
                    salesObject["pointStart"] = Date.UTC(2010, 10, 1);
                    break;
                }
                case "Dec": {
                    salesObject["pointStart"] = Date.UTC(2010, 11, 1);
                    break;
                }
                default: {
                    //statements;
                    break;
                }
            }

            salesObject["pointInterval"] = element.interval * 3600 * 1000;
            if (element.graphType === "column") {
                valuePrefx["valuePrefix"] = element.tooltip.valuePrefix;
                salesObject["tooltip"] = valuePrefx;
                salesObject["color"] = element.color;
            }

            if (element.columnData != null) {
                element.columnData.map((res) => {
                    let date = res.x.split("-");

                    res.x = Date.UTC(date[0], date[1], date[2]);
                });

                salesObject["data"] = element.columnData;
            } else {
                element.splineData.map((res) => {
                    let date = res.x.split("-");
                    res.x = Date.UTC(date[0], date[1], date[2]);
                });

                salesObject["data"] = element.splineData;
            }
            if (element.splineStyle != null) {
                markerObj["lineWidth"] = 2;
                markerObj["lineColor"] = Highcharts.getOptions().colors[3];
                markerObj["fillColor"] = "white";
            }
            salesObject["marker"] = markerObj;
            this.seriesData.push(salesObject);

            legendArray.push(element.legendName);
        });
        this.initializeGraph();
    }

    initializeGraph() {
        if (
            this.router.url.includes("/dashboard") ||
            this.router.url.includes("/group-overview")
        ) {
            this.isGroupDashboard = true;
            this.chartOptions = {};
            this.chartOptions = {
                title: {
                    text: null,
                },
                boost: {
                    useGPUTranslations: true,
                },
                xAxis: {
                    tickInterval: 24 * 3600 * 1000,
                    type: "datetime",
                },
                yAxis: [
                    {
                        title: {
                            text: null,
                        },
                    },
                    {
                        title: {
                            text: null,
                        },
                        opposite: true,
                    },
                ],
                labels: {
                    items: [
                        {
                            html: "",
                        },
                    ],
                },
                legend: {
                    layout: "horizontal",
                    align: "right",
                    verticalAlign: "bottom",
                },
                plotOptions: {
                    series: {
                        pointWidth: 10,
                        pointStart: 1,
                    },
                },
                tooltip: {
                    formatter: function () {
                        let s = [];
                        this.points.map((el, i) => {
                            s.push(
                                el.point.series.name +
                                    ' : <span style="color:#D31B22;font-weight:bold;">' +
                                    el.point.y +
                                    "</span><br>"
                            );
                        });
                        return s;
                    },
                    shared: true,
                    valueDecimals: 2,
                },
                series: this.seriesData,
                responsive: {
                    rules: [
                        {
                            condition: {
                                maxWidth: 500,
                            },
                            chartOptions: {
                                legend: {
                                    floating: false,
                                    layout: "horizontal",
                                    align: "center",
                                    verticalAlign: "bottom",
                                    x: 0,
                                    y: 0,
                                },
                                yAxis: [
                                    {
                                        labels: {
                                            align: "right",
                                            x: 0,
                                            y: -6,
                                        },
                                        showLastLabel: false,
                                    },
                                    {
                                        labels: {
                                            align: "left",
                                            x: 0,
                                            y: -6,
                                        },
                                        showLastLabel: false,
                                    },
                                    {
                                        visible: false,
                                    },
                                ],
                            },
                        },
                    ],
                },
            };
            Highcharts.chart(this.container.nativeElement, this.chartOptions);
            this.chartLoader = false;
        }
    }

    fetchSalePersonsGraph(groupBy?, orderBy?) {
        this.salepersonArray = [];

        if (orderBy === "Covered") {
            this.salesPersonGrossLabel = "Covered Vehicles";
            this.salesPersonVehicleLabel = "Covered Gross";
        } else if (orderBy === "Delivered") {
            this.salesPersonGrossLabel = "Delivered Vehicles";
            this.salesPersonVehicleLabel = "Delivered Gross";
        } else {
            this.salesPersonGrossLabel = "Sold Vehicles";
            this.salesPersonVehicleLabel = "Sold Gross";
        }
        // console(orderBy);
        this.chartLoader = true;
        let param = {
            Deptid: this.decryptedDepartmentId
                ? this.decryptedDepartmentId
                : "-1", // if called on GROUP DASHBOARD then this would be -1
            PastMonths: 1, // it will always be 1
            TillDate: this.monthFilter, // take this value from calendar and sent to this API
            OrderBy: orderBy, // Possible values are Delivered, Covered, Sold
            // "Deptid": 1118, // it is always called in some department dashboard NOT IN GROUP DASHBOARD
            // "PastMonths": 1, // it will always be 1
            // "TillDate": "JUN_20", // take this value from calendar and sent to this API
            // "OrderBy": "Delivered" // Possible values are Delivered, Covered, Sold
            UserId: this.LocalStorageHandlerService.getFromStorage("userObj").userId
        };

        this.dashboardService.generateSalesPersonGraph(param).subscribe(
            (data) => {
                if (data && data.users !== null && data.users !== undefined) {
                    this.generateSalesPersonsGraph(data);
                } else {
                    this.chartLoader = false;
                }
            },
            (err) => {
                this.chartLoader = false;
            }
        );
    }

    objectKeys = Object.keys;
    jsonObj = {};

    generateSalesPersonsGraph(graphData) {
        let dataAry = [];
        let legendArray: any[] = [];
        let result = null;
        result = graphData;
        for (let i = 0; i < result.users.length; i++) {
            this.seriesData = [];
            let data = result.users[i];
            let gross = 0;
            let vehicles = 0;
            let grandTotalOrders = 0;
            let grandTotalProfit = 0;

            // console("data", data);

            data.seriesData.forEach((element) => {
                let salesObject: any = new Object();
                let markerObj = new Object();
                let valuePrefx: any = new Object();

                salesObject["type"] = element.graphType;
                salesObject["name"] = element.legendName;
                salesObject["yAxis"] = element.yAxis;
                salesObject["turboThreshold"] = 500000;

                switch (element.month) {
                    case "Jan": {
                        salesObject["pointStart"] = Date.UTC(2010, 0, 1);
                        break;
                    }
                    case "Feb": {
                        salesObject["pointStart"] = Date.UTC(2010, 1, 1);
                        break;
                    }
                    case "Mar": {
                        salesObject["pointStart"] = Date.UTC(2010, 2, 1);
                        break;
                    }
                    case "Apr": {
                        salesObject["pointStart"] = Date.UTC(2010, 3, 1);
                        break;
                    }
                    case "May": {
                        salesObject["pointStart"] = Date.UTC(2010, 4, 1);
                        break;
                    }
                    case "Jun": {
                        salesObject["pointStart"] = Date.UTC(2010, 5, 1);
                        break;
                    }
                    case "Jul": {
                        salesObject["pointStart"] = Date.UTC(2010, 6, 1);
                        break;
                    }

                    case "Aug": {
                        salesObject["pointStart"] = Date.UTC(2010, 7, 1);
                        break;
                    }
                    case "Sep": {
                        salesObject["pointStart"] = Date.UTC(2010, 8, 1);
                        break;
                    }
                    case "Oct": {
                        salesObject["pointStart"] = Date.UTC(2010, 9, 1);
                        break;
                    }
                    case "Nov": {
                        salesObject["pointStart"] = Date.UTC(2010, 10, 1);
                        break;
                    }
                    case "Dec": {
                        salesObject["pointStart"] = Date.UTC(2010, 11, 1);
                        break;
                    }
                    default: {
                        //statements;
                        break;
                    }
                }

                salesObject["pointInterval"] = element.interval * 3600 * 1000;
                if (element.graphType === "column") {
                    valuePrefx["valuePrefix"] = element.tooltip.valuePrefix;
                    salesObject["tooltip"] = valuePrefx;
                    salesObject["color"] = element.color;
                }

                if (element.columnData != null) {
                    element.columnData.map((res) => {
                        let date = res.x.split("-");
                        res.x = Date.UTC(date[0], date[1] - 1, date[2]);
                        // console(res.x);
                        grandTotalProfit += Number(res.y);
                    });
                    
                    salesObject["data"] = element.columnData;
                } else {
                    element.splineData.map((res) => {
                        let date = res.x.split("-");
                        res.x = Date.UTC(date[0], date[1] - 1 , date[2]);
                        // console(res.x);
                        grandTotalOrders += Number(res.y);
                    });

                    salesObject["data"] = element.splineData;
                }
                if (element.splineStyle != null) {
                    markerObj["lineWidth"] = 2;
                    markerObj["lineColor"] = Highcharts.getOptions().colors[3];
                    markerObj["fillColor"] = "white";
                }
                salesObject["marker"] = markerObj;
                this.seriesData.push(salesObject);

                if (legendArray.length != 4) {
                    legendArray.push(element.legendName);
                    // console("legendArray", legendArray);
                }
            });

            // console("legendArray -- out loop", legendArray);

            if (
                this.router.url.includes("/dashboard") ||
                this.router.url.includes("/group-overview")
            ) {
                this.isGroupDashboard = false;
                this.chartOptions = {};
                this.chartOptions = {
                    title: {
                        text: null,
                    },
                    boost: {
                        useGPUTranslations: true,
                        // Chart-level boost when there are more than 5 series in the chart
                    },

                    xAxis: {
                        tickInterval: 24 * 3600 * 1000,
                        type: "datetime",
                    },
                    yAxis: [
                        {
                            title: {
                                text: null,
                            },
                        },
                        {
                            title: {
                                text: null,
                            },
                            opposite: true,
                        },
                    ],
                    labels: {
                        items: [
                            {
                                html: "",
                            },
                        ],
                    },
                    legend: {
                        layout: "horizontal",
                        align: "right",
                        verticalAlign: "bottom",
                    },
                    plotOptions: {
                        series: {
                            pointWidth: 10,
                            pointStart: 1,
                        },
                    },
                    tooltip: {
                        formatter: function () {
                            let s = [];
                            this.points.map((el, i) => {
                                s.push(
                                    el.point.series.name +
                                        ' : <span style="color:#D31B22;font-weight:bold;">' +
                                        el.point.y +
                                        "</span><br>"
                                );
                            });
                            return s;
                        },
                        shared: true,
                        valueDecimals: 2,
                    },
                    series: this.seriesData,
                    responsive: {
                        rules: [
                            {
                                condition: {
                                    maxWidth: 500,
                                },
                                chartOptions: {
                                    legend: {
                                        floating: false,
                                        layout: "horizontal",
                                        align: "center",
                                        verticalAlign: "bottom",
                                        x: 0,
                                        y: 0,
                                    },
                                    yAxis: [
                                        {
                                            labels: {
                                                align: "right",
                                                x: 0,
                                                y: -6,
                                            },
                                            showLastLabel: false,
                                        },
                                        {
                                            labels: {
                                                align: "left",
                                                x: 0,
                                                y: -6,
                                            },
                                            showLastLabel: false,
                                        },
                                        {
                                            visible: false,
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                };
                Highcharts.chart(
                    this.container.nativeElement,
                    this.chartOptions
                );
                this.chartLoader = false;
            }

            data["chart"] = this.chartOptions;
            data["gross"] = 0;
            data["grandTotalOrders"] = grandTotalOrders;
            data["grandTotalProfit"] = grandTotalProfit;
        }
        // console("Results Object ::::");
        // console(result);

        this.salepersonArray = result;
    }

    constructPivotTableDD() {
        this.pivotLoader = true;

        let param = {
            Deptid: this.decryptedDepartmentId
                ? this.decryptedDepartmentId
                : "-1", // if called on GROUP DASHBOARD then this would be -1
            PastMonths: 1, // it will always be 1
            TillDate: this.monthFilter, // take this value from calendar and sent to this API
            GroupBy: this.filterValue.key, // Take values from first dropdown
            OrderBy: this.defaultOrder.value, // Possible values are Delivered, Covered, Sold
            UserId: this.LocalStorageHandlerService.getFromStorage("userObj").userId
        };

        this.dashboardService.generatePivotData(param).subscribe(
            (res) => {
                if (res && res.length > 0) {
                    this.pivotTab = [];
                    this.field = "";
                    this.groupByHeader = "";

                    this.pivotTab = res;
                    this.fetchGrandTotal();

                    this.groupByHeader = res[0].groupByHeaderName;
                    this.field = res[0].field;
                }
                this.pivotLoader = false;
            },
            (err) => {
                this.pivotLoader = false;
            }
        );
    }

    fetchGrandTotal() {
        this.activeRow = [];
        this.grandTotalOrders = 0;
        this.grandTotalProfit = 0;
        this.pivotTab.map((res) => {
            this.grandTotalOrders = this.grandTotalOrders + res.totalOrders;
            this.grandTotalProfit = this.grandTotalProfit + res.totalProfit;
            this.activeRow.push({
                rowId: res.rowId,
                active: false,
            });
        });
    }

    filterChange(event) {
        if (this.tab === 1) {
            if (this.dataValue.value === "By Sale Person") {
                this.groupBy = 2;
                this.fetchSalePersonsGraph(
                    this.dataValue.value,
                    this.orderValue.value
                );
            } else {
                this.groupBy = 1;
                this.fetchSaleGraph(
                    this.dataValue.value,
                    this.orderValue.value
                );
            }
        } else {
            this.groupByHeader = this.dataValue.value.split(" /")[0];
            this.field = this.dataValue.value.split(" /")[1];
            this.callPivotApi(
                this.groupByHeader,
                this.field,
                this.orderHeader,
                this.time
            );
        }
    }

    filterOrderChange(event) {
        this.dataValue = event.value;

        if (this.tab === 1) {
            this.fetchSaleGraph(this.dataValue.value, this.orderValue.value);
        } else {
            this.orderHeader = this.dataValue.split(" /")[0];
            this.callPivotApi(
                this.groupByHeader,
                this.field,
                this.orderHeader,
                this.time
            );
        }
    }

    filterTimeChange(event) {
        const value = event.value;
        this.dataValue = value;
        this.time = this.dataValue.split(" /")[0];

        this.callPivotApi(
            this.groupByHeader,
            this.field,
            this.orderHeader,
            this.time
        );
    }

    callPivotApi(groupBy, field, filterby, date) {
        this.chartLoader = true;
        this.constructPivotTableDD();
    }

    filterByChannge(event) {
        if (this.tab === 1) {
            if (this.dataValue.value === "By Sale Person") {
                this.groupBy = 2;
                this.fetchSalePersonsGraph(
                    this.dataValue.value,
                    this.orderValue.value
                );
            } else {
                this.groupBy = 1;
                this.fetchSaleGraph(
                    this.dataValue.value,
                    this.orderValue.value
                );
            }
        }
    }

    toggleAccordian(rowId) {
        this.activeRow.map((res) => {
            if (res.rowId === rowId) {
                if (res.active === true) {
                    res.active = false;
                } else {
                    res.active = true;
                }
            }
        });
    }

    ActiveTab(tab) {
        this.tab = tab;
        if (this.tab === 2) {
            this.filterValue = {
                key: "DEP/SP",
                value: "Department / Sales Person",
            };
            this.defaultOrder = { key: "Orders Delivered", value: "Delivered" };
            this.constructPivotTableDD();
        } else {
            this.dataValue = { key: "Group by: Total", value: "By Total" };
            this.orderValue = { key: "Order covered", value: "Covered" };
            this.fetchSaleGraph(this.dataValue.value, this.orderValue.value);
        }
    }

    applyCalenderFilter() {
        this.monthModal = false;
        // this.generateFilter(this.monthSelected);
    }
}
