import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import * as moment from "moment";
import { Subject } from "rxjs";

@Component({
    selector: "app-targets-filter",
    templateUrl: "./targets-filter.component.html",
    styleUrls: ["./targets-filter.component.scss"],
})
export class TargetsFilterComponent implements OnInit {
    @Output() dateFilter = new EventEmitter<any>();

    options = [
        { key: "month1", value: "3 Months", months: 3 },
        { key: "month2", value: "6 Months", months: 6 },
        { key: "month3", value: "12 Months", months: 12 },
    ];

    startFrom: any[] = [];
    startDateValue: any = "";
    historyValue: any = { key: "month1", value: "3 Months", months: 3 };
    periodValue: any = { key: "month1", value: "3 Months", months: 3 };

    displayKey = "value";
    isDisable = false;

    styleGuide = {
        // caretClass: 'caret',
        selectBoxClass: "dropdown-wrapper",
        selectMenuClass: "dropdown",
        optionsClass: "option",
    };

    styleGuideHistory = {
        // caretClass: 'caret',
        selectBoxClass: "dropdown-history",
        selectMenuClass: "dropdown",
        optionsClass: "option",
    };

    isDataList = false;
    searchKeys = ["key", "value"];
    private _unsubscribeAll: Subject<any>;

    constructor() {}

    ngOnInit() {
        this.generateMonths();
        let date = moment().format("MMM YY");
        let dateFormat = moment().format("MMM YYYY");
        this.startDateValue = { key: date, value: date, months: dateFormat };

        // console.log("this.historyValue", this.historyValue);
        setTimeout(() => {
            this.dateFilter.emit({
                filter: 1,
                history: this.historyValue.months,
                startFrom: this.startDateValue.months,
                period: this.periodValue.months,
            });
        }, 500);
    }

    generateMonths() {
        /*Loop 2 years (24 months) and fetch months  */
        for (let i = 0; i <= 24; i++) {
            /*Generate Key and value for startFrom Object from momentJs*/
            let month = moment().subtract(i, "months").format("MMM YY");
            let key = moment().subtract(i, "months").format("MMM") + i;
            let dateFormat = moment().subtract(i, "months").format("MMM YYYY");
            /*---------------------------------------------------------*/

            /*Push Into startFrom Array*/
            this.startFrom.push({
                key: key,
                value: month,
                months: dateFormat,
            });
            /*------------------*/
        }
        /*-------------------------------------------*/
    }

    changePeriod(event) {
        this.dateFilter.emit({
            filter: 3,
            period: event.months,
            history: this.historyValue.months,
            startFrom: this.startDateValue.months,
        });
    }

    changeStartFrom(event) {
        this.dateFilter.emit({
            filter: 2,
            startFrom: event.months,
            history: this.historyValue.months,
            period: this.periodValue.months,
        });
    }

    onHistoryChange(event) {
        this.dateFilter.emit({
            filter: 1,
            history: event.months,
            startFrom: this.startDateValue.months,
            period: this.periodValue.months,
        });
    }

    onDepartmentChange(event) {}
}
