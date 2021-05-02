// import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'owl-date-picker-component',
//   templateUrl: './owl-date-picker-component.component.html',
//   styleUrls: ['./owl-date-picker-component.component.scss'],
//     changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class OwlDatePickerComponent implements OnInit {

//   public dateTime1: Date;

//   public dateTime2: Date;

//   public dateTime3: Date;

//   constructor() {
//   }

//   ngOnInit() {
//   }

// }

import {
    Component,
    ViewChildren,
} from "@angular/core";
// import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, MomentDateTimeAdapter } from '@danielmoncada/angular-datetime-picker';
import { ICellEditorAngularComp } from "@ag-grid-community/angular";
import {
    DateTimeAdapter,
    OWL_DATE_TIME_LOCALE,
    OWL_DATE_TIME_FORMATS,
} from "ng-pick-datetime";
import { MomentDateAdapter } from "@angular/material-moment-adapter";

export const MY_CUSTOM_FORMATS = {
    parseInput: "LL LT",
    fullPickerInput: "LL LT",
    datePickerInput: "LL",
    timePickerInput: "LT",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
};

@Component({
    selector: "date-editor-cell",
    templateUrl: "./owl-date-picker-component.component.html",
    // providers: [
    //     // `MomentDateTimeAdapter` can be automatically provided by importing
    //     // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    //     // here, due to limitations of our example generation script.
    //     {
    //         provide: DateTimeAdapter,
    //         useClass: MomentDateAdapter,
    //         deps: [OWL_DATE_TIME_LOCALE],
    //     },

    //     { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
    // ],
})
export class OwlDatePickerComponent implements ICellEditorAngularComp {
    private params: any;
    public dateValue: any;
    public selected: boolean = false;
    @ViewChildren("myInput") vc;
    public selectedDate: Date = new Date();
    public isUnix: boolean;
    agInit(params: any): void {
        this.params = params;
        this.dateValue = this.params.value;
        this.isUnix = params.isUnix;
    }

    getValue(): any {
        if (!this.selectedDate) {
            return null;
        }
        let result;
        if (this.isUnix) {
            result = Math.floor(this.selectedDate.getTime() / 1000);
        } else {
            //build ISO date
            result =
                this.selectedDate.getFullYear() +
                "-" +
                ("0" + (this.selectedDate.getMonth() + 1)).slice(-2) +
                "-" +
                ("0" + this.selectedDate.getDate()).slice(-2) +
                "T" +
                ("0" + this.selectedDate.getHours()).slice(-2) +
                ":" +
                ("0" + this.selectedDate.getMinutes()).slice(-2) +
                ":" +
                ("0" + this.selectedDate.getSeconds()).slice(-2);
        }
        return result;
    }

    isPopup(): boolean {
        return true;
    }

    set() {
        this.selected = true;
        this.params.api.stopEditing(false);
    }
    reset() {
        this.selected = true;
        this.selectedDate = null;
        this.params.api.stopEditing(false);
    }

    cancel() {
        this.selected = true;
        this.params.api.stopEditing(true);
    }

    onClick(date: any) {
        this.selectedDate = date.toDate();
    }
}
