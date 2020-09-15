import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'ml-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

    @Input() formDefaultState;
    @ViewChild('rolesForm', { static: true }) rolesForm;

    searchedForValue: string;
    editValue: any;
    reloadRoles: any;

    constructor() { }

    ngOnInit() {
    }

    resetForm() {
        this.rolesForm.resetFormDetails();
    }

}
