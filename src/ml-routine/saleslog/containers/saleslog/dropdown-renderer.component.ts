import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'dropdown-renderer',
  template:
    `<app-single-selection-example [itemArray]="itemsArray" [flag]="customFlag"></app-single-selection-example>
  ` ,
})
export class DropDownRenderer  {
  private params1: any;
  item : string ="UU";
  options:['Cancelled','Pending','TBA','Delete'];
  dateFlag : boolean = false;
  customFlag : boolean = false;
  itemsArray : [];

 

  

  agInit(params): void {
   
    // console.log( "Column Header " +params.colDef.headerName);
    // console.log( "Column Header Value " +params.value);
    // console.log("Option Items array ");
    // console.log(params.data["cellOptions_"+params.colDef.colCode]);
    this.itemsArray = params.data["cellOptions_"+params.colDef.colCode];
    // console.log("Option Items Style ");
    // console.log(params);
    if(params.value!=null) {
        (params.data["cellOptions_"+params.colDef.colCode] && params.data["cellOptions_"+params.colDef.colCode].length > 0) ?params.data["cellOptions_"+params.colDef.colCode][0].details :"no cell option data";
      }else {
        // console.log("No Data");
      } 
  
      //console.log(params);
     
    //this.params = params;

   
  }

  
}