import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-group-by-summary',
  templateUrl: './group-by-summary.component.html',
  styleUrls: ['./group-by-summary.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupBySummaryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
