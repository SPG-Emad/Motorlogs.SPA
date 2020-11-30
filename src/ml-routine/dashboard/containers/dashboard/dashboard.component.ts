import { SessionHandlerService } from './../../../../app/shared/services/session-handler.service';
import { Component, OnInit, ElementRef, ViewChild, ViewChildren } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EncryptionService } from 'app/shared/services/encryption.service';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import  *  as  data  from  '../salesGraph.json';
import  *  as  filteredData  from  './salesFilterByGraph.json';
import  *  as  pivotDD  from  '../pivotTable.json';

import * as _ from 'lodash';
import { DashboardService } from 'ml-routine/shared/services/dashboard/dashboard.service';
/** Added */;


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
    highcharts = Highcharts;

    sliderIndex: number;
    searchDate:any= [];
    rowData:any;
    seriesData:any[]=[];
    seriesObj:any;
    pivotData =  [];
    graphData = [];
    private postProcessPopup;

  monthSearch:any;
  animationState = 'out';

  currentDate:any="";
  years: any = [];
  months: any = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Nov','Dec'];
  monthActive: any;
  yearCounter= 0;
  monthModal: boolean = false;
  monthSelected: any;
  monthFilter:string;
  searchDateBar:string;

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
  chartLoader :boolean = false;
  staticTableHeader=pivotDD.pivotData.staticTableHeader;
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


    filterList:any[]=[
        {key: "DEP/SP", value: "Department / Sales Person"},
        {key: "DEP/VEHTP", value: "Department / VEH.Type"},
        {key: "SP", value: "Sales Person"},
        {key: "SP/VEHTP", value: "Sales Person / VEH.Type"},
        {key: "SP/DM", value: "Sales Person / Delivery Month"},
        {key: "VEHTP/VEHMOD", value: "VEH.Type / VEH.Model"},
        {key: "VEHTP/VEHCOL", value: "VEH.Type / VEH.Colour"},
        {key: "INQ/SP", value: "Inquiry / Sales Person"},
        {key: "ST/SP", value: "Status / Sales Person"},
        {key: "ST/VEHTP", value: "Status / VEH.Type"},
        {key: "ST/DEPT", value: "Status / Dept."},
        {key: "SOV/VEHTP", value: "Source of Vehicle / VEH.Type"},
        {key: "SOV/SP", value: "Source of Vehicle / Sales Person"},
    ];

    filterValue: any = {key: "DEP/SP", value: "Department / Sales Person"};

    orderList = [
        { key: "Orders Delivered", value: "Delivered" },
        { key: "Orders Sold", value: "Sold" },
        // { key: "Orders Reportable", value: "Reportable" },
        // { key: "Orders Reported", value: "Reported" },
    ];

    dateRange = [
        { key: "This Month", value: "This Month" },
        { key: "Today", value: "Today" },
        { key: "Yesterday", value: "Yesterday" },
        { key: "Date Range", value: "Date Range" },
    ];

    groupBy = 1;
    tab = 1;

    dataValue: any = { key: "Group by: Total", value: "By Total" };
    orderValue: any = { key: "Order covered", value: "Covered" };
    filter = "";
    salepersonArray =  [];
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
    defaultOrder: any = { key: "Orders Delivered", value: "Delivered" };
    departmentName: string = "";
    isDataList = false;
    searchKeys = ['key', 'value'];
    activeRow: any = [];
    // pivotTab: any =[];
    activeAccrdn :any=1;
    pivotTab: any = [
        // {
        //     rowId: 1,
        //     groupHeaderName: "Lennock Hyundai - New Cars",
        //     field: 'Sales',
        //     totalOrders: 69,
        //     totalProfit: 13000,
        //     row: [
        //         {
        //             fieldValue: "Chris Commisso",
        //             order: 2,
        //             vehicleProfit: 4000
        //         },
        //         {
        //             fieldValue: "Emily Gill",
        //             order: 12,
        //             vehicleProfit: 83000
        //         },
        //         {
        //             fieldValue: "James Overend",
        //             order: 33,
        //             vehicleProfit: 6000,
        //         },
        //         {
        //             fieldValue: "Morgan McGuinness",
        //             order: 22,
        //             vehicleProfit: 1000,
        //         }

        //     ]
        // },
        // {
        //     rowId: 2,
        //     groupHeaderName: "Lennock Jaguar & Land Rover - New Cars",
        //     field: 'Sales',
        //     totalOrders: 77,
        //     totalProfit: 13000,
        //     row: [
        //         {
        //             fieldValue: "Chris Commisso",
        //             order: 10,
        //             vehicleProfit: 4000
        //         },
        //         {
        //             fieldValue: "Emily Gill",
        //             order: 12,
        //             vehicleProfit: 83000
        //         },
        //         {
        //             fieldValue: "James Overend",
        //             order: 33,
        //             vehicleProfit: 6000,
        //         },
        //         {
        //             fieldValue: "Morgan McGuinness",
        //             order: 22,
        //             vehicleProfit: 1000,
        //         }

        //     ]
        // },
        // {
        //     rowId: 3,
        //     groupHeaderName: "Lennock Jaguar & Land Rover - New Cars",
        //     field: 'Sales',
        //     totalOrders: 17,
        //     totalProfit: 14000,
        //     row: [
        //         {
        //             fieldValue: "Chris Commisso",
        //             order: 5,
        //             vehicleProfit: 5000
        //         },
        //         {
        //             fieldValue: "Emily Gill",
        //             order: 33,
        //             vehicleProfit: 5000
        //         },
        //         {
        //             fieldValue: "James Overend",
        //             order: 13,
        //             vehicleProfit: 5000,
        //         },
        //         {
        //             fieldValue: "Morgan McGuinness",
        //             order: 21,
        //             vehicleProfit: 6000,
        //         }

        //     ]
        // },
    ];

    isGroupDashboard = false;
    targetObj : any = {
		"vechOrders": {
			"target": 0,
			"mtdTarget": 0,
            "mtdResult": 0,
            "mtdDifference": 0,
            "mdtPercentage": 0
		},
		"vechProfit": {
			"target": 0,
			"mtdTarget": 0,
            "mtdResult": 0,
            "mtdDifference": 0,
            "mdtPercentage": 0
		}
	};
    pivotLoader: boolean = false;

    constructor(
        private router: Router, 
        private route: ActivatedRoute, 
        private sessionHandlerService: SessionHandlerService, 
        private dashboardService: DashboardService, 
        private encryptionService: EncryptionService ,  
        private toastHandlerService: ToastHandlerService
    ) {

        this.route.paramMap.subscribe(params => {
            this.chartLoader =true;
            this.decryptedDepartmentId =  "";

            var coll = document.getElementsByClassName("collapsible");
            var i;
            let dateFormat = moment().add().format('MMM_YY').toUpperCase();
            this.monthFilter =dateFormat;
            this.currentDate = moment().format('MMM - DD');
    
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
    
            if (params.get("id") != null) {
                this.decryptedDepartmentId = this.encryptionService.convertToEncOrDecFormat('decrypt', params.get("id"));
                this.departmentName = this.sessionHandlerService.getSession('userObj').departmentAccess.find(res=>{
                    return Number(res.departmentId) === Number(this.decryptedDepartmentId)
                }).departmentName;
                
                this.constructPivotTableDD();     
                this.fetchSaleGraph(this.dataValue.value, this.orderValue.value);

            }else{
                this.constructPivotTableDD();     
                this.fetchSaleGraph(this.dataValue.value, this.orderValue.value);
            }
        });
    }


    fetchSaleGraph(groupBy, orderBy){
        this.chartLoader=  true;   
        let param = {
            "Deptid": (this.decryptedDepartmentId)? this.decryptedDepartmentId:"-1", // if called on GROUP DASHBOARD then this would be -1
            "PastMonths": 1, // it will always be 1
            "TillDate": this.monthFilter, // take this value from calendar and sent to this API
            "GroupBy": groupBy, // Take values from first dropdown
            "OrderBy": orderBy // Possible values are Delivered, Covered, Sold         
        }

        this.dashboardService.generateSalesGraph(param)
        .subscribe(data=>{
            if(data && data.seriesData !== null && data.seriesData !== undefined){
                console.log(data.seriesData);
                this.generateSalesGraph(data);
            }else{
                this.chartLoader=  false;                
            }
        },(err)=>{
            this.chartLoader=  false;                
        });
    }

    ngOnInit() {
    }
    
    dateSetting(event){    
        this.monthActive = event.monthActive;
        this.yearActive = event.yearActive;
        this.monthSelected = event.monthSelected;
        this.sliderIndex = event.monthSelected;
        this.sliderItem = event.sliderItem;
        this.searchDateBar = event.monthFilter;
        
        if(this.tab===1){
            this.graphData = this.seriesData;
            if(event.option === 1){
                this.monthFilter = event.dateFormat;
            }else{
                this.monthFilter = event.calender;
            }
            this.fetchSaleGraph(this.dataValue.value, this.orderValue.value);
        }else {
            this.pivotData = this.pivotTab;
            if(event.option === 1){
                this.monthFilter = event.dateFormat;
            }else{
                this.monthFilter = event.calender;
            }
            this.constructPivotTableDD();     
        }
    }

    calculateTableData(graphData, filterOptions?){
        let salesObject:any = new Object();   
        salesObject = graphData['target'];

        if(salesObject &&  this.targetObj['vechOrders'] &&  this.targetObj['vechProfit']){
            /*Vechicle Orders*/ 
            this.targetObj['vechOrders']['mtdTarget'] = salesObject["vehOrders"]["mtdTarget"];
            this.targetObj['vechOrders']['mtdResult'] = salesObject["vehOrders"]["mtdResult"];
            this.targetObj['vechOrders']['mtdPercentage'] = (salesObject["vehOrders"]["mtdTarget"] && salesObject["vehOrders"]["mtdResult"])? (salesObject["vehOrders"]["mtdResult"]  / salesObject["vehOrders"]["mtdTarget"])*100 : 0;
            this.targetObj['vechOrders']['mtdDifference'] = (salesObject["vehOrders"]["mtdTarget"] && salesObject["vehOrders"]["mtdResult"])? (salesObject["vehOrders"]["mtdResult"]  - salesObject["vehOrders"]["mtdTarget"]) : 0;
            
            /*Vechicle Profit*/ 
            this.targetObj['vechProfit']['mtdTarget'] = salesObject["vehProfit"]["mtdTarget"];
            this.targetObj['vechProfit']['mtdResult'] = salesObject["vehProfit"]["mtdResult"];
            this.targetObj['vechProfit']['mtdPercentage'] = (salesObject["vehProfit"]["mtdTarget"] && salesObject["vehProfit"]["mtdResult"])? (salesObject["vehProfit"]["mtdResult"]  / salesObject["vehProfit"]["mtdTarget"])*100 : 0;
            this.targetObj['vechProfit']['mtdDifference'] = (salesObject["vehProfit"]["mtdTarget"] && salesObject["vehProfit"]["mtdResult"])? (salesObject["vehProfit"]["mtdResult"]  - salesObject["vehProfit"]["mtdTarget"]) : 0;
        }
    }
    

    resetSearch(){
        this.searchDateBar="";

        let dateFormat = moment().add().format('MMM_YY').toUpperCase();
        this.monthFilter =dateFormat;
        this.currentDate = moment().format('MMM - DD');

        if(this.tab===1){
            this.fetchSaleGraph(this.dataValue.value, this.orderValue.value);
        }else {
            this.constructPivotTableDD();     
        }

    }

    generateSalesGraph(graphData){
        
        let dataAry=[]; 
        let legendArray : any[]= [];
        this.seriesData = [];
        
        this.calculateTableData(graphData);        

        graphData.seriesData.forEach(element => {
            let salesObject:any = new Object();   
            let markerObj = new Object();
            let valuePrefx :any = new Object();

            salesObject["type"] = element.graphType;
            salesObject["name"] = element.legendName;
            salesObject["yAxis"] = element.yAxis;

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

            salesObject["pointInterval"] = element.interval * 3600 * 1000 ;
            if(element.graphType ==='column') {
                valuePrefx["valuePrefix"] = element.tooltip.valuePrefix;
                salesObject["tooltip"] = valuePrefx;
                salesObject["color"] =  element.color;
            }

            if(element.columnData!=null) {
                element.columnData.map(res=>{
                    let date = res.x.split('-')

                    res.x = Date.UTC(date[0], date[1], date[2]);
                });
                
                salesObject["data"] = element.columnData;
            
            } else {
                element.splineData.map(res=>{
                    let date = res.x.split('-')
                    res.x = Date.UTC(date[0], date[1], date[2]);
                });
                
                salesObject["data"] = element.splineData;
            }
            if(element.splineStyle!=null){
                markerObj["lineWidth"] = 2;
                markerObj["lineColor"] = Highcharts.getOptions().colors[3];
                markerObj["fillColor"] = "white";
            }
            salesObject["marker"]  = markerObj;
            this.seriesData.push(salesObject);

            legendArray.push(element.legendName);
        });

        this.initializeGraph();
    }

    initializeGraph(){
        
        if (this.router.url.includes("/dashboard") || this.router.url.includes("/group-overview")) {
            this.isGroupDashboard = true;
            this.chartOptions = {};
            this.chartOptions = {
                title: {
                    text: null
                },
                xAxis: {
                    tickInterval: 24 * 3600 * 1000,
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
                        this.points.map((el, i) => {
                            s.push(el.point.series.name + ' : <span style="color:#D31B22;font-weight:bold;">' +
                                el.point.y + '</span><br>');
                        });
                        return s;
                    },
                    shared: true,
                    valueDecimals: 2
                },
                series: this.seriesData,
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
            this.chartLoader=  false;                
        }
    }


    fetchSalePersonsGraph(groupBy?, orderBy?){

        if(orderBy === "Covered"){
            this.salesPersonGrossLabel = "Covered Vehicles";
            this.salesPersonVehicleLabel = "Covered Gross";

        }else if(orderBy === "Delivered"){
            this.salesPersonGrossLabel = "Delivered Vehicles";
            this.salesPersonVehicleLabel = "Delivered Gross";

        }else{
            this.salesPersonGrossLabel = "Sold Vehicles";
            this.salesPersonVehicleLabel = "Sold Gross";
        }

        this.chartLoader=  true;   
        let param = {
            // "Deptid": (this.decryptedDepartmentId)? this.decryptedDepartmentId:"-1", // if called on GROUP DASHBOARD then this would be -1
            // "PastMonths": 1, // it will always be 1
            // "TillDate": this.monthFilter, // take this value from calendar and sent to this API
            // "OrderBy": orderBy // Possible values are Delivered, Covered, Sold         
            "Deptid": 1118, // it is always called in some department dashboard NOT IN GROUP DASHBOARD
            "PastMonths": 1, // it will always be 1
            "TillDate": "JUN_20", // take this value from calendar and sent to this API
            "OrderBy": "Delivered" // Possible values are Delivered, Covered, Sold
        }

        this.dashboardService.generateSalesPersonGraph(param)
        .subscribe(data=>{
            if(data && data.users !== null && data.users !== undefined){                
                this.generateSalesPersonsGraph(data);
            }else{
                this.chartLoader=  false;                
            }
        },(err)=>{
            this.chartLoader=  false;                
        });
    }


    generateSalesPersonsGraph(graphData){
        let dataAry=[]; 
        let legendArray : any[]= [];
        this.seriesData = [];
        let result = graphData;
        for(let i =0;i<result.users.length;i++){
            let data = result.users[i];
            let gross = 0;
            let vehicles = 0;
            data.seriesData.forEach(element => {
                let salesObject:any = new Object();   
                let markerObj = new Object();
                let valuePrefx :any = new Object();
    
                salesObject["type"] = element.graphType;
                salesObject["name"] = element.legendName;
                salesObject["yAxis"] = element.yAxis;
                
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
    
                salesObject["pointInterval"] = element.interval * 3600 * 1000 ;
                if(element.graphType ==='column') {
                    valuePrefx["valuePrefix"] = element.tooltip.valuePrefix;
                    salesObject["tooltip"] = valuePrefx;
                    salesObject["color"] =  element.color;
                }
    
                if(element.columnData!=null) {
                    element.columnData.map(res=>{
                        let date = res.x.split('-')
    
                        res.x = Date.UTC(date[0], date[1], date[2]);
                    });
                    
                    salesObject["data"] = element.columnData;
                
                } else {
                    element.splineData.map(res=>{
                        let date = res.x.split('-')
                        res.x = Date.UTC(date[0], date[1], date[2]);
                    });
                    
                    salesObject["data"] = element.splineData;
                }
                if(element.splineStyle!=null){
                    markerObj["lineWidth"] = 2;
                    markerObj["lineColor"] = Highcharts.getOptions().colors[3];
                    markerObj["fillColor"] = "white";
                }
                salesObject["marker"]  = markerObj;
                this.seriesData.push(salesObject);
    
                legendArray.push(element.legendName);
            });


            if (this.router.url.includes("/dashboard") || this.router.url.includes("/group-overview")) {
                this.isGroupDashboard = true;
                this.chartOptions = {};
                this.chartOptions = {
                    title: {
                        text: null
                    },
                    xAxis: {
                        tickInterval: 24 * 3600 * 1000,
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
                            this.points.map((el, i) => {
                                s.push(el.point.series.name + ' : <span style="color:#D31B22;font-weight:bold;">' +
                                    el.point.y + '</span><br>');
                            });
                            return s;
                        },
                        shared: true,
                        valueDecimals: 2
                    },
                    series: this.seriesData,
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
                this.chartLoader=  false;                
            }
    
            data['chart'] = this.chartOptions;
            data['gross'] = 0;
            data['vehicles'] = 0;
            
        }
        this.salepersonArray = result;
        console.log(this.salepersonArray)
    }

    constructPivotTableDD(){
        this.pivotLoader = true;

        let param = {
            "Deptid": (this.decryptedDepartmentId)? this.decryptedDepartmentId:"-1", // if called on GROUP DASHBOARD then this would be -1
            "PastMonths": 1, // it will always be 1
            "TillDate": this.monthFilter, // take this value from calendar and sent to this API
            "GroupBy": this.filterValue.key, // Take values from first dropdown
            "OrderBy": this.defaultOrder.value // Possible values are Delivered, Covered, Sold        
        }

        this.dashboardService.generatePivotData(param)
        .subscribe(res=>{
            if(res && res.length> 0){
                this.pivotTab= [];
                this.field = "";
                this.groupByHeader= "";
    
                this.pivotTab = res;
                this.fetchGrandTotal();

                this.groupByHeader =  res[0].groupByHeaderName;
                this.field =  res[0].field;
            }
            this.pivotLoader = false;

        }, err=>{
            this.pivotLoader = false;
        });


    }

    fetchGrandTotal() {
        this.activeRow = [];
        this.grandTotalOrders = 0;
        this.grandTotalProfit = 0;
        this.pivotTab.map(res => {
            this.grandTotalOrders = this.grandTotalOrders + res.totalOrders;
            this.grandTotalProfit = this.grandTotalProfit + res.totalProfit;
            this.activeRow.push({
                rowId: res.rowId,
                active: false
            });
        });
    }

    filterChange(event) {  

        if(this.tab === 1){
            if(this.dataValue.value ==="By Sale Person"){
                this.groupBy =2;
                this.fetchSalePersonsGraph();
            }else{
                this.groupBy =1;
                this.fetchSaleGraph(this.dataValue.value, this.orderValue.value);
            }
        }else{
            this.groupByHeader = this.dataValue.split(" /")[0];
            this.field = this.dataValue.split(" /")[1];
            this.callPivotApi( this.groupByHeader,   this.field ,this.orderHeader,this.time);  
        }
    }

    filterOrderChange(event) {
        this.dataValue = event.value;

        if(this.tab === 1){
            this.fetchSaleGraph(this.dataValue.value, this.orderValue.value);
        }else{
            this.orderHeader = this.dataValue.split(" /")[0];
            this.callPivotApi( this.groupByHeader,   this.field, this.orderHeader,this.time);
        }  
    }

    filterTimeChange(event) {
        const value = event.value;
        this.dataValue = value;
        this.time = this.dataValue.split(" /")[0];
    
        this.callPivotApi( this.groupByHeader,   this.field,this.orderHeader,this.time);
    }

    callPivotApi(groupBy,field ,filterby,date) {
        this.chartLoader=  true;   
        this.constructPivotTableDD();
    }

    filterByChannge(event) {
        this.fetchSaleGraph(this.dataValue.value, this.orderValue.value);
    }

    toggleAccordian(rowId) {
        this.activeRow.map(res => {
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
        if(this.tab === 2){
            this.filterValue = {key: "DEP/SP", value: "Department / Sales Person"};
            this.defaultOrder = { key: "Orders Delivered", value: "Delivered" };
            this.constructPivotTableDD();
        }else{
            this.dataValue = { key: "Group by: Total", value: "By Total" };
            this.orderValue = { key: "Order covered", value: "Covered" };
            this.fetchSaleGraph(this.dataValue.value, this.orderValue.value);
        }
        
    }

    applyCalenderFilter(){
        this.monthModal= false;
        // this.generateFilter(this.monthSelected);
    }

}
