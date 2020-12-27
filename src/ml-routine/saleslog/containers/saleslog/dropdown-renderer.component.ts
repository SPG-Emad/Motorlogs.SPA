import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'dropdown-renderer',
  template:
    `<app-single-selection-example  [colDef]="colDef" [itemArray]="itemsArray" [flag]="customFlag"></app-single-selection-example>
  ` ,
})
export class DropDownRenderer  {
  private params1: any;
  item : string ="UU";
  options:['Cancelled','Pending','TBA','Delete'];
  dateFlag : boolean = false;
  customFlag : boolean = false;
  itemsArray : [];
  colDef: any;
 
  agInit(params): void {
   
    this.colDef = params.colDef;
    this.itemsArray = params.data["cellOptions_"+params.colDef.colCode];

    if(params.value!=null) {
        (params.data["cellOptions_"+params.colDef.colCode] && params.data["cellOptions_"+params.colDef.colCode].length > 0) ?params.data["cellOptions_"+params.colDef.colCode][0].details :"no cell option data";
      }else {
        // console.log("No Data");
      }  
  }

  
}