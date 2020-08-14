import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Route } from '@angular/compiler/src/core';
import { EncryptionService } from 'app/shared/services/encryption.service';
import * as Highcharts from 'highcharts';

@Component({
    selector: "ml-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
    @ViewChild("container", { static: false }) container;
    @ViewChild("saleperson", { static: false }) saleperson;

    vehicleProfit = 180;
    vehicleOrders = 1800000;

    options = [
        { key: "Group by: Total", value: "By Total" },
        { key: "Group by: By Sale Person", value: "By Sale Person" },
        { key: "Group by: By Department", value: "By Department" },
    ];

    orderOptions = [
        { key: "Order covered", value: "Order covered" },
        { key: "Order delivered", value: "Order delivered" },
        { key: "Order sold", value: "Order sold" },
    ];


    filterList = [
        { key: "Dept. /Sales Person", value: "Dept. /Sales Person" },
        { key: "Dept. / Delivery Month", value: "Dept. / Delivery Month" },
        { key: "Dept. /VEH. Type", value: "Dept. /VEH. Type" },
        { key: "Dept. /VEH. Model", value: "Dept. /VEH. Model" },
        { key: "Dept. /VEH. Color", value: "Dept. /VEH. Color" },
        { key: "Inquiry /Sales Person", value: "Inquiry /Sales Person" },
        { key: "Status /Sales Person", value: "Status /Sales Person" },
        { key: "Status /VEH. Type", value: "Status /VEH. Type" },
        { key: "Status Dept", value: "Status Dept" },
        { key: "Source of Vehicle/ Dept.", value: "Source of Vehicle/ Dept." },
        { key: "Source of Vehicle/ VeH. Type", value: "Source of Vehicle/ VeH. Type" },
        { key: "Source of Vehicle/ Sales Person", value: "Source of Vehicle/ Sales Person" },
    ];

    filterValue: any = "Dept. /Sales Person";

    orderList = [
        { key: "Orders Delivered", value: "Orders Delivered" },
        { key: "Orders Sold", value: "Orders Sold" },
        { key: "Orders Reportable", value: "Orders Reportable" },
        { key: "Orders Reported", value: "Orders Reported" },
    ];

    dateRange = [
        { key: "This Month", value: "This Month" },
        { key: "Today", value: "Today" },
        { key: "Yesterday", value: "Yesterday" },
        { key: "Date Range", value: "Date Range" },
    ];

    groupBy = 1;
    tab = 1;

    dataValue: any = "By Total";
    orderValue: any = "Order covered";
    filter = "";

    displayKey = "value";
    isDisable = false;

    styleGuide = {
        // caretClass: 'caret',
        selectBoxClass: 'dropdown-wrapper',
        selectMenuClass: 'dropdown',
        optionsClass: 'option'
    };

    chartOptions: any;
    chartsalepersonOptions: any;

    grandTotalOrders = 0;
    grandTotalProfit = 0;

    defaultDate: any = "This Month";
    defaultOrder: any = "Order Covered";

    isDataList = false;
    searchKeys = ['key', 'value'];
    activeRow: any = [];

    pivotTab: any = [
        {
            departId: 1,
            departmentName: "Lennock Hyundai - New Cars",
            totalOrders: 69,
            totalProfit: 13000,
            row: [
                {
                    salePerson: "Chris Commisso",
                    order: 2,
                    vehicleProfit: 4000
                },
                {
                    salePerson: "Emily Gill",
                    order: 12,
                    vehicleProfit: 83000
                },
                {
                    salePerson: "James Overend",
                    order: 33,
                    vehicleProfit: 6000,
                },
                {
                    salePerson: "Morgan McGuinness",
                    order: 22,
                    vehicleProfit: 1000,
                }

            ]
        },
        {
            departId: 2,
            departmentName: "Lennock Jaguar & Land Rover - New Cars",
            totalOrders: 77,
            totalProfit: 13000,
            row: [
                {
                    salePerson: "Chris Commisso",
                    order: 10,
                    vehicleProfit: 4000
                },
                {
                    salePerson: "Emily Gill",
                    order: 12,
                    vehicleProfit: 83000
                },
                {
                    salePerson: "James Overend",
                    order: 33,
                    vehicleProfit: 6000,
                },
                {
                    salePerson: "Morgan McGuinness",
                    order: 22,
                    vehicleProfit: 1000,
                }

            ]
        },
    ];

    isGroupDashboard = false;
    decryptedDepartmentId: string;

    constructor(private router: Router, private route: ActivatedRoute, private encryptionService: EncryptionService) { }

    ngOnInit() {
        this.fetchGrandTotal();

        this.route.paramMap.subscribe(params => {
            if (params.get("id") != null) {
                this.decryptedDepartmentId = this.encryptionService.convertToEncOrDecFormat('decrypt', params.get("id"));
            }
        });
    }

    fetchGrandTotal() {
        this.activeRow = [];
        this.pivotTab.map(res => {
            this.grandTotalOrders = this.grandTotalOrders + res.totalOrders;
            this.grandTotalProfit = this.grandTotalProfit + res.totalProfit;
            this.activeRow.push({
                departId: res.departId,
                active: false
            });
        });
    }

    ngAfterViewInit() {
        if (this.router.url.includes("/group-overview")) {
            this.isGroupDashboard = true;
            this.chartOptions = {
                title: {
                    text: null
                },
                xAxis: {
                    title: {
                        text: null
                    }
                },
                yAxis: [
                    {
                        title: {
                            text: null
                        },
                    },
                    {
                        title: {
                            text: null
                        },
                        opposite: true
                    }
                ],
                labels: {
                    items: [{
                        html: '',
                    }]
                },
                legend: {
                    layout: 'horizontal',
                    align: 'right',
                    verticalAlign: 'bottom',
                    // itemMarginTop: 10,
                    // itemMarginBottom: 10
                },
                plotOptions: {
                    series: {
                        pointWidth: 10,
                        pointStart: 1,

                    }
                },
                tooltip: {
                    formatter: function () {
                        let s = [];
                        // console.log(this.points);
                        this.points.map((el, i) => {
                            // console.log(el.point.series);
                            s.push(el.point.series.name + ' : <span style="color:#D31B22;font-weight:bold;">' +
                                el.point.y + '</span><br>');
                        });

                        return s;
                    },
                    shared: true,
                    valueDecimals: 2
                },
                series: [
                    {
                        type: 'column',
                        name: 'Target Profit',
                        yAxis: 0,
                        tooltip: {
                            valuePrefix: ' $'
                        },
                        data: [{ y: 43934, color: 'rgb(0, 153, 0)' }, { y: 52503, color: 'rgb(0, 153, 0)' }, { y: 57177, color: 'rgb(0, 153, 0)' }, { y: 69658, color: 'rgb(0, 153, 0)' }, { y: 97031, color: 'rgb(0, 153, 0)' }, { y: 119931, color: 'rgb(0, 153, 0)' }, { y: 137133, color: 'rgb(0, 153, 0)' }, { y: 154175, color: 'rgb(0, 153, 0)' }]
                    },
                    {
                        type: 'column',
                        yAxis: 0,
                        tooltip: {
                            valuePrefix: ' $'
                        },
                        name: 'Profit Covered',
                        data: [{ y: 43934, color: 'rgb(166, 166, 166)' }, { y: 52503, color: 'rgb(166, 166, 166)' }, { y: 57177, color: 'rgb(166, 166, 166)' }, { y: 69658, color: 'rgb(166, 166, 166)' }, { y: 97031, color: 'rgb(166, 166, 166)' }, { y: 119931, color: 'rgb(166, 166, 166)' }, { y: 137133, color: 'rgb(166, 166, 166)' }, { y: 152175, color: 'rgb(166, 166, 166)' }]
                    },
                    {
                        type: 'spline',
                        name: 'Target Orders',
                        yAxis: 1,
                        data: [100, 150, 200, 250, 300, 350, 400, 450],
                        marker: {
                            lineWidth: 2,
                            lineColor: Highcharts.getOptions().colors[3],
                            fillColor: 'white'
                        }
                    },
                    {
                        type: 'spline',
                        name: 'Orders Covered',
                        yAxis: 1,
                        data: [200, 220, 250, 280, 300, 320, 350, 380],
                        marker: {
                            lineWidth: 2,
                            lineColor: Highcharts.getOptions().colors[3],
                            fillColor: 'white'
                        }
                    }
                ],
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                floating: false,
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom',
                                x: 0,
                                y: 0
                            },
                            yAxis: [{
                                labels: {
                                    align: 'right',
                                    x: 0,
                                    y: -6
                                },
                                showLastLabel: false
                            }, {
                                labels: {
                                    align: 'left',
                                    x: 0,
                                    y: -6
                                },
                                showLastLabel: false
                            }, {
                                visible: false
                            }]
                        }
                    }]
                }
            };
            Highcharts.chart(this.container.nativeElement, this.chartOptions);

        }
    }

    filterChannge(event) {
        const value = event.value;
        if (value === "By Total") {
            this.groupBy = 1;

            this.chartOptions = {
                title: {
                    text: null
                },
                xAxis: {
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: null
                    }
                },
                labels: {
                    items: [{
                        html: '',
                    }]
                },
                legend: {
                    layout: 'horizontal',
                    align: 'right',
                    verticalAlign: 'bottom',
                    // itemMarginTop: 10,
                    // itemMarginBottom: 10
                },
                plotOptions: {
                    series: {
                        pointWidth: 10,
                        pointStart: 1,

                    }
                },
                tooltip: {
                    formatter: function () {
                        let s = [];
                        // console.log(this.points);
                        this.points.map((el, i) => {
                            // console.log(el.point.series);
                            s.push(el.point.series.name + ' : <span style="color:#D31B22;font-weight:bold;">' +
                                el.point.y + '</span><br>');
                        });

                        return s;
                    },
                    shared: true,
                    valueDecimals: 2
                },
                series: [
                    {
                        type: 'column',
                        name: 'Target Profit',
                        data: [{ y: 43934, color: 'rgb(0, 153, 0)' }, { y: 52503, color: 'rgb(0, 153, 0)' }, { y: 57177, color: 'rgb(0, 153, 0)' }, { y: 69658, color: 'rgb(0, 153, 0)' }, { y: 97031, color: 'rgb(0, 153, 0)' }, { y: 119931, color: 'rgb(0, 153, 0)' }, { y: 137133, color: 'rgb(0, 153, 0)' }, { y: 154175, color: 'rgb(0, 153, 0)' }]
                    },
                    {
                        type: 'column',
                        name: 'Profit Covered',
                        data: [{ y: 43934, color: 'rgb(166, 166, 166)' }, { y: 52503, color: 'rgb(166, 166, 166)' }, { y: 57177, color: 'rgb(166, 166, 166)' }, { y: 69658, color: 'rgb(166, 166, 166)' }, { y: 97031, color: 'rgb(166, 166, 166)' }, { y: 119931, color: 'rgb(166, 166, 166)' }, { y: 137133, color: 'rgb(166, 166, 166)' }, { y: 152175, color: 'rgb(166, 166, 166)' }]
                    },
                    {
                        type: 'spline',
                        name: 'Target Orders',
                        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
                        marker: {
                            lineWidth: 2,
                            lineColor: Highcharts.getOptions().colors[3],
                            fillColor: 'white'
                        }
                    },
                    {
                        type: 'spline',
                        name: 'Orders Covered',
                        data: [32834, 31503, 37100, 49500, 86000, 108900, 126100, 132175],
                        marker: {
                            lineWidth: 2,
                            lineColor: Highcharts.getOptions().colors[3],
                            fillColor: 'white'
                        }
                    }
                ]
            };
            if (this.container && this.container.nativeElement) {
                Highcharts.chart(this.container.nativeElement, this.chartOptions);
            }

        } else if (value === "By Sale Person") {
            this.groupBy = 2;
            this.filter = "Sale Person";
            this.chartsalepersonOptions = {
                chart: {
                    plotAreaWidth: 300,
                    plotAreaHeight: 100
                },
                title: {
                    text: null
                },
                xAxis: {
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: null
                    }
                },
                labels: {
                    items: [{
                        html: '',
                    }]
                },
                legend: {
                    layout: 'horizontal',
                    align: 'right',
                    verticalAlign: 'bottom',
                    // itemMarginTop: 10,
                    // itemMarginBottom: 10
                },
                plotOptions: {
                    series: {
                        pointWidth: 15,
                        pointStart: 1,

                    }
                },
                tooltip: {
                    formatter: function () {
                        let s = [];
                        // console.log(this.points);
                        this.points.map((el, i) => {
                            // console.log(el.point.series);
                            s.push(el.point.series.name + ' : <span style="color:#D31B22;font-weight:bold;">' +
                                el.point.y + '</span><br>');
                        });

                        return s;
                    },
                    shared: true,
                    valueDecimals: 2
                },
                series: [
                    {
                        type: 'column',
                        name: 'Target Profit',
                        data: [{ y: 43934, color: 'rgb(0, 153, 0)' }, { y: 52503, color: 'rgb(0, 153, 0)' }, { y: 57177, color: 'rgb(0, 153, 0)' }, { y: 69658, color: 'rgb(0, 153, 0)' }, { y: 97031, color: 'rgb(0, 153, 0)' }, { y: 119931, color: 'rgb(0, 153, 0)' }, { y: 137133, color: 'rgb(0, 153, 0)' }, { y: 154175, color: 'rgb(0, 153, 0)' }]
                    },
                    {
                        type: 'column',
                        name: 'Profit Covered',
                        data: [{ y: 43934, color: 'rgb(166, 166, 166)' }, { y: 52503, color: 'rgb(166, 166, 166)' }, { y: 57177, color: 'rgb(166, 166, 166)' }, { y: 69658, color: 'rgb(166, 166, 166)' }, { y: 97031, color: 'rgb(166, 166, 166)' }, { y: 119931, color: 'rgb(166, 166, 166)' }, { y: 137133, color: 'rgb(166, 166, 166)' }, { y: 152175, color: 'rgb(166, 166, 166)' }]
                    },
                    {
                        type: 'spline',
                        name: 'Target Orders',
                        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
                        marker: {
                            lineWidth: 2,
                            lineColor: Highcharts.getOptions().colors[3],
                            fillColor: 'white'
                        }
                    },
                    {
                        type: 'spline',
                        name: 'Orders Covered',
                        data: [32834, 31503, 37100, 49500, 86000, 108900, 126100, 132175],
                        marker: {
                            lineWidth: 2,
                            lineColor: Highcharts.getOptions().colors[3],
                            fillColor: 'white'
                        }
                    }
                ]
            };
            if (this.saleperson && this.saleperson.nativeElement) {
                Highcharts.chart(this.saleperson.nativeElement, this.chartsalepersonOptions);
            }

        } else if (value === "By Department") {
            this.groupBy = 2;
            this.filter = "Department";

        }
    }

    toggleAccordian(departId) {
        this.activeRow.map(res => {
            if (res.departId === departId) {
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
        console.log(this.tab);
    }
}
