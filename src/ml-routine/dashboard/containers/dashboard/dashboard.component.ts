import { Component, OnInit, ElementRef, ViewChild, ViewChildren } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Route } from '@angular/compiler/src/core';
import { EncryptionService } from 'app/shared/services/encryption.service';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import  *  as  data  from  '../salesGraph.json';
import  *  as  filteredData  from  './salesFilterByGraph.json';
import  *  as  pivotDD  from  '../pivotTable.json';

import * as _ from 'lodash';
/** Added */


import { CustomFilterMenuComponent } from './../../../shared/components/custom-filter-menu/custom-filter-menu.component';
import { CustomDropdownComponent } from './../../../shared/components/custom-dropdown/custom-dropdown.component';
import { filter } from 'rxjs/operators';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ClipboardModule } from '@ag-grid-enterprise/clipboard';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { ChangeDetectionStrategy, Inject, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HistoryComponent } from 'ml-routine/saleslog/components/history/history.component';
import { NewDealComponent } from 'ml-routine/saleslog/components/new-deal/new-deal.component';
import { ExcelExportComponent } from 'ml-routine/saleslog/components/excel-export/excel-export.component';
import { ColumnOptionComponent } from 'ml-routine/saleslog/components/column-option/column-option.component';

import { AllModules } from '@ag-grid-enterprise/all-modules';
import { CustomHeaderComponent } from 'ml-routine/shared/components/custom-header/custom-header.component';
import { SlideInOutAnimation } from 'app/shared/animation/animation';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';

//import  *  as  data  from  'app/RoutineSheetJSON.json';
import { AuthService } from 'ml-auth/shared/services/ml-auth/ml-auth.service';



