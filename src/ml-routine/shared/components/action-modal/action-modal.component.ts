import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-action-modal',
  templateUrl: './action-modal.component.html',
  styleUrls: ['./action-modal.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
