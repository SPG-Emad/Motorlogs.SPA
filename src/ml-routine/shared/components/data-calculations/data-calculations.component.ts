import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-data-calculations',
  templateUrl: './data-calculations.component.html',
  styleUrls: ['./data-calculations.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataCalculationsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
