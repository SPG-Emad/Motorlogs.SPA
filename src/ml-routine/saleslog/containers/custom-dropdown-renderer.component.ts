import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'custom-dropdown-renderer',
  template:
    `<app-single-selection-example [header]="header" [selected]="selected" [itemArray]="itemsArray" [rowDate]="rowDate" [flag]="customFlag" ></app-single-selection-example>
  ` ,
})
export class CustomDropDownRenderer  {
  private params1: any;
  options:['Cancelled','Pending','TBA','Delete'];
  dateFlag : boolean = false;
  customFlag: boolean = true;
  rowDate:string;
  itemsArray : [];
  selected : string;
  header : string;
 

  

  agInit(params): void {
    // console.log( params);
    this.header = params.colDef.headerName;
    // console.log( "Column Header Value " +params.value);
    this.rowDate = params.value;
    if(params.colDef.colCode === 'RETORWHO'){
      console.log("RETORWHO");
    }
    // console.log("Option Items array ");
    // console.log(params.data["cellOptions_"+params.colDef.colCode]);
    this.itemsArray = params.data["cellOptions_"+params.colDef.colCode];
    this.selected = params.value;
    // console.log("Option Items Style "+ this.itemsArray);
    /** if(params.value!=null) {
    console.log(params.data["cellOptions_"+params.colDef.field].length > 0 ?params.data["cellOptions_"+params.colDef.field][0].details :"no cell option data");
    }else {
      console.log("No Data");
    } **/
  //  console.log( params);
    var key = Object.keys(params.data)[8];
    
  //this.rowDate = params.data[key];
  // console.log(this.rowDate );
     // console.log(params.data[key] + " "+ key);
     
    //this.params = params;

   
  }

  
}