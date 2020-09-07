import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-date-filters',
  templateUrl: './date-filters.component.html',
  styleUrls: ['./date-filters.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateFiltersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
