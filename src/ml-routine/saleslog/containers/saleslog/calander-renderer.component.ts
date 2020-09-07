import { Component } from '@angular/core';
import * as moment from 'moment';
declare var $: any;


 @Component({
  selector: 'app-loading-cell-renderer',
  template:
    ` <div class="ag-custom-loading-cell" style="padding-left: 0; line-height: 29px;">` +
    ` <i class="fas fa-spinner fa-pulse"></i> <span><input id="datetimepicker{{dataIndex}}"  type="text"  value="{{dateValue}}"> </span>` +
    `</div>`,
    
  styleUrls: ['./saleslog.component.scss']
}) 
export class CalenderRenderer  {
  private params: any;
  dateValue:string;
  dateIndex : string;
  dateFlag : boolean = false;

  

  agInit(params): void {

   
    this.dateIndex = params.colDef.field+params.data.rowId;

    $.datetimepicker.setLocale('en');
    $('[id^=datetimepicker]').datetimepicker({
      format:'m/d/Y',
      //dateFormat: "DD-MMM-YY",
      allowTimes:[
        '0:00','9:00', '9:30','10:00','10:30', '11:00','11:30',
        '12:00','12:30','01:00','1:30','2:30','3:00',
        '3:30','4:00','4:30','5:00','5:30'
        ],
        timepicker: false,
     inline:false
     });

    // console.log(params);
   
  //  console.log("data index"+this.dateIndex);
  //  console.log( "Column Header " +params.colDef.headerName);
   console.log( "Column Header Value " +params.value);
   this.dateValue = params.valueFormatted;
   this.params = params;

  
  

    
 

   
  }
}