import { Component } from "@angular/core";

@Component({
    selector: "custom-dropdown-renderer",
    template: `<app-single-selection-example
        [colDef]="colDef"
        [header]="header"
        [selected]="selected"
        [itemArray]="itemsArray"
        [rowDate]="rowDate"
        [flag]="customFlag"
    ></app-single-selection-example> `,
})

export class CustomDropDownRenderer {
    private params1: any;
    options: [];
    dateFlag: boolean = false;
    customFlag: boolean = true;
    rowDate: string;
    itemsArray: [];
    selected: string;
    header: string;
    colDef: any;

    agInit(params): void {
        this.header = params.colDef.headerName;
        this.colDef = params;
        this.rowDate = params.value;

        this.itemsArray = params.data["cellOptions_" + params.colDef.colCode];
        this.selected = params.value;
    }
}
