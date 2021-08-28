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
    ></custom-dropdown> `,
})

// used for dd-fixed, dd-suggest, dd-self
export class CustomDropDownRenderer  implements OnInit{
    options: [];
    dateFlag: boolean = false;
    customFlag: boolean = true;
    rowDate: string;
    itemsArray: [];
    selected: string;
    header: string;
    colDef: any;

    constructor(){
        console.log("CustomDropDownRenderer Constructor: " + this.header);
    }

    ngOnInit() {
        console.log("CustomDropDownRenderer ngOnInIt: " + this.header);
    }

    agInit(params): void {
        this.header = params.colDef.headerName;
        this.colDef = params;
        this.rowDate = params.value;

        this.itemsArray = params.data["cellOptions_" + params.colDef.colCode];
        this.selected = params.value;
    }
}
