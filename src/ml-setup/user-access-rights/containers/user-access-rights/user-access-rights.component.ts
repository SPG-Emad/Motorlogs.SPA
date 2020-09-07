import { Component, OnInit, ChangeDetectionStrategy,ViewChild,  ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'ml-user-access-rights',
  templateUrl: './user-access-rights.component.html',
  styleUrls: ['./user-access-rights.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserAccessRightsComponent implements OnInit {
  
  formDefaultState: any;
  
  @ViewChild('userComp',{static:true}) userComp;
  @ViewChild('roleComp',{static:true}) roleComp;

  constructor() { }

  ngOnInit() {
  }

  tabChange(event){
    if(event.index === 0){
      this.roleComp.resetForm();
    }else{
      this.roleComp.resetForm();
    }
  }

}
