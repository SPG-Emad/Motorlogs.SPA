import { Component, OnInit } from "@angular/core";
@Component({
    selector: "custom-dropdown-renderer",
    template: `<custom-dropdown
        [colDef]="colDef"
        [header]="header"
        [selected]="selected"
        [itemArray]="itemsArray"
        [rowDate]="rowDate"
        [flag]="customFlag"
        [viewId]="viewId"
    ></custom-dropdown> `,
})

// used for dd-fixed, dd-suggest, dd-self
export class CustomDropDownRenderer implements OnInit {
    options: [];
    dateFlag: boolean = false;
    customFlag: boolean = true;
    rowDate: string;
    itemsArray: [];
    selected: string;
    header: string;
    colDef: any;
    viewId: number;

    constructor() {
       // console.log("CustomDropDownRenderer Constructor: " + this.header);
    }

    ngOnInit() {
       // console.log("CustomDropDownRenderer ngOnInIt: " + this.header);
    }

    agInit(params): void {
        if (window.location.href.toLowerCase().indexOf("arriving") > -1) {
            this.viewId = 3;
        } else {
            this.viewId = 1;
        }

        // console.log("params from customdropdownrederer: ", params);
        //  console.log("params.colDef: ", params.colDef);

        this.header = params.colDef.colCode;
        this.colDef = params;
        this.rowDate = params.value;
        this.itemsArray = params.data["cellOptions_" + params.colDef.colCode];
        this.selected = params.value;
    }
}
