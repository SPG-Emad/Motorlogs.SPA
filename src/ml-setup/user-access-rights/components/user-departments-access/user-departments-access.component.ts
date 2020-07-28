import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { UserStateService } from 'ml-setup/shared/ngrx/service/user-state.service';
import { DepartmentsService } from 'ml-setup/shared/services/departments/departments.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'ml-user-departments-access',
    templateUrl: './user-departments-access.component.html',
    styleUrls: ['./user-departments-access.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDepartmentsAccessComponent implements OnInit {

    @Input() rolePrivileges: any[];

    sales = false;
    trade = false;

    departments: any[] = [];

    userStoreData$: Observable<any>;
 

    constructor(
        private fb: FormBuilder,
        private userState: UserStateService,
        private departmentsService: DepartmentsService,
    ) {

    }
    @ViewChild('f', { static: true }) myNgForm: NgForm;
    userDepartmentForm;

    ngOnInit() {
        /*Generate Dynamic Form*/
        const group = {};


        /*Loop over departments and store in form object*/
        this.departments = this.departmentsService.departmentList;
        this.departmentsService.departmentList.map(res => {
            const label = res.abbr;
            group[label] = this.newFormGroup();
        });
        /*---------------------*/


        /*Pass Department object into FormGroup*/
        this.userDepartmentForm = this.fb.group(group);
        /*-----------------------*/


        /*Fetch Data from User data and set all fields if editing*/
        this.userState.setDepartmentAccessForm(this.userDepartmentForm);
        /*--------------------------------------------*/

    }


    newFormGroup(isActiveSales: boolean = false, isActiveTrade: boolean = false): FormGroup {
        return this.fb.group({
            sales: [{ value: false, disabled: isActiveSales }],
            trade: [{ value: false, disabled: isActiveTrade }]
        });
    }


    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'rolePrivileges': {
                        /**                   * 
                         * @rolePrivileges type (0 = Sales, 1 = Trade )
                         * 
                         * */
                        this.sales = this.rolePrivileges[0];
                        this.trade = this.rolePrivileges[1];
                    }
                }
            }
        }

    }

    fetchSubmittedValues() {
        const result = [];
        this.departmentsService.departmentList.map(res => {
            const department = this.userDepartmentForm.get(res.abbr).value;
            const obj =
            {
                departmentId: res.id,
                departmentName: res.name,
                departmentCode: res.abbr,
                sales: department.sales,
                trade: department.trade
            };
            result.push(obj);
        });

        return result;
    }

    submitForm() {
        /**
         * Check Form Status is valid or not. 
         * If valid show status and pass form values
         * Else pass invalid status
         * 
         * */
        if (this.myNgForm.valid) {
            return [this.myNgForm.valid, this.fetchSubmittedValues()];
        }
        return [this.myNgForm.valid];
        /*---------------------------*/
    }
}
