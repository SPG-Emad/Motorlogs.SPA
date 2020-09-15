import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-xls-export',
  templateUrl: './xls-export.component.html',
  styleUrls: ['./xls-export.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XlsExportComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder, 
  ) { }

  ngOnInit() {
  }
  
  modalTitle : string = "EXPORT OPTIONS";
  rows= "option";
  //Dispaly Message
  public message: string;

  excelForm: FormGroup = this.fb.group({
    printableColumns: [1],
    exportAll: [""],
    option: [{value: "D",disabled:true}],
    dateRange: [{value: "0",disabled:true}],      
    fileFormat: [{value: "xlsx",disabled:true}],
  });

  closeModal(){
    this.dialog.closeAll();
  }

  submit(){
    this.dialog.closeAll();

  }

  changeData(event){
    console.log(event.value);
    if(event.value==="2"){
      this.excelForm.get('option').enable();
      this.excelForm.get('dateRange').enable();
      this.excelForm.get('fileFormat').enable();
      
    }else{
      this.excelForm.get('option').disable();
      this.excelForm.get('dateRange').disable();
      this.excelForm.get('fileFormat').disable();
    }
  }

}
