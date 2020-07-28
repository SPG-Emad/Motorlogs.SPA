import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-column-options',
  templateUrl: './column-options.component.html',
  styleUrls: ['./column-options.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnOptionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