@Component({
    selector: "ml-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
    @ViewChild("container", { static: false }) container;
    @ViewChild("saleperson", { static: false }) saleperson;

    @ViewChildren(DashboardComponent) collapses: DashboardComponent[];

    vehicleProfit = 180;
    vehicleOrders = 1800000;

    sliderIndex: number;
    searchDate:any= [];
    rowData:any;
    seriesData:any[]=[];
    seriesObj:any;
    private postProcessPopup;

  monthSearch:any;
  animationState = 'out';

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
 
  private toggleColumns: boolean = true;
  decryptedDepartmentId: string;
   
  groupByHeader : string;
  orderHeader : string ='Orders';
  time : string ='Today';
  field : string;
  tableHeaderData:any[]=[];
  tableData:any;
  staticTableHeader=pivotDD.pivotData.staticTableHeader;


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


    /** filterList = [
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
    ]; **/

    filterList:any[]=[];

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
    pivotTab: any =[];
    activeAccrdn :any=1;
   /**   pivotTab: any = [
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
    ]; **/

    isGroupDashboard = false;
  

    constructor(private router: Router, private route: ActivatedRoute, private encryptionService: EncryptionService ,  private toastHandlerService: ToastHandlerService) {
        console.log(data)  ;
        this.generateSalesGraph(data.seriesData);

     }

generateSalesGraph(graphData){
    console.log(graphData);
    let dataAry=[]; 
    let legendArray : any[]= [];
    graphData.forEach(element => {
        console.log(element);
        let salesObject:any=new Object();   let markerObj = new Object();
        let valuePrefx :any=new Object();
        salesObject["type"]=element.graphType;
        salesObject["name"]=element.legendName;
        salesObject["yAxis"]=element.yAxis;

        switch(element.month) { 
            case 'Jan': { 
                salesObject["pointStart"]=Date.UTC(2010, 0, 1);
            break; 
            } 
            case 'Feb': { 
                salesObject["pointStart"]=Date.UTC(2010, 1, 1);
            break; 
            } 
            case 'Mar': { 
                salesObject["pointStart"]=Date.UTC(2010, 2, 1);
            break; 
            } 
            case 'Apr': { 
                salesObject["pointStart"]=Date.UTC(2010, 3, 1);
            break; 
            } 
            case 'May': { 
                salesObject["pointStart"]=Date.UTC(2010, 4, 1);
            break; 
            } 
            case 'Jun': { 
                salesObject["pointStart"]=Date.UTC(2010, 5, 1);
            break; 
            } 
            case 'Jul': { 
                salesObject["pointStart"]=Date.UTC(2010, 6, 1);
            break; 
            }
        
            case 'Aug': { 
                salesObject["pointStart"]=Date.UTC(2010, 7, 1);
            break; 
            } 
            case 'Sep': { 
                salesObject["pointStart"]=Date.UTC(2010, 8, 1);
            break; 
            } 
            case 'Oct': { 
                salesObject["pointStart"]=Date.UTC(2010, 9, 1);
            break; 
            }  
            case 'Nov': { 
                salesObject["pointStart"]=Date.UTC(2010, 10, 1);
            break; 
            } 
            case 'Dec': { 
                salesObject["pointStart"]=Date.UTC(2010, 11, 1);
            break; 
            } 
            default: { 
            //statements; 
            break; 
            } 
        } 

        salesObject["pointInterval"]=element.interval * 3600 * 1000 ;
        if(element.graphType ==='column') {
            valuePrefx["valuePrefix"] = element.tooltip.valuePrefix;
            salesObject["tooltip"]=      valuePrefx;
            salesObject["color"] =  element.color;
        }

        if(element.columnData!=null) {
            salesObject["data"] = element.columnData;
        
        } else {
            salesObject["data"] = element.splineData;
        }
        if(element.splineStyle!=null){
            markerObj["lineWidth"] = element.splineStyle.lineWidth;
            markerObj["lineColor"] = element.splineStyle.lineColor;
            markerObj["fillColor"] = element.splineStyle.fillColor;
        }
        salesObject["marker"]  = markerObj;
        this.seriesData.push(salesObject);
        legendArray.push(element.legendName);
        console.log( this.seriesData);
    });
}



    ngOnInit() {

        var coll = document.getElementsByClassName("collapsible");
        var i;
        
        for (i = 0; i < coll.length; i++) {
          coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
              content.style.display = "none";
            } else {
              content.style.display = "block";
            }
          });
        }




        this.constructPivotTableDD();
        console.log(pivotDD.pivotData.dynamicHeader.groupByHeader);
     

        this.fetchGrandTotal();

        this.route.paramMap.subscribe(params => {
            if (params.get("id") != null) {
                this.decryptedDepartmentId = this.encryptionService.convertToEncOrDecFormat('decrypt', params.get("id"));
            }
        });
    }

    constructPivotTableDD(){

        /** filterList = [
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
        ]; **/
        
        pivotDD.pivotData.dynamicHeader.groupByHeader.forEach(element => {
            let map = new Object();
            map["key"]=element.groupByHeaderName+" /"+element.field;
            map["value"]=element.groupByHeaderName+" /"+element.field;
            
            this.filterList.push(map);
        });
        
        this.groupByHeader =  pivotDD.pivotData.dynamicHeader.groupByHeader[0].groupByHeaderName;
        this.field =  pivotDD.pivotData.dynamicHeader.groupByHeader[0].field;
        this.populateTableData();
        console.log( this.filterList);

    }

    populateTableData(){
       
 /**   pivotTab: any = [
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
    ]; **/



pivotDD.pivotData.dynamicHeader.groupByHeader.forEach(element => {

    element.tabledata.forEach(element1 => {
    let pivotObj = Object(); let rowData:any[]=[];
    pivotObj["departId"] = element1.headerId;
    pivotObj["departmentName"] = element1.groupByHeaderValue;
    pivotObj["totalOrders"] = element1.aggregatedOrder;
    pivotObj["totalProfit"] = element1.aggregatedFinance;
    pivotObj["row"] = element1.drillDownData;
   
    this.pivotTab.push(pivotObj);


    });


    }); 
    console.log(this.pivotTab);
}


    fetchGrandTotal() {
        this.activeRow = [];
        this.pivotTab.map(res => {
            this.grandTotalOrders = this.grandTotalOrders + res.aggregatedOrder;
            this.grandTotalProfit = this.grandTotalProfit + res.total;
            this.activeRow.push({
                departId: res.headerId,
                active: false
            });
        });
    }

    ngAfterViewInit() {

       
        console.log(this.seriesData);
        if (this.router.url.includes("/group-overview")) {
            this.isGroupDashboard = true;
            this.chartOptions = {
                title: {
                    text: null
                },
                xAxis: {
                   
                    tickInterval: 24 * 3600 * 1000,
                    // one day
                    type: 'datetime'
                    
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
                            console.log(el);
                            s.push(el.point.series.name + ' : <span style="color:#D31B22;font-weight:bold;">' +
                                el.point.y + '</span><br>');
                        });

                        return s;
                    },
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                   
                    shared: true,
                    valueDecimals: 2
                },
                series: this.seriesData,
                 /**  series: [
                    {
                        type: 'column',
                        name: 'Target Profit',
                        yAxis: 0,
                        tooltip: {
                            valuePrefix: ' $'
                        },
                        
                       // data: [{ y: 43934, color: 'rgb(0, 153, 0)' }, { y: 52503, color: 'rgb(0, 153, 0)' }, { y: 57177, color: 'rgb(0, 153, 0)' }, { y: 69658, color: 'rgb(0, 153, 0)' }, { y: 97031, color: 'rgb(0, 153, 0)' }, { y: 119931, color: 'rgb(0, 153, 0)' }, { y: 137133, color: 'rgb(0, 153, 0)' }, { y: 154175, color: 'rgb(0, 153, 0)' }]
                       data: [20, 200, 100, 10, 150, 50, 30, 40, 300,350],
                       pointStart: Date.UTC(2010, 0, 1),
                       color:'blue',
                       pointInterval: 24 * 3600 * 1000
                    },
                    {
                        type: 'column',
                        yAxis: 0,
                        tooltip: {
                            valuePrefix: ' $'
                        },
                       
                        name: 'Profit Covered',
                        //data: [{ y: 43934, color: 'rgb(166, 166, 166)' }, { y: 52503, color: 'rgb(166, 166, 166)' }, { y: 57177, color: 'rgb(166, 166, 166)' }, { y: 69658, color: 'rgb(166, 166, 166)' }, { y: 97031, color: 'rgb(166, 166, 166)' }, { y: 119931, color: 'rgb(166, 166, 166)' }, { y: 137133, color: 'rgb(166, 166, 166)' }, { y: 152175, color: 'rgb(166, 166, 166)' }]
                        data: [20, 200, 100, 10, 150, 50, 30, 40, 300,800],
                        color:'green',
                        pointStart: Date.UTC(2010, 0, 1),
                        pointInterval: 24 * 3600 * 1000
                    },
                    {
                        type: 'spline',
                        name: 'Target Orders',
                       
                        yAxis: 1,
                        data: [100, 150, 200, 250, 300, 350, 400, 450,500],
                        pointStart: Date.UTC(2010, 0, 1),
                        pointInterval: 24 * 3600 * 1000,
                        marker: {
                            lineWidth: 2,
                            lineColor: 'cyan',
                            fillColor: 'white'
                        }
                    },
                    {
                        type: 'spline',
                        name: 'Orders Covered',
                        yAxis: 1,
                      
                        data: [200, 220, 250, 280, 300, 320, 350, 380,420],
                        pointStart: Date.UTC(2010, 0, 1),
                        pointInterval: 24 * 3600 * 1000,
                        marker: {
                            lineWidth: 2,
                            lineColor: 'magneta',
                            fillColor: 'white'
                        }
                    }
                ] , **/
               




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

    filterChange(event) {
       
            const value = event.value;
            this.dataValue = value;
            console.log(this.dataValue);
            console.log("Group by "+this.dataValue);
            this.groupByHeader = this.dataValue.split(" /")[0];
            this.field = this.dataValue.split(" /")[1];
            this.callPivotApi( this.groupByHeader,   this.field ,this.orderHeader,this.time);



            
    }
    filterOrderChange(event) {
       
        const value = event.value;
        this.dataValue = value;
        console.log(this.dataValue);
        console.log("Group by "+this.dataValue);
        this.orderHeader = this.dataValue.split(" /")[0];
        //this.field = this.dataValue.split(" /")[1];
        this.callPivotApi( this.groupByHeader,   this.field, this.orderHeader,this.time);

        
}
filterTimeChange(event) {
       
    const value = event.value;
    this.dataValue = value;
    console.log(this.dataValue);
    console.log("Group by "+this.dataValue);
   this.time = this.dataValue.split(" /")[0];
  
    this.callPivotApi( this.groupByHeader,   this.field,this.orderHeader,this.time);

    
}

