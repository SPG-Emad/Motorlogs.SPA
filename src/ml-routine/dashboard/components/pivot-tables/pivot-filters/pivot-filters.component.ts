import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-pivot-filters',
  templateUrl: './pivot-filters.component.html',
  styleUrls: ['./pivot-filters.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PivotFiltersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
