import { Component, OnInit  ,ChangeDetectionStrategy, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { RolesService } from 'ml-setup/shared/services/user-access-rights/roles.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-roles-list',
  templateUrl: './user-roles-list.component.html',
  styleUrls: ['./user-roles-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRolesListComponent implements OnInit {

  constructor( 
    private fb: FormBuilder,
    private roleService: RolesService, 
  ) { }


  @Input() updateColumnID: any;
  @Output() submit =  new EventEmitter();

  roles: any[];
  rolesOptions: any[] = ['Edit','Read Only','BLOCK'];
  options: any[] = ['On','Off'];
  discardRoles = ['BDM','MD','RM','DP','FC','IT']
  rolesAccessValues= [
    {
      'code': 'EDIT-U',
      'value': 'Edit'
    },
    {
      'code': 'BL-U',
      'value': 'BLOCK'
    },
    {
      'code': 'RO-U',
      'value': 'Read Only'
    },
  ];
  loader: boolean = false;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  rolesForm: FormGroup;

  fieldCounter: number = 0;

  ngOnInit() {
    this.rolesForm = this.fb.group({});
    this.getRoles();

  }


  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'updateColumnID': {
              /**
               * generateDepartmentsTable
               * 
               * @params type (0 = insert new data, 1 = filter)
               * 
               * */ 

              /*If edit values exist, call edit method to display values*/ 
              if(this.updateColumnID){
              
                  // this.generateRolesTable(1,this.searchedForValue,undefined);
              }
              /*-------------------------------------------------------*/ 
          }
        }
      }
    }
  }

  getRoles(){
    this.roleService.getRoles()
    .subscribe(res=>{

        /*Discard Predefined Roles*/ 
        let roles = res.filter(res=>{    
             return res.code !== this.discardRoles[0] && 
                    res.code !== this.discardRoles[1] && 
                    res.code !== this.discardRoles[2] && 
                    res.code !== this.discardRoles[3] && 
                    res.code !== this.discardRoles[4] && 
                    res.code !== this.discardRoles[5];
        });
        /*------------------------*/ 
        

        /*Generate Dynamic Form*/ 
        let group = {};


        /*Loop over roles and store in form object*/ 
        roles.map(res=>{
        let label = res.code;
        group[label] = ["BLOCK",[Validators.required]];  
        });
        this.roles = roles;
        /*---------------------*/ 
        

        /*Pass Roles object into FormGroup*/ 
        this.rolesForm = this.fb.group(group);
        /*-----------------------*/ 
    });
  }

  proceed(){
    this.loader = true;
    this.submit.emit();
  } 

  submitForm(){
    let result = [];
    this.loader = true;

    this.roles.map(res=>{
      let roles = this.rolesForm.get(res.code).value;
      let rolesAccessValues = this.rolesAccessValues.find(el=> el.value=== roles);

      let obj =
        {
          "code": res.code,
          "AccessValue": rolesAccessValues.code
        };
      result.push(obj);
    });
    return [...result];
  } 

  

}