callPivotApi(groupBy,field ,filterby,date) {

console.log(groupBy+" "+ field+" "+filterby+" "+date)

}

    filterByChannge(event) {
        const value = event.value;
        console.log(this.dataValue);
        console.log("Group by "+this.dataValue+" Filter By "+ value);
        this.generateGraphByFilter(this.dataValue , value);
       /**   if (value === "By Total") {
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

        } **/
    }

    generateGraphByFilter(groupBy , filterBy) {
       this.generateSalesGraph(filteredData.seriesData);
       

       




    }



    toggleAccordian(departId) {
  
          this.activeRow.map(res => {
            if (res.headerId === departId) {
                if(res.active == true) {
                    res.active = false;

                }if(res.active == false) {
                    res.active = true;

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


    selctedMonth(index){
        this.searchDate.map((res,i)=>{
          if(i===index){
            this.sliderItem= res.month;
            this.sliderIndex=index;
          }
        });
        this.monthSliderSearch(this.sliderItem)
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
  
        if(searchResult.length> 0){
          let text= (searchResult.length>1)? "Records":"Record";
          //this.toastHandlerService.generateToast(searchResult.length+" "+text+' found','',2000);
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

  applyCalenderFilter(){
    console.log(this.monthSelected);
    this.monthModal= false;
    this.generateFilter(this.monthSelected);
  }

  openCalenderPopup(){
    this.monthModal= !this.monthModal;
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


  cancelMonthModal(){
    this.monthModal= false;
  }

    
}
