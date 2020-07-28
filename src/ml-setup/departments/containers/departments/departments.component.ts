import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';


@Component({
    selector: 'ml-departments',
    templateUrl: './departments.component.html',
    styleUrls: ['./departments.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DepartmentsComponent {
    searchedForValue: string;
    refreshGrid: boolean;
    selectedDept: any;
    reloadDepartment: any;
    editValue:any;

    constructor() { }
    
    onEditDept(department: any) {
        this.selectedDept = department;
    }
    onUpdateData(val) {
        this.refreshGrid = val;
    }
}