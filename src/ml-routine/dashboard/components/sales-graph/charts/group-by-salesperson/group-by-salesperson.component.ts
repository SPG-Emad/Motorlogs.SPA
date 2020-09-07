import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-group-by-salesperson',
  templateUrl: './group-by-salesperson.component.html',
  styleUrls: ['./group-by-salesperson.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupBySalespersonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
