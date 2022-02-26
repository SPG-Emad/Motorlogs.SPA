// import { Component, ViewChild } from '@angular/core';
// import * as moment from 'moment';

// @Component({
//   selector: 'custom-dropdown-renderer',
//   template:
//     `<app-dropdown [header]="header" [colDef]="colDef" [selected]="selected" [itemArray]="itemsArray" [rowDate]="rowDate" [flag]="customFlag" ></app-dropdown>
//   ` ,
// })
// export class CustomDropDownRenderer  {
//   private params1: any;
//   options:['Cancelled','Pending','TBA','Delete'];
//   dateFlag : boolean = false;
//   customFlag: boolean = true;
//   rowDate:string;
//   itemsArray : [];
//   selected : string;
//   header : string;
//   colDef: any;

//   agInit(params): void {
//     this.header = params.colDef.headerName;
//     this.rowDate = params.value;
//     this.itemsArray = params.data["cellOptions_"+params.colDef.colCode];
//     this.selected = params.value;
//     this.colDef = params;
//   }
  
// }