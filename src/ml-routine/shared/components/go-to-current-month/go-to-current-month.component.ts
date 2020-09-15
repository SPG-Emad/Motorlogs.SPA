import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-go-to-current-month',
  templateUrl: './go-to-current-month.component.html',
  styleUrls: ['./go-to-current-month.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoToCurrentMonthComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
