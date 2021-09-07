import { Component, OnInit } from "@angular/core";
import { ICellRendererParams } from "@ag-grid-community/core";

@Component({
    selector: "dropdown-renderer",
    template: `<custom-dropdown
        [colDef]="colDef"
        [selected]="selected"
        [itemArray]="itemsArray"
        [rowDate]="rowDate"
        [flag]="customFlag"
        [viewId]="viewId"
    ></custom-dropdown> `,
})
export class DropDownRenderer implements OnInit {
    item: string = "";
    options: [];
    dateFlag: boolean = false;
    customFlag: boolean = false;
    rowDate: string;
    itemsArray: any[];
    selected: string;
    header: string;
    colDef: any;
    viewId: number;

    constructor() {
        // console.log("DropDownRenderer Constructor");
    }

    ngOnInit() {
        // console.log("DropDownRenderer ngOnInIt");
    }

    agInit(params): void {
        if (window.location.href.toLowerCase().indexOf("arriving") > -1) {
            this.viewId = 3;
        } else {
            this.viewId = 1;
        }

        this.colDef = params;
        this.itemsArray = params.data["cellOptions_" + params.colDef.colCode];
        this.selected = params.value;

        // This code will only run on grid initialization
        // console.log(params);
        if (params.value != null) {
            if (
                this.itemsArray.find(
                    (x) => x.code.toLowerCase() === params.value.toLowerCase()
                ) === undefined
            ) {
                // console.log("not found ", params.value);
                this.rowDate = params.value;
                this.selected = params.value;
            } else {
                // console.log("found: ", params.value);
                this.selected = params.value;
            }
        }
    }
}
