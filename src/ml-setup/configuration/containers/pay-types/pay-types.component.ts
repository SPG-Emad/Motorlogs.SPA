import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'ml-pay-types',
    templateUrl: './pay-types.component.html',
    styleUrls: ['./pay-types.component.scss'],

})
export class PayTypesComponent implements OnInit {

    @Input() formDefaultState;
    @ViewChild('payTypeForm', { static: true }) payTypeForm;

    searchedForValue: string;
    editValue: any;
    reloadPayType: any;

    constructor() { }

    ngOnInit() {
    }

    resetForm() {
        this.payTypeForm.resetFormDetails();
    }

}
