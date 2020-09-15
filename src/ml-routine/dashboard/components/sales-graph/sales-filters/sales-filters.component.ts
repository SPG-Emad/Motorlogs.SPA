import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sales-filters',
  templateUrl: './sales-filters.component.html',
  styleUrls: ['./sales-filters.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesFiltersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
