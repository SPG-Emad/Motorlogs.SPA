import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-xls-export',
  templateUrl: './xls-export.component.html',
  styleUrls: ['./xls-export.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XlsExportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
