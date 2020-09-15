import * as moment from 'moment';
import { SlideInOutAnimation } from 'app/shared/animation/animation';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {  ChangeDetectionStrategy, Inject, OnChanges } from '@angular/core';

@Component({
    selector: 'date-footer',
    templateUrl: './date.footer.component.html',
    styleUrls: ['./date.footer.component.scss']
  })
  
  
  export class DateFooterFilterComponent implements OnInit {

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
    apiDateFormat:any;
    
    @Input() 
    rowData = [];

    @Output()
    dateFilterObj = new  EventEmitter()
    
    searchDate:any= [];
    rowResponse = [];

    constructor(
      private toastHandlerService: ToastHandlerService,
      public dialog: MatDialog,
    
      private fb: FormBuilder
    ){}

    ngOnInit() {

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
          this.apiDateFormat= moment(res.month).format('MMM_YY');
        }
      })
    }


    selctedMonth(index){
      this.searchDate.map((res,i)=>{
        if(i===index){
          this.sliderItem= res.month;
          this.sliderIndex=index;
          this.apiDateFormat= moment(res.month).format('MMM_YY');
          console.log(moment(res.month).format('MMM_YY'),res.month )
        }
      });
      this.monthSliderSearch(this.sliderItem)
    }

    monthSliderSearch(searchingFormat){
      // console.log(searchingFormat);
      let searchResult=  [];
      
      this.monthFilter = searchingFormat+" - "+searchingFormat;
  
  
      searchResult = this.rowData.filter(resp=>{
        let filter = Object.keys(resp).filter(res=>{
          if(res==="orderDate"){
            let date =moment(resp[res]).format('MMM YY');
              if(date){
                return date===searchingFormat;
              }
            }
        });
        if(filter.length> 0){ 
          return resp;
        }
      });
      // this.rowData = [];
      this.rowData = searchResult;
      if(searchResult.length> 0){
        let text= (searchResult.length>1)? "Records":"Record";
        this.toastHandlerService.generateToast(searchResult.length+" "+text+' found','',2000);
      }
      /* Output All Date variables*/ 
      this.dateFilterObj.emit({
        monthActive: this.monthActive,
        monthSelected: this.monthSelected,      
        yearActive: this.yearActive,
        sliderItem: this.sliderItem,
        sliderIndex: this.sliderIndex,
        monthFilter : this.monthFilter,
        dateFormat: this.apiDateFormat,
        option: 1,
      })
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
  
  
        // console.log(this.yearCounter<this.years.length)
        // console.log(this.yearCounter,this.years.length)
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
       
    resetSearch(){
      this.monthFilter="";
      this.rowData = this.rowResponse;
  
    }

    ngOnChanges(changes:SimpleChanges) {
      for (const propName in changes) {
        if (changes.hasOwnProperty(propName)) {
          switch (propName) {
            case 'rowData': {
              console.log("change:",this.rowData)
            }
          }
        }
      }
    }
    
    applyCalenderFilter(type?){
      // console.log(this.monthSelected);
      this.monthModal= false;
      this.generateFilter(this.monthSelected, type);
    }
  
    
    generateFilter(length, type?){    

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
      console.log("change:",this.rowData)

      this.calenderSearch(searchingFormat, month, currentSearchFormat, type)
    }
    
    cancelMonthModal(){
      this.monthModal= false;
    }

    openCalenderPopup(){
      this.monthModal= !this.monthModal;
    }

    calenderSearch(searchingFormat, month, startingMonth, type?){

      console.log(searchingFormat, startingMonth, month);
      let searchResult=  [];
  
      searchResult = this.rowData.filter(resp=>{
        let filter = Object.keys(resp).filter(res=>{
          if(res==="OD"){
            let date =resp[res];
            if(month===1){
              if(date){
                // console.log(moment(resp[res]).isSame(searchingFormat, "months"));
                return moment(resp[res]).isSame(searchingFormat, "months") && moment(resp[res]).isSame(searchingFormat, "years");
              }
            }else{
              // console.log("after:",  moment(resp[res]).isAfter(searchingFormat),resp[res]);
              // console.log("before:", moment(resp[res]).isBefore(startingMonth),resp[res]);
  
              return moment(resp[res]).isAfter(searchingFormat) && moment(resp[res]).isBefore(startingMonth);
            }
            // console.log(date,searchingFormat,moment(resp[res]).isAfter(searchingFormat));
          }
        });
        if(filter.length> 0){ 
                  
          return resp;
        }
      });
      this.rowData = [];
      console.log(searchResult)
      this.rowData = searchResult;
      if(type && type !== 1){
      //   console.log("inside")
        let text= (searchResult.length>1)? "Records":"Record";
        this.toastHandlerService.generateToast(searchResult.length+" "+text+' found','',2000);
      }

      /* Output All Date variables*/ 
      this.dateFilterObj.emit({
        monthActive: this.monthActive,
        monthSelected: this.monthSelected,      
        yearActive: this.yearActive,
        sliderItem: this.sliderItem,
        sliderIndex: this.sliderIndex,
        monthFilter : this.monthFilter,
        dateFormat: this.apiDateFormat,
        option: 2
      })
    }
  }