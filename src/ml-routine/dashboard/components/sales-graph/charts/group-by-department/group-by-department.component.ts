import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-group-by-department',
  templateUrl: './group-by-department.component.html',
  styleUrls: ['./group-by-department.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupByDepartmentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
