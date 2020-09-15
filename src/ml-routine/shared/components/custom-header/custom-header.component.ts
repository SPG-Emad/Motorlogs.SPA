import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  template: `
    <div class="cutomHeaderContainer">
      <div class="customHeaderLabel" *ngIf="params.displayName !=='.'">
        <h3>{{ params.displayName }}</h3>
      </div>
      <div
        *ngIf="params.enableMenu"
        #menuButton
        class="customHeaderMenuButton"
        (click)="onMenuClicked($event)"
      >
        <i class="fa {{ params.menuIcon }}"></i>
      </div>
    </div>
  `, 
  styles: [
    `:host{
      width: 100% !important;
  
  }
    ::ng-deep :host {
      width: 100% !important;
    }
    ::ng-deep .cutomHeaderContainer{
      display: flex !important;
      align-items: center !important;
      justify-content: space-between;
      width: 100%;
    }
    ::ng-deep .customHeaderLabel{
      h3{
        margin: 0  !important;
        font-size: 12px  !important;
      }
    }
    
      .customHeaderMenuButton,
      .customHeaderLabel,
      .customSortDownLabel,
      .customSortUpLabel,
      .customSortRemoveLabel {
        float: left;
        margin: 0 0 0 3px;
      }

      .customSortUpLabel {
        margin: 0;
      }

      .customSortRemoveLabel {
        font-size: 11px;
      }

      .active {
        color: cornflowerblue;
      }
    `,
  ],
})
export class CustomHeaderComponent {
  private params: any;


  @ViewChild('menuButton', { read: ElementRef,static:false }) public menuButton;

  agInit(params): void {
    this.params = params;

  }

  onMenuClicked() {
    console.log(this.menuButton)
    this.params.showColumnMenu(this.menuButton.nativeElement);
  }

}
