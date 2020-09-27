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

    sliderIndex: number;
    searchDate:any= [];
    rowData:any;
    seriesData:any[]=[];
    seriesObj:any;
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


    filterList:any[]=[];

    filterValue: any = {key: "Dept. /Sales Person", value: "Dept. /Sales Person"};

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
    departmentName: string = "";
    isDataList = false;
    searchKeys = ['key', 'value'];
    activeRow: any = [];
    // pivotTab: any =[];
    activeAccrdn :any=1;
    pivotTab: any = [
        {
            rowId: 1,
            groupHeaderName: "Lennock Hyundai - New Cars",
            field: 'Sales',
            totalOrders: 69,
            totalProfit: 13000,
            row: [
                {
                    fieldValue: "Chris Commisso",
                    order: 2,
                    vehicleProfit: 4000
                },
                {
                    fieldValue: "Emily Gill",
                    order: 12,
                    vehicleProfit: 83000
                },
                {
                    fieldValue: "James Overend",
                    order: 33,
                    vehicleProfit: 6000,
                },
                {
                    fieldValue: "Morgan McGuinness",
                    order: 22,
                    vehicleProfit: 1000,
                }

            ]
        },
        {
            rowId: 2,
            groupHeaderName: "Lennock Jaguar & Land Rover - New Cars",
            field: 'Sales',
            totalOrders: 77,
            totalProfit: 13000,
            row: [
                {
                    fieldValue: "Chris Commisso",
                    order: 10,
                    vehicleProfit: 4000
                },
                {
                    fieldValue: "Emily Gill",
                    order: 12,
                    vehicleProfit: 83000
                },
                {
                    fieldValue: "James Overend",
                    order: 33,
                    vehicleProfit: 6000,
                },
                {
                    fieldValue: "Morgan McGuinness",
                    order: 22,
                    vehicleProfit: 1000,
                }

            ]
        },
        {
            rowId: 3,
            groupHeaderName: "Lennock Jaguar & Land Rover - New Cars",
            field: 'Sales',
            totalOrders: 17,
            totalProfit: 14000,
            row: [
                {
                    fieldValue: "Chris Commisso",
                    order: 5,
                    vehicleProfit: 5000
                },
                {
                    fieldValue: "Emily Gill",
                    order: 33,
                    vehicleProfit: 5000
                },
                {
                    fieldValue: "James Overend",
                    order: 13,
                    vehicleProfit: 5000,
                },
                {
                    fieldValue: "Morgan McGuinness",
                    order: 21,
                    vehicleProfit: 6000,
                }

            ]
        },
    ];

    isGroupDashboard = false;
    targetObj : any = {
		"vechOrders": {
			"target": null,
			"mtdTarget": null,
            "mtdResult": null,
            "mtdDifference": null,
            "mdtPercentage": null
		},
		"vechProfit": {
			"target": null,
			"mtdTarget": null,
            "mtdResult": null,
            "mtdDifference": null,
            "mdtPercentage": null
		}
	};
    pivotLoader: boolean = false;

    constructor(
        private sessionHandlerService: SessionHandlerService, 
        private router: Router, 
        private route: ActivatedRoute, 
        private encryptionService: EncryptionService ,  
        private toastHandlerService: ToastHandlerService
    ) {

        this.route.paramMap.subscribe(params => {
            this.chartLoader =true;
            if (params.get("id") != null) {
                this.decryptedDepartmentId = this.encryptionService.convertToEncOrDecFormat('decrypt', params.get("id"));
                this.departmentName = this.sessionHandlerService.getSession('userObj').departmentAccess.find(res=>{
                    return Number(res.departmentId) === Number(this.decryptedDepartmentId)
                }).departmentName;

                this.seriesData.length = 0;
                this.generateSalesGraph(data);

            }else{
                this.seriesData.length = 0;
                this.generateSalesGraph(data);

            }
        });
    }

    ngOnInit() {
        var coll = document.getElementsByClassName("collapsible");
        var i;
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

        this.constructPivotTableDD();     

        this.fetchGrandTotal();
    }

    calculateTableData(graphData, filterOptions?){
        let salesObject:any = new Object();   
        salesObject = graphData['default']['target'];

        /*Vechicle Orders*/ 
        this.targetObj['vechOrders']['mtdTarget'] = salesObject["vechOrders"]["mtdTarget"];
        this.targetObj['vechOrders']['mtdResult'] = salesObject["vechOrders"]["mtdResult"];
        this.targetObj['vechOrders']['mtdPercentage'] = (salesObject["vechOrders"]["mtdTarget"] && salesObject["vechOrders"]["mtdResult"])? (salesObject["vechOrders"]["mtdResult"]  / salesObject["vechOrders"]["mtdTarget"])*100 : 0;
        this.targetObj['vechOrders']['mtdDifference'] = (salesObject["vechOrders"]["mtdTarget"] && salesObject["vechOrders"]["mtdResult"])? (salesObject["vechOrders"]["mtdResult"]  - salesObject["vechOrders"]["mtdTarget"]) : 0;
        
        /*Vechicle Profit*/ 
        this.targetObj['vechProfit']['mtdTarget'] = salesObject["vechProfit"]["mtdTarget"];
        this.targetObj['vechProfit']['mtdResult'] = salesObject["vechProfit"]["mtdResult"];
        this.targetObj['vechProfit']['mtdPercentage'] = (salesObject["vechProfit"]["mtdTarget"] && salesObject["vechProfit"]["mtdResult"])? (salesObject["vechProfit"]["mtdResult"]  / salesObject["vechProfit"]["mtdTarget"])*100 : 0;
        this.targetObj['vechProfit']['mtdDifference'] = (salesObject["vechProfit"]["mtdTarget"] && salesObject["vechProfit"]["mtdResult"])? (salesObject["vechProfit"]["mtdResult"]  - salesObject["vechProfit"]["mtdTarget"]) : 0;
    }
    
    generateSalesGraph(graphData){
        
        let dataAry=[]; 
        let legendArray : any[]= [];

        this.calculateTableData(graphData);        

        graphData['default'].seriesData.forEach(element => {
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

        this.initializeGraph();
    }

    initializeGraph(){
        
        if (this.router.url.includes("/dashboard") || this.router.url.includes("/group-overview")) {
            console.log('after init')
            setTimeout(() => {
                this.isGroupDashboard = true;
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
                            console.log(this.points);
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
            }, 2000);
        }
    }

    constructPivotTableDD(){
        this.pivotLoader = true;

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
        this.pivotLoader = false;

    }

    fetchGrandTotal() {
        this.activeRow = [];
        this.pivotTab.map(res => {
            this.grandTotalOrders = this.grandTotalOrders + res.totalOrders;
            this.grandTotalProfit = this.grandTotalProfit + res.totalProfit;
            this.activeRow.push({
                rowId: res.rowId,
                active: false
            });
        });
    }

    ngAfterViewInit() {

        // if (this.router.url.includes("/dashboard") || this.router.url.includes("/group-overview")) {
        //     console.log('after init')
        //     setTimeout(() => {
        //         this.isGroupDashboard = true;
        //         this.chartOptions = {
        //             title: {
        //                 text: null
        //             },
        //             xAxis: {
        //                 tickInterval: 24 * 3600 * 1000,
        //                 type: 'datetime'  
        //             },
        //             yAxis: [
        //                 {
        //                     title: {
        //                         text: null
        //                     },
        //                 },
        //                 {
        //                     title: {
        //                         text: null
        //                     },
        //                     opposite: true
        //                 }
        //             ],
        //             labels: {
        //                 items: [{
        //                     html: '',
        //                 }]
        //             },
        //             legend: {
        //                 layout: 'horizontal',
        //                 align: 'right',
        //                 verticalAlign: 'bottom',
        //             },
        //             plotOptions: {
        //                 series: {
        //                     pointWidth: 10,
        //                     pointStart: 1,
        //                 }
        //             },
        //             tooltip: {
        //                 formatter: function () {
        //                     let s = [];
        //                     // console.log(this.points);
        //                     this.points.map((el, i) => {
        //                         // console.log(el);
        //                         s.push(el.point.series.name + ' : <span style="color:#D31B22;font-weight:bold;">' +
        //                             el.point.y + '</span><br>');
        //                     });
        //                 },
        //                 shared: true,
        //                 valueDecimals: 2
        //             },
        //             series: this.seriesData,
        //             responsive: {
        //                 rules: [{
        //                     condition: {
        //                         maxWidth: 500
        //                     },
        //                     chartOptions: {
        //                         legend: {
        //                             floating: false,
        //                             layout: 'horizontal',
        //                             align: 'center',
        //                             verticalAlign: 'bottom',
        //                             x: 0,
        //                             y: 0
        //                         },
        //                         yAxis: [{
        //                             labels: {
        //                                 align: 'right',
        //                                 x: 0,
        //                                 y: -6
        //                             },
        //                             showLastLabel: false
        //                         }, {
        //                             labels: {
        //                                 align: 'left',
        //                                 x: 0,
        //                                 y: -6
        //                             },
        //                             showLastLabel: false
        //                         }, {
        //                             visible: false
        //                         }]
        //                     }
        //                 }]
        //             }
        //         };
        //         Highcharts.chart(this.container.nativeElement, this.chartOptions);
        //         this.chartLoader=  false;                
        //     }, 2000);
        // }
    }

    filterChange(event) {  
        const value = event.value;
        this.dataValue = value;
        console.log(this.filterValue);
        console.log("Group by "+this.dataValue);
        this.groupByHeader = this.dataValue.split(" /")[0];
        this.field = this.dataValue.split(" /")[1];
        this.callPivotApi( this.groupByHeader,   this.field ,this.orderHeader,this.time);  
        this.fetchPivotAPI();  
    }

    filterOrderChange(event) {
        const value = event.value;
        this.dataValue = value;
        console.log(this.dataValue);
        console.log("Group by "+this.dataValue);
        this.orderHeader = this.dataValue.split(" /")[0];
        //this.field = this.dataValue.split(" /")[1];
        this.callPivotApi( this.groupByHeader,   this.field, this.orderHeader,this.time);
        this.fetchPivotAPI();
        
    }

    filterTimeChange(event) {
        const value = event.value;
        this.dataValue = value;
        this.time = this.dataValue.split(" /")[0];
    
        this.callPivotApi( this.groupByHeader,   this.field,this.orderHeader,this.time);
        this.fetchPivotAPI();
    }

    fetchPivotAPI(){
        
    }

    callPivotApi(groupBy,field ,filterby,date) {
        console.log(groupBy+" "+ field+" "+filterby+" "+date)
    }

    filterByChannge(event) {
        const value = event.value;

        this.generateGraphByFilter(this.dataValue , value);
    }

    generateGraphByFilter(groupBy , filterBy) {
       this.generateSalesGraph(filteredData);
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
        console.log(this.tab);
    }

    applyCalenderFilter(){
        console.log(this.monthSelected);
        this.monthModal= false;
        // this.generateFilter(this.monthSelected);
    }

}
