import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-pivot-data',
  templateUrl: './pivot-data.component.html',
  styleUrls: ['./pivot-data.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PivotDataComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
