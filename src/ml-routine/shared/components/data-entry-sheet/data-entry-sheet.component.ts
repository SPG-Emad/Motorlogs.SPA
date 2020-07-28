import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-data-entry-sheet',
  templateUrl: './data-entry-sheet.component.html',
  styleUrls: ['./data-entry-sheet.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataEntrySheetComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
