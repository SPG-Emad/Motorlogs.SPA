import { Component, OnInit , ChangeDetectionStrategy, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentsService } from 'ml-setup/shared/services/departments/departments.service';

@Component({
  selector: 'app-department-master-list',
  templateUrl: './department-master-list.component.html',
  styleUrls: ['./department-master-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DepartmentMasterListComponent implements OnInit {

  constructor( 
    private fb: FormBuilder,
    private departmentsService: DepartmentsService, 
    ) { }

  @Input() updateColumnID: any;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  departments: any[];
  options: any[] = ['On','Off'];
  departmentAccessValues= [
    {
      'code': 'ON-D',
      'value': 'On'
    },
    {
      'code': 'OFF-D',
      'value': 'Off'
    },
  ];
  
  departmentsForm: FormGroup;
  fieldCounter: number = 0;
  loader: boolean ;

  ngOnInit() {
    this.departmentsForm = this.fb.group({});
    this.loader= true;
    /*Fetch All Departments*/ 
    this.getDepartments();
    /*----------------------*/ 
  }

  setDepartmentFields(group){
      let departments = [
        {
          name : 'Lennock Jaguar',
          abbr: 'LJ',
          value: 'Off'
        },
        {
          name : 'Lennock Hyundai - New Cars',
          abbr: 'LH Old',
          value: 'On'
        }
      ];

      /*Loop over departments and store in form object*/ 
      departments.map(res=>{
        let label = res.abbr;
        group[label] = [res.value];  
      });
      /*---------------------*/ 
      

      /*Pass Department object into FormGroup*/ 
      this.departmentsForm = this.fb.group(group);
      this.departments = departments;
      this.loader = false;

      console.log(this.loader);

      /*-----------------------*/ 
  }

  getDepartments(){
    this.departmentsService.getAllDepartments()
    .subscribe(res=>{
        let departments = res;
        /*Generate Dynamic Form*/ 
        let group = {};


        if(this.updateColumnID){
          // this.generateRolesTable(1,this.searchedForValue,undefined);
          this.setDepartmentFields(group);
        }else{
          /*Loop over departments and store in form object*/ 
          departments.map(res=>{
            let label = res.abbr;
            group[label] = ["Off"];  
          });
          /*---------------------*/ 
          
  
          /*Pass Department object into FormGroup*/ 
          this.departmentsForm = this.fb.group(group);
          this.departments = res;
          /*-----------------------*/ 
          this.loader = false;

        }

    },(err)=>{},()=>{
      this.loader = false;

    });
  }

  submitForm(){
    let result = [];
    this.departments.map(res=>{
      let department = this.departmentsForm.get(res.abbr).value;
      let departmentSelected = this.departmentAccessValues.find(el=> el.value=== department);
      
      let obj =
        {
          "Code": res.abbr,
          "AccessValue": departmentSelected.code
        };
        
      result.push(obj);
    });
    return [...result];
  }

}
