import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';

declare var $: any;


@Component({
  selector: 'app-date-time',
  templateUrl: './app-component-date-time.component.html'
})


export class AppComponentDateTime implements OnInit  {
  
  constructor(){
    
  }



  ngOnInit() {
    $.datetimepicker.setLocale('en');
    $('#datetimepicker3').datetimepicker({
      inline:true
    });
    //  $('#datetimepicker').datetimepicker({value:'2015/04/15 05:03', step:10});
  
    

  }


}
