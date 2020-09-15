import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as PermissionActions from "../../../shared/ngrx/actions/permissions.actions";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PermissionStateService {

  permissionStoreData$: Observable<any>;

  constructor(private store : Store<any>) {
    
    /*Fetch selected permission for editing if exist*/ 
    this.permissionStoreData$ = store.select('permission');
    /*------------------------------*/ 
  }

  getPermissionStore(form:any, params?:any){
    /*Subscribe to store and get permission state if exist*/ 
    this.permissionStoreData$.subscribe(res=>{
      console.log(res);
      if(res && res.firstName){
        if(params){
          form.patchValue(res[params][0]);
        }else{
          form.patchValue(res[0]);
        }
      }
    });
    /*--------------------------------------------------*/ 

  }
  
  addPermissionToStore(PermissionObj){
    this.store.dispatch(new PermissionActions.AddPermission(PermissionObj))
  }

  resetPermissionState(){
    this.store.dispatch(new PermissionActions.ResetPermission())
  }
}
