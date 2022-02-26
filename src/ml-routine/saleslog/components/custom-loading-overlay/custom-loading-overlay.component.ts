import { Component, Input } from '@angular/core';
import { ILoadingOverlayAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './custom-loading-overlay.component.html',
  styleUrls: ['./custom-loading-overlay.component.scss'],
})
export class CustomLoadingOverlayComponent implements ILoadingOverlayAngularComp {
  private params: any;
// emad
  agInit(params): void {
    this.params = params;
  }
}