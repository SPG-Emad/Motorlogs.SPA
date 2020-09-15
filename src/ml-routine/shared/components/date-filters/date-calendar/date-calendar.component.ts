import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-date-calendar',
  templateUrl: './date-calendar.component.html',
  styleUrls: ['./date-calendar.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateCalendarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
