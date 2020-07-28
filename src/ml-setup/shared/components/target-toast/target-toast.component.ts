import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SharedService } from 'ml-setup/shared/services/shared/shared.service';

@Component({
  selector: 'app-target-toast',
  templateUrl: './target-toast.component.html',
  styleUrls: ['./target-toast.component.scss']
})
export class TargetToastComponent  {
  constructor( 
    public sharedService: SharedService,
    public snackBarRef: MatSnackBarRef<TargetToastComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }

  getData(){
    this.snackBarRef.dismiss();
    this.sharedService.sendClickEvent();
  }

  clearData(){
    this.snackBarRef.dismiss();
    this.sharedService.sendClearEvent();
  }
}
