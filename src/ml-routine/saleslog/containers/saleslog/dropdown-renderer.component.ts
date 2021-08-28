import { Component, OnInit } from "@angular/core";
@Component({
    selector: "dropdown-renderer",
    template: `<custom-dropdown
        [colDef]="colDef"
        [selected]="selected"
        [itemArray]="itemsArray"
        [rowDate]="rowDate" 
        [flag]="customFlag"
    ></custom-dropdown> `,
})
export class DropDownRenderer implements OnInit{
    item: string = "";
    options: [];
    dateFlag: boolean = false;
    customFlag: boolean = false;
    rowDate: string;
    itemsArray: [];
    selected: string;
    header: string;
    colDef: any;

    constructor(){
        console.log("DropDownRenderer Constructor");
    }

    ngOnInit() {
        console.log("DropDownRenderer ngOnInIt");
    }

    agInit(params): void {
        this.colDef = params;
        this.itemsArray = params.data["cellOptions_" + params.colDef.colCode];
        this.selected = params.value;

        console.log('items array: ', this.itemsArray);
        console.log('params: ', params);

        if(params.value != null && this.itemsArray.find(x=> x.code.toLowerCase() === params.value.toLowerCase()) === undefined){
            console.log('not found ', params.value);
            this.rowDate = params.value;
            this.selected = params.value;
        }else{
            console.log('found');
            this.selected = params.value;
        }
       
        console.log("params :::: ", params);
        console.log("this.itemsArray :::: ", this.itemsArray);
    }
}
