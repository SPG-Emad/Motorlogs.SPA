import { SaleslogService } from 'ml-routine/shared/services/saleslog/saleslog.service';
import { Component } from '@angular/core';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalStorageHandlerService } from 'app/shared/services/local-storage-handler.service';
declare var $: any;


 @Component({
  selector: 'app-loading-cell-renderer',
  template:
    ` <div class="ag-custom-loading-cell" style="padding-left: 0 !important; line-height: 29px;">` +
    ` <i class="fas fa-spinner fa-pulse"></i> <span> <input id='{{dateIndex}}' type="text"  value="{{dateValue}}"> </span>` +
    `</div>`,
    
  styleUrls: ['./saleslog.component.scss']
}) 
export class CalenderRenderer  {
  private params: any;
  dateValue:string;
  dateIndex : string;
  dateFlag : boolean = false;
  dateField: any;
  paramsObject:any;
  constructor(
    private salesLogService: SaleslogService,
    private LocalStorageHandlerService: LocalStorageHandlerService,
  ){}

  agInit(params): void {

   
    this.dateIndex ="datetimepicker"+ Number(params.colDef.field)+params.data.rowId;
    this.paramsObject = params;
    // let dateField = '<input style="width: 100%;" id='+this.dateIndex+' (change)="getSelectedDate($event)"  type="text"  value="{{dateValue}}"> </span>';
    // this.dateField = this.sr.bypassSecurityTrustHtml(dateField);

    $.datetimepicker.setLocale('en');
    $('span>input').datetimepicker({
      onChangeDateTime: this.insertData.bind(this),
      // mask:true,
      format:'m/d/Y',
      timepicker: false,
      inline:false
    });

    this.dateValue = params.value;
    this.params = params;
  }

  insertData(dateText){
    console.log("Selected date: " + dateText);
    let params = { 
      "userid": this.LocalStorageHandlerService.getSession('userObj').userId, 
      "EntryId": 1005, // Parent ID of the row for which cell he is editing 
      "ViewID": 1, 
      "colId": this.paramsObject.colDef.colId, 
      "ColType": this.paramsObject.colDef.columnType, // You need to send the column type 
      "Value": dateText 
    }
    this.salesLogService.insertCellValue(params)
    .subscribe(res=>{

    })
  }

}