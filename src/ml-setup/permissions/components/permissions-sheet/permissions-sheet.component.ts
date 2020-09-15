import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-permissions-sheet',
  templateUrl: './permissions-sheet.component.html',
  styleUrls: ['./permissions-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsSheetComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
